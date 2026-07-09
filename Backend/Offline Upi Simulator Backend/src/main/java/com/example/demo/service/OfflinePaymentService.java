package com.example.demo.service;

import com.example.demo.dto.OfflinePaymentRequest;
import com.example.demo.dto.PaymentRequest;
import com.example.demo.dto.RelayAuthorizeRequest;
import com.example.demo.entity.PaymentPacket;
import com.example.demo.entity.RelayLog;
import com.example.demo.repository.PaymentPacketRepository;
import com.example.demo.repository.RelayLogRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class OfflinePaymentService {

    private final PaymentPacketRepository paymentPacketRepository;
    private final PaymentService paymentService;
    private final RelayLogRepository relayLogRepository;
    private final HashService hashService;
    private final SimpMessagingTemplate messagingTemplate;

    public OfflinePaymentService(PaymentPacketRepository paymentPacketRepository,
                                 PaymentService paymentService,
                                 RelayLogRepository relayLogRepository,
                                 HashService hashService,
                                 SimpMessagingTemplate messagingTemplate){
        this.paymentPacketRepository=paymentPacketRepository;
        this.paymentService=paymentService;
        this.relayLogRepository=relayLogRepository;
        this.hashService=hashService;
        this.messagingTemplate=messagingTemplate;
    }

    public PaymentPacket createOfflinePacket(OfflinePaymentRequest request){
        Integer ttl= request.getTtlSeconds();
        if(ttl== null || ttl<=0){
            ttl=60;
        }

        PaymentPacket packet= PaymentPacket.builder()
                .packetId(UUID.randomUUID().toString())
                .senderUpi(request.getSenderUpi())
                .receiverUpi(request.getReceiverUpi())
                .amount(request.getAmount().setScale(2, java.math.RoundingMode.HALF_UP))
                .upiPin(request.getUpiPin())
                .status("PENDING")
                .ttlSeconds(ttl)
                .createdAt(LocalDateTime.now())
                .processedAt(null)
                .build();

        String hash = hashService.generateHash(packet);
        packet.setPayloadHash(hash);

        PaymentPacket savedpacket= paymentPacketRepository.save(packet);

        messagingTemplate.convertAndSend(
                "/topic/packets",
                "NEW_PACKET_CREATED"
        );
        return savedpacket;
    }

    public PaymentPacket authorizePacket(String packetId, RelayAuthorizeRequest relayRequest){
        PaymentPacket packet = paymentPacketRepository.findByPacketId(packetId)
                .orElseThrow(()-> new RuntimeException("Packet not found"));

        String relayNodeId= relayRequest.getRelayNodeId();

        if(relayNodeId==null || relayNodeId.isBlank()){
            relayNodeId ="UNKNOWN_RELAY";
        }

        if(relayRequest.getInternetAvailable() ==null || !relayRequest.getInternetAvailable()){ // If internet availability is not provided or false, we consider it as offline
            saveRelayLog(packetId, relayNodeId, "NO_INTERNET", "Relay node has no internet");
            return packet;
        }



        if(!packet.getStatus().equals("PENDING")){
            saveRelayLog(packetId, relayNodeId, "ALREADY_PROCESSED", "Packet already processed");
            return packet;
        }

        saveRelayLog(packetId, relayNodeId, "FORWARDED_TO_BANK", "Packet forwarded to bank");

        LocalDateTime expiryTime= packet.getCreatedAt().plusSeconds(packet.getTtlSeconds());

        if(LocalDateTime.now().isAfter(expiryTime)){
            packet.setStatus("EXPIRED");
            packet.setProcessedAt(LocalDateTime.now());
            PaymentPacket savePacket= paymentPacketRepository.save(packet);
            saveRelayLog(packetId, relayNodeId, "EXPIRED", "Packet TTL expired");

            messagingTemplate.convertAndSend(
                    "/topic/packets",
                    "PACKET_EXPIRED"
            );
            return savePacket;
        }

        String recalculateHash= hashService.generateHash(packet);

        System.out.println("OLD HASH = "+ packet.getPayloadHash());
        System.out.println("NEW HASH = "+ recalculateHash);

        if(!recalculateHash.equals(packet.getPayloadHash())){
            packet.setStatus("FAILED");
            packet.setProcessedAt(LocalDateTime.now());

            PaymentPacket savedPacket = paymentPacketRepository.save(packet);

            saveRelayLog(packetId,relayNodeId, "TAMPERED", "Packet data was modified");

            messagingTemplate.convertAndSend(
                    "/topic/packets",
                    "PACKET_TAMPERED"
            );

            return savedPacket;
        }

        PaymentRequest paymentRequest = new PaymentRequest(
                packet.getPacketId(),
                packet.getSenderUpi(),
                packet.getReceiverUpi(),
                packet.getAmount(),
                packet.getUpiPin()
        );

        if(packet.getAmount().compareTo(new java.math.BigDecimal("10000"))>0){
            saveRelayLog(
                    packetId,
                    relayNodeId,
                    "HIGH_VALUE_TRANSACTION",
                    "Amount is above risk threshold"
            );
        }



        String result = paymentService.sendMoney(paymentRequest);

        if(result.equalsIgnoreCase("Payment successful")){
            packet.setStatus("SUCCESS");
            saveRelayLog(packetId,relayNodeId,"SUCCESS", "Payment authorize successfully");
        }
        else if (result.equalsIgnoreCase("Duplicate transaction ignored")) {
            packet.setStatus("SUCCESS");
            saveRelayLog(packetId, relayNodeId, "DUPLICATE_TRANSACTION", "Duplicate transaction ignored");
        }
        else{
            packet.setStatus("FAILED");
            saveRelayLog(packetId, relayNodeId, "FAILED", result);
        }


        PaymentPacket savedPacket= paymentPacketRepository.save(packet);

        messagingTemplate.convertAndSend(
                "/topic/packets",
                "PACKET_STATUS_UPDATED"
        );
        return savedPacket;
    }

    private void saveRelayLog(String packetId, String relayNodeId, String action, String message){
        RelayLog log= RelayLog.builder()
                .packetId(packetId)
                .relayNodeId(relayNodeId)
                .action(action)
                .message(message)
                .createdAt(LocalDateTime.now())
                .build();

        relayLogRepository.save(log);
    }
}

package com.example.demo.service;

import com.example.demo.entity.PaymentPacket;
import com.example.demo.entity.RelayLog;
import com.example.demo.repository.PaymentPacketRepository;
import com.example.demo.repository.RelayLogRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PacketExpiryScheduler {

    private final PaymentPacketRepository paymentPacketRepository;
    private final RelayLogRepository relayLogRepository;

    public PacketExpiryScheduler(PaymentPacketRepository paymentPacketRepository, RelayLogRepository relayLogRepository){
        this.paymentPacketRepository=paymentPacketRepository;
        this.relayLogRepository=relayLogRepository;
    }

    @Scheduled(fixedRate = 60000)
    public void expiredOldPendingPackets(){
        List<PaymentPacket> pendingPackets= paymentPacketRepository.findByStatus("PENDING");
        for(PaymentPacket packet : pendingPackets){
            LocalDateTime expiryTime = packet.getCreatedAt().plusSeconds(packet.getTtlSeconds());

            if(LocalDateTime.now().isAfter(expiryTime)){
                packet.setStatus("EXPIRED");
                packet.setProcessedAt(LocalDateTime.now());

                paymentPacketRepository.save(packet);

                RelayLog log= RelayLog.builder()
                        .packetId(packet.getPacketId())
                        .relayNodeId("SYSTEM_SCHEDULER")
                        .action("AUTO_EXPIRED")
                        .message("Packet expired automatically by scheduler")
                        .createdAt(LocalDateTime.now())
                        .build();

                relayLogRepository.save(log);

                System.out.println("Expired packet: "+packet.getPacketId());
            }
        }
    }
}

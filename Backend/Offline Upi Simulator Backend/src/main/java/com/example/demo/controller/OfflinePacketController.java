package com.example.demo.controller;

import com.example.demo.dto.OfflinePaymentRequest;
import com.example.demo.dto.RelayAuthorizeRequest;
import com.example.demo.entity.PaymentPacket;
import com.example.demo.entity.RelayLog;
import com.example.demo.repository.PaymentPacketRepository;
import com.example.demo.repository.RelayLogRepository;
import com.example.demo.service.OfflinePaymentService;
import org.springframework.web.bind.annotation.*;
import com.example.demo.dto.PaymentPacketResponse;
import java.util.stream.Collectors;

import java.util.List;

@RestController
@RequestMapping("/api/offline-payments")
@CrossOrigin(origins ="http://localhost:5173")
public class OfflinePacketController {

    private final OfflinePaymentService offlinePaymentService;
    private final PaymentPacketRepository paymentPacketRepository;
    private final RelayLogRepository relayLogRepository;


    public OfflinePacketController(OfflinePaymentService offlinePaymentService,
                                   PaymentPacketRepository paymentPacketRepository,
                                   RelayLogRepository relayLogRepository){
        this.offlinePaymentService= offlinePaymentService;
        this.paymentPacketRepository=paymentPacketRepository;
        this.relayLogRepository=relayLogRepository;


    }

    @PostMapping("/create-packet")
    public PaymentPacketResponse createOfflinePacket(@RequestBody OfflinePaymentRequest request){
        PaymentPacket packet= offlinePaymentService.createOfflinePacket(request);
        return PaymentPacketResponse.fromEntity(packet);
    }

    @GetMapping("/pending")
    public List<PaymentPacketResponse> getPendingPacket(){
        return paymentPacketRepository.findByStatusOrderByCreatedAtDesc("PENDING")
                .stream()
                .map(PaymentPacketResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @PostMapping("/authorize/{packetId}")
    public PaymentPacketResponse authorizePacket(@PathVariable String packetId,
                                         @RequestBody RelayAuthorizeRequest relayRequest){
        PaymentPacket packet= offlinePaymentService.authorizePacket(packetId, relayRequest);
        return PaymentPacketResponse.fromEntity(packet);
    }

    @GetMapping("/logs/{packetId}")
    public List<RelayLog> getRelayLogs(@PathVariable String packetId){
        return relayLogRepository.findByPacketIdOrderByCreatedAtDesc(packetId);
    }

    @GetMapping("/status/{packetId}")
    public PaymentPacketResponse getPacketStatus(@PathVariable String packetId){
        PaymentPacket packet = paymentPacketRepository.findByPacketId(packetId)
                .orElseThrow(() -> new RuntimeException("Packet not found"));

        return PaymentPacketResponse.fromEntity(packet);
    }
}


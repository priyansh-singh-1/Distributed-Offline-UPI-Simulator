package com.example.demo.dto;

import com.example.demo.entity.PaymentPacket;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaymentPacketResponse {

    private Long id;
    private String packetId;
    private String senderUpi;
    private String receiverUpi;
    private BigDecimal amount;
    private String status;
    private Integer ttlSeconds;
    private String payLoadHash;
    private LocalDateTime createdAt;
    private LocalDateTime processedAt;


    public static PaymentPacketResponse fromEntity(PaymentPacket packet){
        return PaymentPacketResponse.builder()
                .id(packet.getId())
                .packetId(packet.getPacketId())
                .senderUpi(packet.getSenderUpi())
                .receiverUpi(packet.getReceiverUpi())
                .amount(packet.getAmount())
                .status(packet.getStatus())
                .ttlSeconds(packet.getTtlSeconds())
                .payLoadHash(packet.getPayloadHash())
                .createdAt(packet.getCreatedAt())
                .processedAt(packet.getProcessedAt())
                .build();
    }

}

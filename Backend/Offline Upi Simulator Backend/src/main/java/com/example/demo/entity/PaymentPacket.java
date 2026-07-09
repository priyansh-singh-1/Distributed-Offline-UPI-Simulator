package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name="payment_packets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentPacket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String packetId;

    private String senderUpi;

    private String receiverUpi;

    private BigDecimal amount;

    private String upiPin;

    private String status;

    private Integer ttlSeconds;

    private String payloadHash;

    private LocalDateTime createdAt;

    private LocalDateTime processedAt;


}

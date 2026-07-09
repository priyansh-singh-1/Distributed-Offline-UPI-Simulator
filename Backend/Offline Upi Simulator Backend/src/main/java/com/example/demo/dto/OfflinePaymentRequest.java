package com.example.demo.dto;


import lombok.Data;

import java.math.BigDecimal;

@Data
public class OfflinePaymentRequest {
    private String senderUpi;
    private String receiverUpi;
    private BigDecimal amount;
    private String upiPin;

    private Integer ttlSeconds; // validity period of packet in seconds

}

package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor //@AllArgsConstructor isliye chahiye kyunki hum packet se payment request banayenge.
@NoArgsConstructor
public class PaymentRequest {
    private String transactionId;
    private String senderUpi;
    private String receiverUpi;
    private BigDecimal amount;
    private String upiPin;


}

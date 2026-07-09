package com.example.demo.dto;

import com.example.demo.entity.Transaction;
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
public class ReceiptResponse {

    private String transactionID;
    private String senderUpi;
    private String receiverUpi;
    private BigDecimal amount;
    private String status;
    private String failureReason;
    private LocalDateTime createdAt;

    public static ReceiptResponse fromEntity(Transaction transaction){
        return ReceiptResponse.builder()
                .transactionID(transaction.getTransactionId())
                .senderUpi(transaction.getSenderUpi())
                .receiverUpi(transaction.getReceiverUpi())
                .amount(transaction.getAmount())
                .status(transaction.getStatus())
                .failureReason(transaction.getFailureReason())
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}

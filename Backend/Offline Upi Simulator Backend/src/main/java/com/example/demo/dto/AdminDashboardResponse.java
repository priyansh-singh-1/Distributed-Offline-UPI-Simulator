package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdminDashboardResponse {

    private Long totalUsers;

    private Long totalTransactions;
    private Long successfulTransactions;
    private Long failedTransactions;

    private Long pendingPackets;
    private Long successPackets;
    private Long failedPackets;
    private Long expiredPackets;
    private Long tamperedPackets;

    private BigDecimal totalTransferredAmount;
}

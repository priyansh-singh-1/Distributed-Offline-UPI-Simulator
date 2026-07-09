package com.example.demo.service;

import com.example.demo.dto.AdminDashboardResponse;
import com.example.demo.repository.PaymentPacketRepository;
import com.example.demo.repository.RelayLogRepository;
import com.example.demo.repository.TransactionRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class AdminService {
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final PaymentPacketRepository paymentPacketRepository;
    private final RelayLogRepository relayLogRepository;

    public AdminService(UserRepository userRepository,
                        TransactionRepository transactionRepository,
                        PaymentPacketRepository paymentPacketRepository,
                        RelayLogRepository relayLogRepository){
        this.userRepository=userRepository;
        this.transactionRepository=transactionRepository;
        this.paymentPacketRepository=paymentPacketRepository;
        this.relayLogRepository=relayLogRepository;
    }

    public AdminDashboardResponse getDashboardStats(){
        BigDecimal totalAmount = transactionRepository.getTotalSuccessfulAmount();

        return AdminDashboardResponse.builder()
                .totalUsers(userRepository.count())

                .totalTransactions(transactionRepository.count())
                .successfulTransactions(transactionRepository.countByStatus("SUCCESS"))
                .failedTransactions(transactionRepository.countByStatus("FAILED"))

                .pendingPackets(paymentPacketRepository.countByStatus("PENDING"))
                .successPackets(paymentPacketRepository.countByStatus("SUCCESS"))
                .failedPackets(paymentPacketRepository.countByStatus("FAILED"))
                .expiredPackets(paymentPacketRepository.countByStatus("EXPIRED"))

                .tamperedPackets(relayLogRepository.countByAction("TAMPERED"))

                .totalTransferredAmount(totalAmount)
                .build();


    }
}

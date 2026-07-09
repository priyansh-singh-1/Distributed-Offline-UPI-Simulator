package com.example.demo.repository;

import com.example.demo.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    boolean existsByTransactionId(String transactionId);

    Optional<Transaction> findByTransactionId(String transactionId);

    List<Transaction> findBySenderUpiOrReceiverUpiOrderByCreatedAtDesc(
            String senderUpi,
            String receiverUpi
    );

    long countByStatus(String status);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM TransactionEntity t WHERE t.status = 'SUCCESS'")
    BigDecimal getTotalSuccessfulAmount();

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM TransactionEntity t " +
            "WHERE t.senderUpi = :senderUpi " +
            "AND t.status = 'SUCCESS' " +
            "AND t.createdAt BETWEEN :startOfDay AND :endOfDay")
    BigDecimal getTodaySentAmount(
            @Param("senderUpi") String senderUpi,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay);


}
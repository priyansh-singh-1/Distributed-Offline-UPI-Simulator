package com.example.demo.repository;

import com.example.demo.entity.PaymentPacket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PaymentPacketRepository extends JpaRepository<PaymentPacket, Long> {
    Optional<PaymentPacket> findByPacketId(String packetId);

    boolean existsByPacketId(String packetId);

    List<PaymentPacket> findByStatusOrderByCreatedAtDesc(String status);

    List<PaymentPacket> findByStatus(String status);

    long countByStatus(String status);

}

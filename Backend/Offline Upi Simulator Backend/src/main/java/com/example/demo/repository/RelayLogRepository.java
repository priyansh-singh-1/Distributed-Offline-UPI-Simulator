package com.example.demo.repository;

import com.example.demo.entity.RelayLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RelayLogRepository extends JpaRepository<RelayLog,Long> {

    List<RelayLog> findByPacketIdOrderByCreatedAtDesc(String packetId);

    long countByAction(String action);
}

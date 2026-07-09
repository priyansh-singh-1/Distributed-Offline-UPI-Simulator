package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "relay_logs")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class RelayLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String packetId;

    private String relayNodeId;

    private String action;

    private String message;

    private LocalDateTime createdAt;
}

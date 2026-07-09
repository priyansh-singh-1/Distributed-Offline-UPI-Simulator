package com.example.demo.service;

import com.example.demo.entity.PaymentPacket;
import org.springframework.stereotype.Service;

import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

@Service
public class HashService {

    public String generateHash(PaymentPacket packet) {

        String amount = packet.getAmount()
                .setScale(2, RoundingMode.HALF_UP)
                .toPlainString();

        String data = packet.getPacketId()
                + "|" + packet.getSenderUpi()
                + "|" + packet.getReceiverUpi()
                + "|" + amount
                + "|" + packet.getTtlSeconds();

        System.out.println("HASH DATA = " + data);

        return sha256(data);
    }

    private String sha256(String data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(data.getBytes(StandardCharsets.UTF_8));

            StringBuilder hexString = new StringBuilder();

            for (byte b : hashBytes) {
                hexString.append(String.format("%02x", b));
            }

            return hexString.toString();

        } catch (Exception e) {
            throw new RuntimeException("Error while generating hash", e);
        }
    }
}
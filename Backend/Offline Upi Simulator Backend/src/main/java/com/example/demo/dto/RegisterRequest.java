package com.example.demo.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String mobile;
    private String upiId;
    private String password;
    private String upiPin;
    private BigDecimal balance;
}

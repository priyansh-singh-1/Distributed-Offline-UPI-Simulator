package com.example.demo.service;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       BCryptPasswordEncoder bCryptPasswordEncoder,
                       JwtService jwtService){
        this.userRepository= userRepository;
        this.bCryptPasswordEncoder=bCryptPasswordEncoder;
        this.jwtService=jwtService;
    }

    public String register(RegisterRequest request){
        if(userRepository.existsByEmail(request.getEmail())){
            return "Email already exists";
        }

        if(userRepository.existsByUpiId(request.getUpiId())){
            return "UPI already exists";
        }

        if(userRepository.existsByMobile(request.getMobile())){
            return "Mobile number already exists";
        }

        BigDecimal openingBalance = request.getBalance();
        if(openingBalance==null){
            openingBalance=BigDecimal.ZERO;
        }

        User user=User.builder()
                .name(request.getName())
                .upiId(request.getUpiId())
                .email(request.getEmail())
                .mobile(request.getMobile())
                .password(bCryptPasswordEncoder.encode(request.getPassword()))
                .upiPin(bCryptPasswordEncoder.encode(request.getUpiPin()))
                .balance(openingBalance)
                .createdAt(LocalDateTime.now())
                .role("USER")
                .build();

        userRepository.save(user);

        return "User registered successfully";
    }

    public User getUserByUpiId(String upiId){
        return userRepository.findByUpiId(upiId)
                .orElseThrow(()-> new RuntimeException("User not found with UPI ID: "+ upiId));

    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!bCryptPasswordEncoder.matches(request.getPassword(), user.getPassword())) {
            return LoginResponse.builder()
                    .message("Invalid password")
                    .build();

        }
        String token= jwtService.generateToken(
                user.getEmail(),
                user.getRole()
        );

        return LoginResponse.builder()
                .message("Login successful")
                .email(user.getEmail())
                .name(user.getName())
                .upiId(user.getUpiId())
                .role(user.getRole())
                .token(token)
                .build();
    }
}

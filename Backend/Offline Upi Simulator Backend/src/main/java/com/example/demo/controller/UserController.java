package com.example.demo.controller;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository){
        this.userRepository=userRepository;
    }

    @GetMapping("/balance/{upiId}")
    public Map<String,Object> getBalance(@PathVariable String upiId){
        User user= userRepository.findByUpiId(upiId)
                .orElseThrow(() -> new RuntimeException("UPI ID not found"));

        return Map.of(
                "upiId", user.getUpiId(),
                "name", user.getName(),
                "balance", user.getBalance()
        );
    }
}

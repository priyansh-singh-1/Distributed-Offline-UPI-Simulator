package com.example.demo.controller;

import com.example.demo.dto.CurrentUserResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.AuthService;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    private final AuthService authService;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;


    public AuthController(AuthService authService,
                          UserRepository userRepository,
                          BCryptPasswordEncoder bCryptPasswordEncoder){
        this.authService=authService;
        this.userRepository=userRepository;
        this.bCryptPasswordEncoder=bCryptPasswordEncoder;
    }

    @GetMapping("/me")
    public CurrentUserResponse getCurrentUser(Authentication authentication){
        String email= authentication.getName();

        User user=userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return CurrentUserResponse.builder()
                .name(user.getName())
                .email(user.getEmail())
                .upiId(user.getUpiId())
                .role(user.getRole())
                .build();
    }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request){
        return authService.register(request);
    }

    @GetMapping("/getuser")
    public User getUser(@RequestParam String upiId){
        return authService.getUserByUpiId(upiId);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request){
        return authService.login(request);
    }
}

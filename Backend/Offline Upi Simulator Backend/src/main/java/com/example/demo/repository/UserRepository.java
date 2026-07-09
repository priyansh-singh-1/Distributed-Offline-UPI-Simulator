package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
     Optional<User> findByEmail(String email);
     Optional<User> findByUpiId(String upiId);
     boolean existsByEmail(String email);
     boolean existsByUpiId(String upiId);
    boolean existsByMobile(String mobile);

}

package com.example.demo.controller;

import com.example.demo.dto.AdminDashboardResponse;
import com.example.demo.service.AdminService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService){
        this.adminService=adminService;
    }

    @GetMapping("/dashboard")
    public AdminDashboardResponse getDashboardStats(){
        return adminService.getDashboardStats();
    }
}

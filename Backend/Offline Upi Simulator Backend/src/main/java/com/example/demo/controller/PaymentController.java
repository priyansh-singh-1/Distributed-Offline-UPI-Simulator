package com.example.demo.controller;

import com.example.demo.dto.PaymentRequest;
import com.example.demo.dto.ReceiptResponse;
import com.example.demo.entity.Transaction;
import com.example.demo.repository.TransactionRepository;
import com.example.demo.service.PaymentService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    private final PaymentService paymentService;
    private final TransactionRepository transactionRepository;

    public PaymentController(PaymentService paymentService, TransactionRepository transactionRepository) {
        this.paymentService = paymentService;
        this.transactionRepository = transactionRepository;
    }

    @PostMapping("/send")
    public String sendMoney(@RequestBody PaymentRequest request){
        return paymentService.sendMoney(request);
    }

    @GetMapping("/history/{upiId}")
    public List<Transaction> getHistory(@PathVariable String upiId){
        return transactionRepository
                .findBySenderUpiOrReceiverUpiOrderByCreatedAtDesc(upiId, upiId);
    }

    @GetMapping("/receipt/{transactionId}")
    public ReceiptResponse getReceipt(@PathVariable String transactionId){
        Transaction transaction= transactionRepository.findByTransactionId(transactionId)
                .orElseThrow(()-> new RuntimeException("Transaction Not Found"));

        return ReceiptResponse.fromEntity(transaction);
    }

}

package com.example.demo.service;

import com.example.demo.dto.PaymentRequest;
import com.example.demo.entity.Transaction;
import com.example.demo.entity.User;
import com.example.demo.repository.TransactionRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PaymentService {
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public PaymentService(UserRepository userRepository,
                          TransactionRepository transactionRepository,
                          BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
        this.bCryptPasswordEncoder=bCryptPasswordEncoder;
    }

    @Transactional
    public String sendMoney(PaymentRequest request){

        String transactionId= request.getTransactionId();

        if(transactionId ==null || transactionId.isBlank()){
            transactionId= UUID.randomUUID().toString();
            request.setTransactionId(transactionId);
        }

        if(transactionRepository.existsByTransactionId(transactionId)){
            return "Duplicate transaction ignored";
        }

        if (request.getSenderUpi().equals(request.getReceiverUpi())) {
            saveFailedTransaction(request, "Sender and receiver cannot be same");
            return "Sender and receiver cannot be same";
        }


        User sender= userRepository.findByUpiId(request.getSenderUpi())
                .orElseThrow(()-> new RuntimeException("Sender UPI not Found"));

        User receiver = userRepository.findByUpiId(request.getReceiverUpi())
                .orElseThrow(()-> new RuntimeException("Receiver UPI not found"));

        if(request.getAmount()==null ||request.getAmount().compareTo(BigDecimal.ZERO)<=0){
            return "Amount must be greater than zero";
        }

        if(!bCryptPasswordEncoder.matches(request.getUpiPin(),sender.getUpiPin())){
            saveFailedTransaction(request,"Invalid UPI PIN");
            return "Invalid UPI PIN";
        }


        if(sender.getBalance().compareTo(request.getAmount())<0){
            saveFailedTransaction(request, "Insufficient balance");
            return "Insufficient balance";
        }

        LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime endOfDay= startOfDay.plusDays(1).minusNanos(1);

        BigDecimal todaySent = transactionRepository.getTodaySentAmount(
                request.getSenderUpi(),
                startOfDay,
                endOfDay
        );

        BigDecimal dailyLimit= new BigDecimal("50000");

        if(todaySent.add(request.getAmount()).compareTo(dailyLimit)>0){
            saveFailedTransaction(request,"Daily transaction limit exceed");
            return "Daily transaction limit exceed";
        }

        sender.setBalance(sender.getBalance().subtract(request.getAmount()));
        receiver.setBalance(receiver.getBalance().add(request.getAmount()));

        userRepository.save(sender);
        userRepository.save(receiver);

        Transaction transaction= Transaction.builder()
                .transactionId(transactionId)
                .senderUpi(request.getSenderUpi())
                .receiverUpi(request.getReceiverUpi())
                .amount(request.getAmount())
                .status("SUCCESS")
                .failureReason(null)
                .createdAt(LocalDateTime.now())
                .build();

        transactionRepository.save(transaction);
        return "Payment Successful";

    }

    private void saveFailedTransaction(PaymentRequest request, String reason){
        Transaction transaction= Transaction.builder()
                .transactionId(request.getTransactionId())
                .senderUpi(request.getSenderUpi())
                .receiverUpi(request.getReceiverUpi())
                .amount(request.getAmount())
                .status("FAILED")
                .failureReason(reason)
                .createdAt(LocalDateTime.now())
                .build();

        transactionRepository.save(transaction);
    }
}

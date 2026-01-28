package com.gwangjin.issuerwas.domain.service;

import com.gwangjin.issuerwas.domain.entity.AuthTx;
import com.gwangjin.issuerwas.domain.entity.Customer;
import com.gwangjin.issuerwas.domain.repository.AuthTxRepository;
import com.gwangjin.issuerwas.domain.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class IssuerAuthService {

    private final AuthTxRepository authTxRepository;
    private final CustomerRepository customerRepository;

    public Map<String, Object> requestAuth(Map<String, String> request) {
        String name = request.get("name");
        String birth = request.get("birth");
        String customerRef = request.get("customerRef");
        // String channel = request.get("channel"); // e.g. SMS
        // String callId = request.get("callId");

        // 1. Validate Customer
        Customer customer = customerRepository.findById(UUID.fromString(customerRef))
                .filter(c -> c.getName().equals(name) && c.getBirth().equals(birth))
                .orElseThrow(() -> new IllegalArgumentException("Customer not found or mismatch"));

        // 2. Generate OTP
        String otp = String.format("%06d", new Random().nextInt(1000000));
        String authTxId = UUID.randomUUID().toString();

        // 3. Log OTP (Critical for testing)
        log.info("[OTP-SENT] CustomerRef: {}, AuthTxId: {}, OTP: {}", customer.getCustomerRef(), authTxId, otp);

        // 4. Save Hash
        AuthTx authTx = AuthTx.builder()
                .authTxId(UUID.fromString(authTxId))
                .customerRef(customer.getCustomerRef())
                .otpHash(hash(otp))
                .expireAt(LocalDateTime.now().plusSeconds(180))
                .build();

        authTxRepository.save(authTx);

        return Map.of(
                "authTxId", authTxId,
                "status", "OTP_SENT",
                "expireSeconds", 180);
    }

    public Map<String, Object> verifyAuth(Map<String, String> request) {
        UUID authTxId = UUID.fromString(request.get("authTxId"));
        String otp = request.get("otp");

        AuthTx authTx = authTxRepository.findById(authTxId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid AuthTxId"));

        // Checks
        if (authTx.isLocked()) {
            return Map.of("result", "LOCKED", "message", "Too many failures");
        }
        if (authTx.getExpireAt().isBefore(LocalDateTime.now())) {
            return Map.of("result", "EXPIRED", "message", "OTP Expired");
        }

        if (!hash(otp).equals(authTx.getOtpHash())) {
            authTx.incrementFailCount();
            return Map.of("result", "FAIL", "message", "Incorrect OTP");
        }

        // Success
        return Map.of(
                "result", "SUCCESS",
                "customerRef", authTx.getCustomerRef(), // Needed for next steps
                "allowedActions", java.util.List.of("CARD_LOSS"));
    }

    private String hash(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(input.getBytes());
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 not available", e);
        }
    }
}

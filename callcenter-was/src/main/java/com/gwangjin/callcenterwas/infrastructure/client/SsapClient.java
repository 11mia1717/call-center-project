package com.gwangjin.callcenterwas.infrastructure.client;

import org.springframework.stereotype.Component;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;

@Component
public class SsapClient {

    // requestId -> otp (for mock verification)
    private final Map<String, String> otpStore = new HashMap<>();

    public Map<String, Object> requestSms(Map<String, String> request) {
        String requestId = UUID.randomUUID().toString();
        String otp = "123456"; // Fixed for demo/mock
        otpStore.put(requestId, otp);
        
        System.out.println("[SSAP-MOCK] SMS Sent to " + request.get("phoneNumber") + " - OTP: " + otp);
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("requestId", requestId);
        response.put("devOtp", otp); // Added for testing
        return response;
    }

    public Map<String, Object> verifySms(Map<String, String> request) {
        String requestId = request.get("requestId");
        String authCode = request.get("authCode");
        
        Map<String, Object> response = new HashMap<>();
        if (otpStore.containsKey(requestId) && otpStore.get(requestId).equals(authCode)) {
            response.put("status", "VERIFIED");
            otpStore.remove(requestId);
        } else {
            response.put("status", "FAILED");
        }
        return response;
    }
}

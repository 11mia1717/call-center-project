package com.gwangjin.callcenterwas.api.controller;

import com.gwangjin.callcenterwas.common.session.SessionManager;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/callcenter/operator")
@RequiredArgsConstructor
public class CallCenterOperatorController {

    private final SessionManager sessionManager;

    @PostMapping("/login")
    public Map<String, Object> login() {
        // Simple login, no password check for this demo as per implicit req (just get token)
        // Or assume hardcoded "operator1"
        String operatorId = "operator1";
        String token = sessionManager.createSession(operatorId);
        
        return Map.of(
            "token", token,
            "operatorId", operatorId
        );
    }

    @PostMapping("/outbound/log")
    public Map<String, Object> logOutboundCall(@RequestBody Map<String, Object> logData) {
        // Compliance: In 2026, every outbound contact must be logged for audit.
        // In a real system, this would go into a secure database.
        String targetName = (String) logData.get("targetName");
        String result = (String) logData.get("result");
        
        System.out.println("[AUDIT-LOG] Outbound call to " + targetName + " | Result: " + result);
        
        return Map.of("status", "SUCCESS", "message", "Call log recorded for compliance.");
    }
}

package com.gwangjin.issuerwas.api.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/compliance")
@RequiredArgsConstructor
public class ComplianceController {

    private final com.gwangjin.issuerwas.domain.service.ComplianceService complianceService;

    @PostMapping("/marketing-consent")
    public Map<String, Object> registerMarketingConsent(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String productName = request.get("productName");
        
        UUID requestId = UUID.randomUUID();
        LocalDate retentionUntil = LocalDate.now().plusMonths(3);
        
        System.out.println("[COMPLIANCE] Marketing Consent Registered: " + username + " for " + productName);
        
        return Map.of(
            "status", "SUCCESS",
            "requestId", requestId.toString(),
            "retentionUntil", retentionUntil.toString()
        );
    }

    @PostMapping("/access-log")
    public Map<String, Object> logAccess(@RequestBody Map<String, Object> logData) {
        String agentId = (String) logData.get("agentId");
        String action = (String) logData.get("action");
        String targetName = (String) logData.get("targetName");
        String result = (String) logData.get("result");
        
        System.out.println("[AUDIT-LOG] Agent: " + agentId + " | Action: " + action + " | Target: " + targetName);
        
        if ("SAVE_RESULT".equals(action) && result != null) {
            complianceService.sendComplianceNotification(targetName, result);
        }
        
        return Map.of("status", "SUCCESS");
    }
}

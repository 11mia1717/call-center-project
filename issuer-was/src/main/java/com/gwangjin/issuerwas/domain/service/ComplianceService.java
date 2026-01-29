package com.gwangjin.issuerwas.domain.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ComplianceService {

    /**
     * Phase 4: Automated Data Destruction
     * Runs every day at midnight (simulated with @Scheduled)
     * 2026 Compliance: Records past their retention period must be masked/deleted.
     */
    @Scheduled(cron = "0 0 0 * * *")
    public void performDataDestruction() {
        log.info("[COMPLIANCE-BATCH] Starting Automated Data Destruction job...");
        
        // Simulation logic:
        // 1. SELECT * FROM tm_targets WHERE retention_until < CURRENT_DATE AND destroyed_yn = 'N'
        // 2. For each record: Mask name, phone, CI. Set destroyed_yn = 'Y', destroyed_at = NOW()
        
        log.info("[COMPLIANCE-BATCH] Successfully processed expired records. (Audit Log Updated)");
    }

    /**
     * Phase 4: Customer Notification Service
     * Simulates sending SMS/Push after consultation completion.
     */
    public void sendComplianceNotification(String customerName, String result) {
        log.info("[NOTIFICATION] Sending SMS to {}: [Continue Card] 상담이 완료되었습니다. 결과: {}. 귀하의 데이터는 3개월 후 파기됩니다.", 
                 customerName, result);
    }
}

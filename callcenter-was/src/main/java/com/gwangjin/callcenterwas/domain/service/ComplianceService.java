package com.gwangjin.callcenterwas.domain.service;

import com.gwangjin.callcenterwas.domain.entity.AuditLog;
import com.gwangjin.callcenterwas.domain.entity.CallResult;
import com.gwangjin.callcenterwas.domain.repository.AuditLogRepository;
import com.gwangjin.callcenterwas.domain.repository.CallResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComplianceService {

    private final CallResultRepository callResultRepository;
    private final AuditLogRepository auditLogRepository;

    /**
     * 상담 결과 저장 (컴플라이언스 준수)
     */
    @Transactional
    public CallResult saveCallResult(String agentId, String targetId, String targetName, 
                                      String purpose, String result, Integer duration, 
                                      Boolean recordingAgreed, String ipAddress) {
        // 1. Audit Log 기록
        logAudit(agentId, "SAVE_RESULT", targetId, "Result: " + result, ipAddress);

        // 2. 이름 마스킹
        String maskedName = maskName(targetName);

        // 3. CallResult 저장
        CallResult callResult = CallResult.builder()
                .agentId(agentId)
                .targetId(targetId)
                .maskedName(maskedName)
                .purpose(purpose)
                .result(result)
                .duration(duration)
                .recordingAgreed(recordingAgreed)
                .build();

        return callResultRepository.save(callResult);
    }

    /**
     * 관리자용 상담 결과 조회 (마스킹된 데이터만)
     */
    public List<Map<String, Object>> getCallResultsForAdmin(String adminId, String ipAddress) {
        logAudit(adminId, "VIEW_RESULTS", null, "Admin viewed call results", ipAddress);

        return callResultRepository.findByDestroyedFalseOrderByCreatedAtDesc().stream()
                .map(cr -> Map.<String, Object>of(
                        "id", cr.getId(),
                        "agentId", cr.getAgentId(),
                        "maskedName", cr.getMaskedName(),
                        "purpose", cr.getPurpose(),
                        "result", cr.getResult(),
                        "duration", cr.getDuration(),
                        "recordingAgreed", cr.getRecordingAgreed(),
                        "createdAt", cr.getCreatedAt().toString(),
                        "retentionUntil", cr.getRetentionUntil().toString()
                ))
                .collect(Collectors.toList());
    }

    /**
     * 감사 로그 조회 (관리자 전용)
     */
    public List<Map<String, Object>> getAuditLogs(String adminId, String ipAddress) {
        logAudit(adminId, "VIEW_AUDIT_LOGS", null, "Admin viewed audit logs", ipAddress);

        return auditLogRepository.findTop100ByOrderByTimestampDesc().stream()
                .map(log -> Map.<String, Object>of(
                        "id", log.getId(),
                        "agentId", log.getAgentId(),
                        "action", log.getAction(),
                        "targetId", log.getTargetId() != null ? log.getTargetId() : "-",
                        "details", log.getDetails() != null ? log.getDetails() : "",
                        "timestamp", log.getTimestamp().toString()
                ))
                .collect(Collectors.toList());
    }

    /**
     * 보관 기한 만료 데이터 파기 (Batch용)
     */
    @Transactional
    public int destroyExpiredRecords() {
        List<CallResult> expired = callResultRepository
                .findByRetentionUntilBeforeAndDestroyedFalse(LocalDateTime.now());
        
        for (CallResult cr : expired) {
            cr.setDestroyed(true);
            cr.setMaskedName("[파기됨]");
            cr.setTargetId("[파기됨]");
        }
        
        callResultRepository.saveAll(expired);
        return expired.size();
    }

    /**
     * Audit Log 기록
     */
    public void logAudit(String agentId, String action, String targetId, String details, String ipAddress) {
        AuditLog log = AuditLog.builder()
                .agentId(agentId)
                .action(action)
                .targetId(targetId)
                .details(details)
                .ipAddress(ipAddress)
                .build();
        auditLogRepository.save(log);
    }

    /**
     * 이름 마스킹 (홍길동 -> 홍*동)
     */
    private String maskName(String name) {
        if (name == null || name.length() < 2) return "***";
        if (name.length() == 2) {
            return name.charAt(0) + "*";
        }
        return name.charAt(0) + "*".repeat(name.length() - 2) + name.charAt(name.length() - 1);
    }
}

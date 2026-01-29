package com.gwangjin.callcenterwas.api.controller;

import com.gwangjin.callcenterwas.common.session.SessionManager;
import com.gwangjin.callcenterwas.domain.service.ComplianceService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/callcenter/operator")
@RequiredArgsConstructor
public class CallCenterOperatorController {

    private final com.gwangjin.callcenterwas.domain.repository.AgentRepository agentRepository;
    private final com.gwangjin.callcenterwas.common.session.SessionManager sessionManager;
    private final ComplianceService complianceService;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> loginData) {
        String agentId = loginData.get("agentId");
        String password = loginData.get("password");

        // DB Verification
        com.gwangjin.callcenterwas.domain.entity.Agent agent = agentRepository.findByAgentIdAndPassword(agentId, password)
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        String token = sessionManager.createSession(agent.getAgentId());
        
        return Map.of(
            "token", token,
            "agentId", agent.getAgentId(),
            "name", agent.getName(),
            "role", agent.getRole()
        );
    }

    @PostMapping("/logout")
    public Map<String, Object> logout(HttpServletRequest request) {
        String token = request.getHeader("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
            sessionManager.removeSession(token);
        }
        return Map.of("status", "SUCCESS", "message", "Logged out successfully");
    }

    /**
     * 상담 결과 저장 (컴플라이언스 준수)
     */
    @PostMapping("/outbound/result")
    public Map<String, Object> saveOutboundResult(@RequestBody Map<String, Object> data,
                                                   HttpServletRequest request) {
        String agentId = (String) data.get("agentId");
        String targetId = (String) data.get("targetId");
        String targetName = (String) data.get("targetName");
        String purpose = (String) data.get("purpose");
        String result = (String) data.get("result");
        Integer duration = (Integer) data.get("duration");
        Boolean recordingAgreed = (Boolean) data.get("recordingAgreed");
        String ipAddress = request.getRemoteAddr();

        complianceService.saveCallResult(agentId, targetId, targetName, purpose, result, duration, recordingAgreed, ipAddress);

        // SMS 시뮬레이션
        System.out.println("[SMS-SIM] " + targetName + "님께 상담완료 알림 발송. 정보는 3개월 후 자동 파기됩니다.");

        return Map.of("status", "SUCCESS", "message", "상담 결과가 저장되었습니다.");
    }

    /**
     * 관리자용: 상담 결과 조회
     */
    @GetMapping("/admin/results")
    public List<Map<String, Object>> getCallResults(@RequestParam String adminId,
                                                     HttpServletRequest request) {
        return complianceService.getCallResultsForAdmin(adminId, request.getRemoteAddr());
    }

    /**
     * 관리자용: 감사 로그 조회
     */
    @GetMapping("/admin/audit-logs")
    public List<Map<String, Object>> getAuditLogs(@RequestParam String adminId,
                                                   HttpServletRequest request) {
        return complianceService.getAuditLogs(adminId, request.getRemoteAddr());
    }

    /**
     * (Legacy) Outbound log endpoint - kept for backward compatibility
     */
    @PostMapping("/outbound/log")
    public Map<String, Object> logOutboundCall(@RequestBody Map<String, Object> logData,
                                                HttpServletRequest request) {
        String agentId = (String) logData.getOrDefault("agentId", "unknown");
        String targetName = (String) logData.get("targetName");
        String result = (String) logData.get("result");
        String purpose = (String) logData.get("purpose");
        Integer duration = logData.get("duration") != null ? ((Number) logData.get("duration")).intValue() : 0;
        Boolean recordingAgreed = (Boolean) logData.getOrDefault("recordingAgreed", false);

        complianceService.saveCallResult(agentId, "legacy-" + System.currentTimeMillis(), 
                targetName, purpose, result, duration, recordingAgreed, request.getRemoteAddr());

        return Map.of("status", "SUCCESS", "message", "Call log recorded for compliance.");
    }
}

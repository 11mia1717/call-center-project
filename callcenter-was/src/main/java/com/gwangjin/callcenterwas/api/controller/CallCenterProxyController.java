package com.gwangjin.callcenterwas.api.controller;

import com.gwangjin.callcenterwas.common.session.SessionManager;
import com.gwangjin.callcenterwas.infrastructure.client.IssuerClient;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/callcenter")
@RequiredArgsConstructor
public class CallCenterProxyController {

    private final IssuerClient issuerClient;
    private final SessionManager sessionManager;

    private SessionManager.OperatorSession getSession(HttpServletRequest request) {
        String token = request.getHeader("X-Operator-Token");
        return sessionManager.getSession(token);
    }

    @PostMapping("/customer/candidates")
    public Map<String, Object> findCandidates(@RequestBody Map<String, String> request,
            HttpServletRequest servletRequest) {
        return issuerClient.findCandidates(request);
    }

    @PostMapping("/auth/request")
    public Map<String, Object> requestAuth(@RequestBody Map<String, String> request,
            HttpServletRequest servletRequest) {
        SessionManager.OperatorSession session = getSession(servletRequest);
        // Add callId if needed, or pass through
        Map<String, String> enhancedRequest = new HashMap<>(request);
        enhancedRequest.put("callId", session.callId);
        return issuerClient.requestAuth(enhancedRequest);
    }

    @PostMapping("/auth/verify")
    public Map<String, Object> verifyAuth(@RequestBody Map<String, String> request) {
        return issuerClient.verifyAuth(request);
    }

    @PostMapping("/card/loss")
    public Map<String, Object> reportLoss(@RequestBody Map<String, Object> request, HttpServletRequest servletRequest) {
        SessionManager.OperatorSession session = getSession(servletRequest);

        // 1. Call Issuer Loss API
        Map<String, Object> result = issuerClient.reportLoss(request);

        // 2. Scale result to Audit Event
        String lossCaseId = (String) result.get("lossCaseId");

        // 3. Send Audit Event
        Map<String, String> auditEvent = new HashMap<>();
        auditEvent.put("callId", session.callId);
        auditEvent.put("operatorId", session.operatorId);
        auditEvent.put("eventType", "CARD_LOSS");
        auditEvent.put("resultCode", "SUCCESS");
        auditEvent.put("lossCaseId", lossCaseId);

        issuerClient.sendAuditEvent(auditEvent);

        return result;
    }

    @GetMapping("/customer/{customerRef}/cards")
    public Map<String, Object> getCards(@PathVariable String customerRef) {
        return issuerClient.getCards(customerRef);
    }

    @PostMapping("/session/end")
    public void endSession(HttpServletRequest request) {
        String token = request.getHeader("X-Operator-Token");
        sessionManager.removeSession(token);
    }
}

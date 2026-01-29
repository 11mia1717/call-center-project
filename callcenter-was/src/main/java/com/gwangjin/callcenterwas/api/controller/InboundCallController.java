package com.gwangjin.callcenterwas.api.controller;

import com.gwangjin.callcenterwas.infrastructure.client.EntrustingClient;
import com.gwangjin.callcenterwas.infrastructure.client.SsapClient;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/calls")
@RequiredArgsConstructor
public class InboundCallController {

    private final EntrustingClient entrustingClient;
    private final SsapClient ssapClient;

    /**
     * Phase 1: 회원 조회
     */
    @PostMapping("/lookup")
    public ResponseEntity<?> lookupMember(@RequestBody Map<String, String> request) {
        String phoneNumber = request.get("phoneNumber");
        return ResponseEntity.ok(entrustingClient.searchCustomer(phoneNumber));
    }

    /**
     * Phase 2: SSAP SMS 인증 요청
     */
    @PostMapping("/auth/request")
    public ResponseEntity<?> requestAuth(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(ssapClient.requestSms(request));
    }

    /**
     * Phase 2: SSAP SMS 인증 확인
     */
    @PostMapping("/auth/verify")
    public ResponseEntity<?> verifyAuth(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(ssapClient.verifySms(request));
    }

    /**
     * Phase 3: 고객 상세 정보 조회
     */
    @GetMapping("/customers/{memberId}")
    public ResponseEntity<?> getCustomerDetail(@PathVariable String memberId) {
        return ResponseEntity.ok(entrustingClient.getCustomerDetails(memberId));
    }
}

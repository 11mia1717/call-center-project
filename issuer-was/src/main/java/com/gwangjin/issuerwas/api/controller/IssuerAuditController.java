package com.gwangjin.issuerwas.api.controller;

import com.gwangjin.issuerwas.domain.entity.AuditEvent;
import com.gwangjin.issuerwas.domain.service.IssuerAuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/issuer/audit")
@RequiredArgsConstructor
public class IssuerAuditController {

    private final IssuerAuditService auditService;

    @PostMapping("/events")
    public void logEvent(@RequestBody Map<String, String> request) {
        auditService.logEvent(request);
    }

    @GetMapping("/events")
    public List<AuditEvent> getEvents() {
        return auditService.findAll();
    }
}

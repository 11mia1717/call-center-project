package com.gwangjin.issuerwas.domain.service;

import com.gwangjin.issuerwas.domain.entity.AuditEvent;
import com.gwangjin.issuerwas.domain.repository.AuditEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class IssuerAuditService {

    private final AuditEventRepository auditEventRepository;

    public void logEvent(Map<String, String> request) {
        AuditEvent event = AuditEvent.builder()
                .eventId(UUID.randomUUID())
                .callId(request.get("callId"))
                .operatorId(request.get("operatorId"))
                .eventType(request.get("eventType"))
                .resultCode(request.get("resultCode"))
                .lossCaseId(request.get("lossCaseId"))
                .build();
        
        auditEventRepository.save(event);
    }

    @Transactional(readOnly = true)
    public List<AuditEvent> findAll() {
        return auditEventRepository.findAll();
    }
}

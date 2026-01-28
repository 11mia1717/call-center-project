package com.gwangjin.issuerwas.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "audit_events")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AuditEvent {

    @Id
    @Column(name = "event_id")
    private UUID eventId;

    @Column(name = "call_id")
    private String callId;

    @Column(name = "operator_id")
    private String operatorId;

    @Column(name = "event_type")
    private String eventType;

    @Column(name = "result_code")
    private String resultCode;

    @Column(name = "loss_case_id")
    private String lossCaseId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Builder
    public AuditEvent(UUID eventId, String callId, String operatorId, String eventType, String resultCode, String lossCaseId) {
        this.eventId = eventId;
        this.callId = callId;
        this.operatorId = operatorId;
        this.eventType = eventType;
        this.resultCode = resultCode;
        this.lossCaseId = lossCaseId;
        this.createdAt = LocalDateTime.now();
    }
}

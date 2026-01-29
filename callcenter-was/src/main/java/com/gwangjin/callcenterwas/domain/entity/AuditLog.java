package com.gwangjin.callcenterwas.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String agentId;           // 접근자 ID
    private String action;            // 액션 (VIEW_TARGET, SAVE_RESULT, VIEW_LOGS 등)
    private String targetId;          // 접근 대상 고객 ID
    private String details;           // 추가 상세 정보
    private String ipAddress;         // 접근 IP
    
    private LocalDateTime timestamp;

    @PrePersist
    public void prePersist() {
        this.timestamp = LocalDateTime.now();
    }
}

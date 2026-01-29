package com.gwangjin.callcenterwas.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "call_results")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CallResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String agentId;           // 상담원 ID
    private String targetId;          // 고객 참조 ID (원본 전화번호 X)
    private String maskedName;        // 비식별화된 이름 (홍*동)
    private String purpose;           // 상담 목적
    private String result;            // 상담완료/부재/거절
    private Integer duration;         // 통화 시간 (초)
    private Boolean recordingAgreed;  // 녹취 동의 여부
    
    private LocalDateTime createdAt;
    private LocalDateTime retentionUntil; // 보관 만료일 (생성일 + 3개월)
    private Boolean destroyed;        // 파기 여부

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.retentionUntil = this.createdAt.plusMonths(3);
        this.destroyed = false;
    }
}

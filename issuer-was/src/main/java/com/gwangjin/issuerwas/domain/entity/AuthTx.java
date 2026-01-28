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
@Table(name = "auth_tx")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class AuthTx {

    @Id
    @Column(name = "auth_tx_id")
    private UUID authTxId;

    @Column(name = "customer_ref")
    private UUID customerRef;

    @Column(name = "otp_hash")
    private String otpHash;

    @Column(name = "expire_at")
    private LocalDateTime expireAt;

    @Column(name = "fail_count")
    private int failCount;

    private boolean locked;

    @Builder
    public AuthTx(UUID authTxId, UUID customerRef, String otpHash, LocalDateTime expireAt) {
        this.authTxId = authTxId;
        this.customerRef = customerRef;
        this.otpHash = otpHash;
        this.expireAt = expireAt;
        this.failCount = 0;
        this.locked = false;
    }

    public void incrementFailCount() {
        this.failCount++;
        if (this.failCount >= 3) {
            this.locked = true;
        }
    }
}

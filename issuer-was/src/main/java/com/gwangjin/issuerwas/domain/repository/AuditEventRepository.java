package com.gwangjin.issuerwas.domain.repository;

import com.gwangjin.issuerwas.domain.entity.AuditEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface AuditEventRepository extends JpaRepository<AuditEvent, UUID> {
    List<AuditEvent> findByCallId(String callId);
}

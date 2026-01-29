package com.gwangjin.callcenterwas.domain.repository;

import com.gwangjin.callcenterwas.domain.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findTop100ByOrderByTimestampDesc();
    List<AuditLog> findByAgentIdOrderByTimestampDesc(String agentId);
}

package com.gwangjin.callcenterwas.domain.repository;

import com.gwangjin.callcenterwas.domain.entity.CallResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface CallResultRepository extends JpaRepository<CallResult, Long> {
    List<CallResult> findByAgentIdOrderByCreatedAtDesc(String agentId);
    List<CallResult> findByDestroyedFalseOrderByCreatedAtDesc();
    List<CallResult> findByRetentionUntilBeforeAndDestroyedFalse(LocalDateTime now);
}

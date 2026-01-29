package com.gwangjin.callcenterwas.domain.repository;

import com.gwangjin.callcenterwas.domain.entity.Agent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AgentRepository extends JpaRepository<Agent, String> {
    Optional<Agent> findByAgentIdAndPassword(String agentId, String password);
}

package com.gwangjin.callcenterwas.config;

import com.gwangjin.callcenterwas.domain.entity.Agent;
import com.gwangjin.callcenterwas.domain.repository.AgentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final AgentRepository agentRepository;

    @Override
    public void run(String... args) throws Exception {
        if (agentRepository.count() == 0) {
            // Seed Agent (사번: 20200101)
            agentRepository.save(Agent.builder()
                    .agentId("20200101")
                    .password("zhf12!@")
                    .name("김상담")
                    .role("AGENT")
                    .build());

            // Seed Admin
            agentRepository.save(Agent.builder()
                    .agentId("admin")
                    .password("admin")
                    .name("관리자")
                    .role("ADMIN")
                    .build());
                    
            System.out.println(">>> [INIT] Seeded agents: 20200101 (Agent), admin (Admin)");
        }
    }
}

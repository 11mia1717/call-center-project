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
    private final com.gwangjin.callcenterwas.domain.repository.AuditLogRepository auditLogRepository;
    private final com.gwangjin.callcenterwas.domain.repository.CallResultRepository callResultRepository;

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
        
        // Seed Dummy Data for Admin Dashboard (if empty)
        if (callResultRepository.count() == 0) {
            seedDummyData();
        }
    }
    
    private void seedDummyData() {
        System.out.println(">>> [INIT] Seeding dummy data for Admin Dashboard (Past 7 days)...");
        
        java.util.Random random = new java.util.Random();
        java.time.LocalDateTime now = java.time.LocalDateTime.now();
        
        String[] agentIds = {"20200101", "20200102", "20200103"};
        String[] purposes = {"카드 분실 신고", "한도 상향 문의", "결제일 변경 서비스", "해외 결제 차단", "신규 발급 문의", "포인트 조회"};
        String[] results = {"상담완료", "상담완료", "상담완료", "부재중", "거절"}; // Weighted towards completion
        String[] names = {"김*수", "이*영", "박*호", "최*지", "정*우", "강*민", "조*아", "윤*서", "장*혁", "임*현"};

        // Generate ~50 records
        for (int i = 0; i < 50; i++) {
            // Random time within last 7 days
            java.time.LocalDateTime callTime = now.minusDays(random.nextInt(7)).minusHours(random.nextInt(24)).minusMinutes(random.nextInt(60));
            
            String agent = agentIds[random.nextInt(agentIds.length)];
            String customerName = names[random.nextInt(names.length)];
            String purpose = purposes[random.nextInt(purposes.length)];
            String result = results[random.nextInt(results.length)];
            int duration = result.equals("상담완료") ? 60 + random.nextInt(600) : 0; // 1min ~ 11min
            
            // Save Call Result
            com.gwangjin.callcenterwas.domain.entity.CallResult callResult = com.gwangjin.callcenterwas.domain.entity.CallResult.builder()
                    .agentId(agent)
                    .targetId("CUST_" + (1000 + i))
                    .maskedName(customerName)
                    .purpose(purpose)
                    .result(result)
                    .duration(duration)
                    .recordingAgreed(true)
                    .createdAt(callTime)
                    .retentionUntil(callTime.plusMonths(3))
                    .destroyed(false)
                    .build();
            
            callResultRepository.save(callResult);
            
            // Create corresponding Audit Log
            com.gwangjin.callcenterwas.domain.entity.AuditLog log = com.gwangjin.callcenterwas.domain.entity.AuditLog.builder()
                    .agentId(agent)
                    .action("SAVE_RESULT")
                    .targetId("CUST_" + (1000 + i))
                    .details("상담 결과 저장 - " + purpose)
                    .ipAddress("192.168.0." + (10 + random.nextInt(50)))
                    .timestamp(callTime)
                    .build();
            
            auditLogRepository.save(log);
        }
        System.out.println(">>> [INIT] Dummy data seeding completed.");
    }
}

package com.gwangjin.callcenterwas.infrastructure.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

/**
 * HTTP Client for Entrusting Company (위탁사) Backend.
 * Used to query customer data for inbound call handling.
 */
@Component
public class EntrustingClient {

    private final RestClient restClient;

    public EntrustingClient(RestClient.Builder builder,
            @Value("${entrusting.base-url}") String baseUrl,
            @Value("${entrusting.service-token}") String serviceToken) {
        this.restClient = builder
                .baseUrl(baseUrl)
                .defaultHeader("X-Service-Token", serviceToken)
                .build();
    }

    /**
     * Search customer by phone number.
     * Returns masked candidate data for compliance.
     */
    public Map<String, Object> searchCustomer(String phone) {
        // Mock Data for "01000000000" (Hong Gil-dong)
        if ("01000000000".equals(phone)) {
            return Map.of(
                "candidateCount", 1,
                "candidates", List.of(
                    Map.of(
                        "name", "홍길동",
                        "phone", "010-0000-0000",
                        "residentId", "900101-1******", // Masked
                        "address", "서울시 강남구 테헤란로",
                        "customerRef", "CUST_001",
                        "marketingAgreed", true
                    )
                )
            );
        }

        // Mock Data for "01012345678" (Jang Min-ah)
        if ("01012345678".equals(phone)) {
            return Map.of(
                "candidateCount", 1,
                "candidates", List.of(
                    Map.of(
                        "name", "장민아",
                        "phone", "010-1234-5678",
                        "residentId", "921117-2******", // Birthday: 921117
                        "address", "경기도 성남시 분당구",
                        "customerRef", "CUST_002",
                        "marketingAgreed", true
                    )
                )
            );
        }

        // Mock Data for "01098765432" (Gwangjin)
        if ("01098765432".equals(phone)) {
            return Map.of(
                "candidateCount", 1,
                "candidates", List.of(
                    Map.of(
                        "name", "광진",
                        "phone", "010-9876-5432",
                        "residentId", "011224-3******", // Birthday: 011224
                        "address", "서울시 송파구 잠실동",
                        "customerRef", "CUST_003",
                        "marketingAgreed", false
                    )
                )
            );
        }

        try {
            return restClient.post()
                    .uri("/api/s2s/customer/search")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("phone", phone))
                    .retrieve()
                    .body(new ParameterizedTypeReference<>() {});
        } catch (Exception e) {
            // Log error and return empty results to prevent system crash
            return Map.of("candidateCount", 0, "candidates", List.of());
        }
    }
}

package com.gwangjin.callcenterwas.infrastructure.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

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
        return restClient.post()
                .uri("/api/s2s/customer/search")
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("phone", phone))
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
    }
}

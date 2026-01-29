package com.gwangjin.callcenterwas.infrastructure.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;

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

    public Map<String, Object> searchCustomer(String phoneNumber) {
        return restClient.post()
                .uri("/api/v1/s2s/members/lookup")
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("phoneNumber", phoneNumber))
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
    }

    public Map<String, Object> getCustomerDetails(String memberId) {
        return restClient.get()
                .uri("/api/v1/s2s/customers/{memberId}", memberId)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
    }
}

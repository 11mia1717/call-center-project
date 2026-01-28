package com.gwangjin.issuerwas.api.controller;

import com.gwangjin.issuerwas.domain.service.IssuerCustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/issuer/customer")
@RequiredArgsConstructor
public class IssuerCustomerController {

    private final IssuerCustomerService customerService;

    @PostMapping("/candidates")
    public Map<String, Object> findCandidates(@RequestBody Map<String, String> request) {
        String phone = request.get("phone");
        return customerService.findCandidates(phone);
    }

    @GetMapping("/{customerRef}/cards")
    public Map<String, Object> getCards(@PathVariable UUID customerRef) {
        return Map.of("cards", customerService.getCustomerCards(customerRef));
    }
}

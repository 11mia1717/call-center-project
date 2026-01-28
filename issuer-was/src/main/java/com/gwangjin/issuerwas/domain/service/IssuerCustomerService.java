package com.gwangjin.issuerwas.domain.service;

import com.gwangjin.issuerwas.common.util.MaskingUtil;
import com.gwangjin.issuerwas.domain.entity.Card;
import com.gwangjin.issuerwas.domain.entity.Customer;
import com.gwangjin.issuerwas.domain.repository.CardRepository;
import com.gwangjin.issuerwas.domain.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IssuerCustomerService {

    private final CustomerRepository customerRepository;
    private final CardRepository cardRepository;

    public Map<String, Object> findCandidates(String phone) {
        // Phone number matching (exact match for simplicity as per requirements)
        // In real world, ANI matching might be fuzzy, but requirement says "ANI만으로는 상세
        // 정보 제공 금지, 마스킹만"
        // Since we stored with hyphens or without? Data.sql has '01012345678' (no
        // hyphens).
        // Let's assume input comes as is.

        Optional<Customer> customerOpt = customerRepository.findByPhone(phone); // Assuming phone is unique for this
                                                                                // simple version

        if (customerOpt.isEmpty()) {
            return Map.of("candidateCount", 0, "candidates", List.of());
        }

        Customer customer = customerOpt.get();
        Map<String, Object> candidate = Map.of(
                "customerRef", customer.getCustomerRef(),
                "maskedName", MaskingUtil.maskName(customer.getName()),
                "maskedPhone", MaskingUtil.maskPhone(customer.getPhone()));

        return Map.of(
                "candidateCount", 1,
                "candidates", List.of(candidate));
    }

    public List<Map<String, Object>> getCustomerCards(UUID customerRef) {
        List<Card> cards = cardRepository.findByCustomerRef(customerRef);
        return cards.stream().map(card -> Map.<String, Object>of(
                "cardRef", card.getCardRef(),
                "maskedCardNo", MaskingUtil.maskCardNo(card.getCardNo()),
                "status", card.getStatus())).collect(Collectors.toList());
    }
}

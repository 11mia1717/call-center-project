package com.gwangjin.issuerwas.domain.service;

import com.gwangjin.issuerwas.common.util.MaskingUtil;
import com.gwangjin.issuerwas.domain.entity.Card;
import com.gwangjin.issuerwas.domain.repository.CardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class IssuerCardService {

    private final CardRepository cardRepository;

    public Map<String, Object> processLoss(Map<String, Object> request) {
        UUID customerRef = UUID.fromString((String) request.get("customerRef"));
        List<String> selectedCardRefs = (List<String>) request.get("selectedCardRefs");

        List<Card> allCards = cardRepository.findByCustomerRef(customerRef);
        List<Card> cardsToStop;

        if (selectedCardRefs != null && !selectedCardRefs.isEmpty()) {
            List<UUID> selectedUuids = selectedCardRefs.stream()
                    .map(UUID::fromString)
                    .collect(Collectors.toList());
            cardsToStop = allCards.stream()
                    .filter(c -> "ACTIVE".equals(c.getStatus()) && selectedUuids.contains(c.getCardRef()))
                    .collect(Collectors.toList());
        } else {
            cardsToStop = allCards.stream()
                    .filter(c -> "ACTIVE".equals(c.getStatus()))
                    .collect(Collectors.toList());
        }

        cardsToStop.forEach(Card::markAsLost);

        // In JPA, dirty checking updates them.

        String lossCaseId = "LC-" + UUID.randomUUID().toString().substring(0, 8);

        return Map.of(
                "lossCaseId", lossCaseId,
                "effectiveTime", LocalDateTime.now(),
                "stoppedCards", cardsToStop.stream().map(c -> Map.<String, Object>of(
                        "cardRef", c.getCardRef(),
                        "maskedCardNo", MaskingUtil.maskCardNo(c.getCardNo()),
                        "status", c.getStatus())).collect(Collectors.toList()));
    }
}

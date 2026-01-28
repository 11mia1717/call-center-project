package com.gwangjin.issuerwas.api.controller;

import com.gwangjin.issuerwas.domain.service.IssuerCardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/issuer/card")
@RequiredArgsConstructor
public class IssuerCardController {

    private final IssuerCardService cardService;

    @PostMapping("/loss")
    public Map<String, Object> reportLoss(@RequestBody Map<String, Object> request) {
        return cardService.processLoss(request);
    }
}

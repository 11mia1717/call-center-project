package com.gwangjin.issuerwas.api.controller;

import com.gwangjin.issuerwas.domain.service.IssuerAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/issuer/auth")
@RequiredArgsConstructor
public class IssuerAuthController {

    private final IssuerAuthService authService;

    @PostMapping("/request")
    public Map<String, Object> requestAuth(@RequestBody Map<String, String> request) {
        return authService.requestAuth(request);
    }

    @PostMapping("/verify")
    public Map<String, Object> verifyAuth(@RequestBody Map<String, String> request) {
        return authService.verifyAuth(request);
    }
}

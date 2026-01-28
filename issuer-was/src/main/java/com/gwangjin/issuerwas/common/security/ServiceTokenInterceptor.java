package com.gwangjin.issuerwas.common.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Slf4j
@Component
public class ServiceTokenInterceptor implements HandlerInterceptor {

    @Value("${issuer.service-token}")
    private String validToken;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        // Skip token check for CORS preflight
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String token = request.getHeader("X-Service-Token");
        if (token == null || !token.equals(validToken)) {
            log.warn("Invalid Service Token: {}", token);
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid Service Token");
            return false;
        }
        return true;
    }
}

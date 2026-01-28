package com.gwangjin.callcenterwas.common.security;

import com.gwangjin.callcenterwas.common.session.SessionManager;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class OperatorTokenInterceptor implements HandlerInterceptor {

    private final SessionManager sessionManager;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) return true;

        String token = request.getHeader("X-Operator-Token");
        if (token == null || sessionManager.getSession(token) == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid Operator Token");
            return false;
        }
        return true;
    }
}

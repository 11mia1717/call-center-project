package com.gwangjin.callcenterwas.common.session;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SessionManager {

    // Token -> SessionData
    private final Map<String, OperatorSession> sessions = new ConcurrentHashMap<>();

    public String createSession(String operatorId) {
        String token = UUID.randomUUID().toString();
        sessions.put(token, new OperatorSession(operatorId, System.currentTimeMillis()));
        return token;
    }

    public OperatorSession getSession(String token) {
        return sessions.get(token);
    }

    public void removeSession(String token) {
        sessions.remove(token);
    }

    public static class OperatorSession {
        public String operatorId;
        public long createdAt;
        // Operational metadata only
        public String callId; 
        
        public OperatorSession(String operatorId, long createdAt) {
            this.operatorId = operatorId;
            this.createdAt = createdAt;
            this.callId = UUID.randomUUID().toString(); // Generate unique call Id per session/login for this demo
        }
    }
}

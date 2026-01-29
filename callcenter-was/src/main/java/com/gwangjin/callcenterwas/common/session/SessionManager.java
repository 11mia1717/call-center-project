package com.gwangjin.callcenterwas.common.session;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SessionManager {

    // Token -> SessionData
    private final Map<String, OperatorSession> sessions = new ConcurrentHashMap<>();
    private static final long MAX_INACTIVE_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds

    public String createSession(String operatorId) {
        String token = UUID.randomUUID().toString();
        sessions.put(token, new OperatorSession(operatorId, System.currentTimeMillis()));
        return token;
    }

    public OperatorSession getSession(String token) {
        OperatorSession session = sessions.get(token);
        if (session != null) {
            long now = System.currentTimeMillis();
            if (now - session.lastAccessedAt > MAX_INACTIVE_INTERVAL) {
                sessions.remove(token);
                return null;
            }
            session.lastAccessedAt = now; // Update last access time
        }
        return session;
    }

    public void removeSession(String token) {
        sessions.remove(token);
    }

    public static class OperatorSession {
        public String operatorId;
        public long createdAt;
        public long lastAccessedAt;
        // Operational metadata only
        public String callId; 
        
        public OperatorSession(String operatorId, long createdAt) {
            this.operatorId = operatorId;
            this.createdAt = createdAt;
            this.lastAccessedAt = createdAt;
            this.callId = UUID.randomUUID().toString(); // Generate unique call Id per session/login for this demo
        }
    }
}

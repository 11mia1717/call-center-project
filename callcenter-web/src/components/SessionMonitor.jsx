import React, { useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../api/client';

const INACTIVE_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds

const SessionMonitor = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const timerRef = useRef(null);
    const lastActivityRef = useRef(Date.now());

    const logout = useCallback(() => {
        // Clear session
        localStorage.clear();
        api.clearToken();
        
        // Redirect to bridge
        const msg = encodeURIComponent('보안을 위해 자동 로그아웃되었습니다.\n다시 로그인해 주세요.');
        navigate(`/bridge?type=warning&title=세션 만료&message=${msg}&next=/`);
    }, [navigate]);

    const resetTimer = useCallback(() => {
        lastActivityRef.current = Date.now();
        if (timerRef.current) clearTimeout(timerRef.current);
        
        timerRef.current = setTimeout(() => {
            const now = Date.now();
            if (now - lastActivityRef.current >= INACTIVE_TIMEOUT) {
                logout();
            }
        }, INACTIVE_TIMEOUT);
    }, [logout]);

    useEffect(() => {
        // Only monitor if we have a token (user is logged in)
        const token = localStorage.getItem('operator_token');
        if (!token) return;

        // Don't monitor on login page or bridge
        if (location.pathname === '/' || location.pathname === '/bridge') return;

        // Events to track
        const events = ['mousedown', 'keydown', 'scroll', 'mousemove', 'touchstart'];
        
        // Throttled event handler
        let throttleTimer = null;
        const handleActivity = () => {
             if (!throttleTimer) {
                throttleTimer = setTimeout(() => {
                    resetTimer();
                    throttleTimer = null;
                }, 1000); // Throttle to once per second
            }
        };

        // Initialize timer
        resetTimer();

        // Add listeners
        events.forEach(event => {
            window.addEventListener(event, handleActivity);
        });

        // Cleanup
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (throttleTimer) clearTimeout(throttleTimer);
            events.forEach(event => {
                window.removeEventListener(event, handleActivity);
            });
        };
    }, [location.pathname, resetTimer]);

    return null; // Hidden component
};

export default SessionMonitor;

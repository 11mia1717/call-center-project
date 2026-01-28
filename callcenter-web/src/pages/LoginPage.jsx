import React, { useState } from 'react';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoading(true);
        try {
            const res = await api.post('/callcenter/operator/login', {});
            api.setToken(res.token);
            navigate('/search');
        } catch (e) {
            alert('로그인에 실패했습니다. 관리자에게 문의하세요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="padding animate-fade" style={{ display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>💳</div>
                <h1 style={{ marginBottom: 8 }}>K Card 콜센터</h1>
                <p style={{ color: 'var(--text-dim)', fontWeight: 500 }}>카드 사고 접수 및 정지 시스템</p>
            </div>

            <button className="btn" onClick={handleLogin} disabled={loading}>
                {loading ? '로그인 중...' : '상담원 로그인'}
            </button>
            <div style={{ marginTop: 24, textAlign: 'center', fontSize: '13px', color: 'var(--text-dim)' }}>
                승인된 관계자만 접근 가능합니다.
            </div>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

export default function AgentLoginPage() {
    const [agentId, setAgentId] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    // [UI/UX] 이미 로그인된 경우 대시보드로 즉시 이동
    useEffect(() => {
        const token = localStorage.getItem('operator_token');
        if (token) {
            navigate('/dashboard', { replace: true });
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/callcenter/operator/login', {
                agentId,
                password
            });
            api.setToken(res.token);
            localStorage.setItem('agentId', res.agentId);
            localStorage.setItem('agentName', res.name);
            localStorage.setItem('agentRole', res.role);
            navigate('/dashboard');
        } catch (error) {
            alert('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-surface)' }}>
            <div className="w-full max-w-sm">
                {/* Logo Section */}
                <div className="text-center mb-10">
                    <Logo />
                    <p className="mt-4 text-sm" style={{ color: 'var(--text-dim)' }}>
                        콜센터 업무 포털
                    </p>
                </div>

                {/* Login Card */}
                <div className="card" style={{ padding: '32px' }}>
                    <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-main)' }}>
                        상담원 로그인
                    </h2>

                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <label className="label">사번(ID)</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="사번 입력"
                                value={agentId}
                                onChange={(e) => setAgentId(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="label">비밀번호</label>
                            <input
                                type="password"
                                className="input"
                                placeholder="비밀번호"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn"
                            disabled={loading}
                            style={{ marginTop: '16px' }}
                        >
                            {loading ? '로그인 중...' : '로그인'}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center mt-6 text-xs" style={{ color: 'var(--text-dim)' }}>
                    Designed by <strong>DAVADA</strong>
                </p>
            </div>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { PhoneIncoming, PhoneOutgoing } from 'lucide-react';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [calling, setCalling] = useState(false);
    const navigate = useNavigate();

    const handleInbound = async () => {
        setCalling(true);
        // Simulate ringing for 2 seconds
        setTimeout(async () => {
            setLoading(true);
            try {
                const res = await api.post('/callcenter/operator/login', {});
                api.setToken(res.token);
                navigate('/search');
            } catch (e) {
                alert('로그인에 실패했습니다. (인바운드)');
                setCalling(false);
            } finally {
                setLoading(false);
            }
        }, 2000);
    };

    const handleOutbound = async () => {
        setLoading(true);
        try {
            const res = await api.post('/callcenter/operator/login', {});
            api.setToken(res.token);
            navigate('/outbound');
        } catch (e) {
            alert('로그인에 실패했습니다. (아웃바운드)');
        } finally {
            setLoading(false);
        }
    };

    if (calling) {
        return (
            <div className="padding animate-fade" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100vh', gap: '48px' }}>
                <div className="ringing-animation">
                    <div className="ringing-dot">
                        <PhoneIncoming size={48} />
                    </div>
                </div>
                <div>
                    <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>전화 연결 중...</h2>
                    <p style={{ color: 'var(--text-dim)' }}>고객님의 인바운드 요청이 있습니다.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="padding animate-fade" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'center', backgroundColor: '#F9FAFB' }}>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
                <Logo showSlogan={true} className="animate-slide-up" style={{ marginBottom: '16px' }} />
                <div className="animate-slide-up" style={{ marginTop: 24, padding: '0 20px' }}>
                    <p style={{ color: '#1A73E8', fontWeight: 800, fontSize: '15px', marginBottom: 8 }}>
                        "금융의 중단 없는 흐름을 기술로 지킵니다."
                    </p>
                    <p style={{ color: 'var(--text-dim)', fontWeight: 500, fontSize: '14px', lineHeight: 1.6 }}>
                        보안 전문가의 DNA로 완성한 <strong style={{ color: '#1A73E8' }}>전문가들의 은행</strong><br/>
                        그렇기에 우리의 보안은 종료가 아닌 지속(Continue)입니다.
                    </p>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: 400, margin: '0 auto', width: '100%' }}>
                <button className="btn" onClick={handleInbound} disabled={loading} style={{ height: 68 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <PhoneIncoming size={20} />
                            <span>{loading ? '연결 중...' : '인바운드 상담 시작'}</span>
                        </div>
                    </div>
                </button>
                
                <button className="btn btn-secondary" onClick={handleOutbound} disabled={loading} style={{ height: 68 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <PhoneOutgoing size={20} />
                        <span>{loading ? '대기 중...' : '아웃바운드 캠페인'}</span>
                    </div>
                </button>
            </div>

            {/* Mission Card */}
            <div className="animate-slide-up" style={{ 
                marginTop: 80, 
                backgroundColor: 'white', 
                borderRadius: 24, 
                padding: 32, 
                border: '1px solid #E5E7EB',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                maxWidth: 440,
                margin: '80px auto 0'
            }}>
                <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#1A1A1A', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 4, height: 16, backgroundColor: '#1A73E8', borderRadius: 2 }}></div>
                    Continue Branding Mission
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-dim)', lineHeight: 1.7, textAlign: 'justify' }}>
                    Continue Bank는 글로벌 보안 컨설팅의 정수를 금융에 이식하기 위해 탄생했습니다. 
                    우리는 보안을 위협으로부터의 방어를 넘어, 
                    <strong style={{ color: '#1A1A1A' }}> 중단 없는 금융 서비스</strong>를 가능케 하는 핵심 엔진으로 정의하며 지속 가능한 신뢰를 구축합니다.
                </p>
                <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF' }}>© 2026 Continue Consulting Team</span>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#1A73E8' }}>SECURITY NEVER ENDS</span>
                </div>
            </div>

            <div style={{ marginTop: 40, textAlign: 'center', fontSize: '12px', color: '#9CA3AF' }}>
                상담원 통합 관리 시스템 1.0.4v
            </div>
        </div>
    );
}

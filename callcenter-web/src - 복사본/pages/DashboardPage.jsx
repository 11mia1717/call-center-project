import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { PhoneIncoming, PhoneOutgoing, Shield, LogOut, LayoutDashboard, ShieldCheck, ChevronRight } from 'lucide-react';

export default function DashboardPage() {
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState('AGENT');
    const navigate = useNavigate();
    const [incomingCall, setIncomingCall] = useState(null);

    useEffect(() => {
        const storedRole = localStorage.getItem('agentRole');
        if (storedRole) {
            setRole(storedRole);
        }
    }, []);

    const handleInbound = async () => {
        setLoading(true);
        setTimeout(() => {
            setIncomingCall({ 
                phone: '010-0000-0000',
                displayPhone: '010-0000-0000'
            });
            setLoading(false);
        }, 800);
    };

    const acceptCall = async () => {
        setLoading(true);
        try {
            const res = await api.post('/callcenter/customer/candidates', { phone: '01000000000' });
            if (res.candidateCount > 0) {
                const customer = res.candidates[0];
                navigate('/auth', { state: { customer } });
            } else {
                navigate('/search');
            }
        } catch (e) {
            console.error('Auto-search failed:', e);
            navigate('/search');
        } finally {
            setLoading(false);
        }
    };

    const handleOutbound = () => {
        navigate('/outbound');
    };

    const handleAdmin = () => {
        navigate('/admin');
    };

    const handleLogout = async () => {
        try {
            await api.post('/callcenter/operator/logout');
        } catch (e) {
            console.error('Logout API failed:', e);
        } finally {
            localStorage.removeItem('operator_token');
            localStorage.removeItem('agentRole');
            localStorage.removeItem('agentId');
            localStorage.removeItem('agentName');
            navigate('/login', { replace: true });
        }
    };

    if (incomingCall) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-sans select-none">
                {/* 인입 알림 전용 고도화된 카드 레이아웃 */}
                <div className="w-full max-w-2xl bg-white rounded-[48px] shadow-custom border border-gray-100 overflow-hidden animate-slide-up flex flex-col">
                    
                    {/* 카드 내부 헤더: 브랜드 및 세션 정보 */}
                    <div className="p-10 pb-6 border-b border-gray-50 flex flex-col items-center text-center">
                        <div className="mb-6">
                            <Logo className="h-7" />
                        </div>
                        <div className="flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100 shadow-sm animate-pulse">
                            <ShieldCheck size={14} />
                            <span className="text-[10px] font-black tracking-[2px] uppercase">Live Incoming Session</span>
                        </div>
                    </div>

                    {/* 카드 메인 컨텐츠: 애니메이션 및 인입 정보 */}
                    <div className="px-10 py-16 flex flex-col items-center bg-gradient-to-b from-white to-gray-50/30">
                        <div className="relative mb-16">
                            <div className="ringing-animation-center">
                                <div className="ringing-dot-center">
                                    <PhoneIncoming size={56} strokeWidth={2.5} className="text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="text-center space-y-4 mb-10">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tighter leading-tight">
                                고객님으로부터<br/>
                                상담 요청이 도착했습니다
                            </h2>
                            <p className="text-gray-400 font-bold text-sm uppercase tracking-widest italic">Inbound Call Connection Wait</p>
                        </div>
                        
                        <div className="w-full max-w-sm py-8 bg-white rounded-3xl border border-gray-100 shadow-xl flex flex-col items-center gap-2">
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-[3px]">Caller Identity</span>
                            <span className="text-4xl font-mono font-black text-blue-700 tracking-tighter">
                                {incomingCall.displayPhone}
                            </span>
                        </div>
                    </div>

                    {/* 카드 하단 액션: 수락 버튼 */}
                    <div className="p-10 pt-6">
                        <button 
                            onClick={acceptCall}
                            disabled={loading}
                            className="w-full h-20 rounded-3xl bg-blue-600 text-white font-black text-2xl transition-all flex items-center justify-center gap-4 hover:bg-blue-700 active:scale-[0.98] shadow-2xl shadow-blue-100 group"
                        >
                            {loading ? (
                                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <PhoneIncoming size={32} strokeWidth={3} className="group-hover:animate-bounce" />
                                    <span>상담 수락하기</span>
                                    <ChevronRight size={24} />
                                </>
                            )}
                        </button>
                        <p className="text-center mt-6 text-xs font-bold text-gray-400 tracking-tight leading-relaxed">
                            수락 버튼을 누르시면 즉시 상담원 화면으로 연결됩니다.<br/>
                            본 통화는 녹취 및 규정에 따라 안전하게 기록됩니다.
                        </p>
                    </div>
                </div>

                <style dangerouslySetInnerHTML={{ __html: `
                    .ringing-animation-center {
                        position: relative;
                        width: 120px;
                        height: 120px;
                    }
                    .ringing-dot-center {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        background: #1A73E8;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 2;
                        box-shadow: 0 10px 40px rgba(26, 115, 232, 0.3);
                    }
                    .ringing-animation-center::before,
                    .ringing-animation-center::after {
                        content: '';
                        position: absolute;
                        top: 0; left: 0; right: 0; bottom: 0;
                        border-radius: 50%;
                        background: #1A73E8;
                        opacity: 0.3;
                        animation: ring-center 2s infinite;
                        z-index: 1;
                    }
                    .ringing-animation-center::after {
                        animation-delay: 1s;
                    }
                    @keyframes ring-center {
                        0% { transform: scale(1); opacity: 0.5; }
                        100% { transform: scale(2.2); opacity: 0; }
                    }
                ` }} />
            </div>
        );
    }

    return (
        <div className="page-container bg-gray-50 min-h-screen flex flex-col font-sans">
            {/* Navigation Bar */}
            <header className="page-header bg-white border-b shadow-sm sticky top-0 z-30 h-16">
                <div className="max-w-6xl mx-auto px-6 h-full flex justify-between items-center">
                    <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/')}>
                        <Logo className="h-6" />
                        <div className="h-4 w-px bg-gray-200"></div>
                        <span className="text-sm font-bold text-gray-800">통합 업무 대시보드</span>
                    </div>
                    
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Session</span>
                                <span className="text-xs font-bold text-gray-700">{role === 'ADMIN' ? '관리자 모드' : '상담사 모드'}</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                <LayoutDashboard size={18} />
                            </div>
                        </div>
                        <div className="h-4 w-px bg-gray-200"></div>
                        <button 
                            onClick={handleLogout}
                            className="text-gray-400 hover:text-red-500 transition-all font-black text-xs"
                            title="로그아웃"
                        >
                            로그아웃
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-6 animate-fade-in">
                <div className="w-full max-w-4xl">
                    <div className="mb-16 text-center">
                        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter leading-tight">
                            당신의 금융은 <span className="text-blue-600">멈추지 않도록,</span><br/>
                            보안은 계속됩니다.
                        </h1>
                        <p className="text-lg font-bold text-gray-400">
                            "금융의 중단 없는 흐름을 기술로 지킵니다."
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {role === 'ADMIN' ? (
                            <button 
                                onClick={handleAdmin}
                                className="col-span-1 md:col-span-2 group p-12 bg-white border border-gray-100 rounded-[48px] shadow-custom hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center gap-6"
                            >
                                <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                                    <Shield size={48} />
                                </div>
                                <div className="text-center">
                                    <span className="text-3xl font-black text-gray-900 tracking-tighter block mb-1">관리자 시스템 접속</span>
                                    <p className="text-sm font-bold text-gray-400">시스템 설정 및 오퍼레이터 관리</p>
                                </div>
                            </button>
                        ) : (
                            <>
                                <button 
                                    onClick={handleInbound}
                                    disabled={loading}
                                    className="group p-12 bg-white border border-gray-100 rounded-[48px] shadow-custom hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center gap-6"
                                >
                                    <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <PhoneIncoming size={36} />
                                    </div>
                                    <div className="text-center">
                                        <span className="text-2xl font-black text-gray-900 tracking-tighter block mb-1">인바운드 업무</span>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Wait for Call</p>
                                    </div>
                                </button>

                                <button 
                                    onClick={handleOutbound}
                                    className="group p-12 bg-white border border-gray-100 rounded-[48px] shadow-custom hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center gap-6"
                                >
                                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-400 group-hover:bg-gray-800 group-hover:text-white transition-all">
                                        <PhoneOutgoing size={36} />
                                    </div>
                                    <div className="text-center">
                                        <span className="text-2xl font-black text-gray-900 tracking-tighter block mb-1">아웃바운드 업무</span>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Campaign List</p>
                                    </div>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Philosophy Section */}
                    <div className="mt-20 flex flex-col items-center">
                        <div className="h-px w-20 bg-gray-200 mb-10"></div>
                        <p className="text-center text-sm font-bold text-gray-400 leading-relaxed max-w-lg">
                            보안 전문가의 DNA로 완성한 <span className="text-blue-600 font-black">전문가들의 은행</span><br/>
                            그렇기에 우리의 보안은 종료가 아닌 <span className="text-blue-600 italic font-black underline decoration-2 underline-offset-4">지속(Continue)</span>입니다.
                        </p>
                    </div>
                </div>
            </main>

            <footer className="h-14 bg-white border-t px-6 flex items-center justify-center text-[10px] font-black text-gray-300 uppercase tracking-[2px]">
                Agent Support Portal v1.0.5 | Copyright © 2026 DAVADA
            </footer>
        </div>
    );
}

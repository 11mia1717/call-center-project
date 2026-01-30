import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { PhoneIncoming, PhoneOutgoing, Shield, LogOut, LayoutDashboard, ShieldCheck, ChevronRight } from 'lucide-react';

export default function DashboardPage() {
    const [loading, setLoading] = useState(false);
    const [role, setRole] = useState(localStorage.getItem('agentRole') || 'AGENT');
    const [incomingCall, setIncomingCall] = useState(false);
    const [stats, setStats] = useState({
        total: 17,
        success: 8,
        successRate: 47.1,
        inbound: 12,
        outbound: 5,
        incomplete: 5
    });

    const [customer, setCustomer] = useState(null);
    const navigate = useNavigate();

    const handleInbound = () => {
        setIncomingCall(true);
        setCustomer({
            name: '홍길동',
            phone: '01012345678'
        });
    };

    const maskName = (name) => {
        if (!name) return 'Unknown';
        if (name.length <= 2) return name[0] + '*';
        return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
    };

    const maskPhone = (phone) => {
        return '010-****-0000';
    };

    const handleOutbound = () => {
        navigate('/outbound');
    };

    const handleAdmin = () => {
        navigate('/admin');
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

    return (
        <div className="page-container bg-gray-50 min-h-screen flex flex-col font-sans relative overflow-hidden">

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
                    {/* Performance Stats Section (Preserved) */}
                    <div className="bg-white rounded-[24px] p-6 shadow-sm border border-[#E5E8EB] mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[17px] font-bold text-[#333D4B] flex items-center gap-2">
                                📊 오늘의 실적
                            </h2>
                            <span className="text-[12px] text-[#8B95A1] font-medium">{new Date().toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex justify-between items-end mb-4 gap-8">
                             <div className="flex-1">
                                <div className="text-[13px] font-bold text-[#8B95A1] mb-1">총 상담 건수</div>
                                <div className="text-[32px] font-black text-[#333D4B] leading-none">{stats.total}</div>
                            </div>
                            <div className="flex-1 text-right">
                                <div className="text-[13px] font-bold text-[#8B95A1] mb-1">성공률</div>
                                <div className="text-[32px] font-black text-[#3182F6] leading-none">{stats.successRate}<span className="text-[18px]">%</span></div>
                            </div>
                        </div>

                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-2">
                            <div className="bg-[#3182F6] h-full rounded-full" style={{ width: `${stats.successRate}%` }}></div>
                        </div>
                        <div className="text-right text-[11px] font-bold text-[#8B95A1]">목표 달성까지 3건 남음</div>
                    </div>

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

            {incomingCall && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-md animate-fade-in">
                    <div className="w-full max-w-[420px] bg-white rounded-[48px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-white overflow-hidden animate-slide-up flex flex-col relative">
                        <div className="h-2 bg-[#1A73E8]"></div>
                        
                        <div className="pt-12 pb-6 flex flex-col items-center">
                            <Logo className="h-6 mb-6" />
                            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#1A73E8] rounded-full border border-blue-100 shadow-sm">
                                <ShieldCheck size={12} />
                                <span className="text-[9px] font-black tracking-widest uppercase">Secured Inbound Channel</span>
                            </div>
                        </div>

                        <div className="px-10 py-10 flex flex-col items-center">
                            <div className="relative mb-12">
                                <div className="ringing-bg">
                                    <div className="ringing-dot flex items-center justify-center">
                                        <PhoneIncoming size={52} strokeWidth={2.5} className="text-white" />
                                    </div>
                                </div>
                            </div>

                            <div className="text-center space-y-3 mb-10">
                                <h2 className="text-[32px] font-black text-gray-900 tracking-tighter leading-tight">
                                    상담 요청 도착
                                </h2>
                                <p className="text-gray-400 font-bold text-[11px] uppercase tracking-[0.2em]">Live Authentication Required</p>
                            </div>
                            
                            <div className="w-full p-8 bg-gray-50 rounded-[40px] border border-gray-100 flex flex-col items-center gap-4 mb-8 shadow-sm">
                                {customer && (
                                    <div className="text-center">
                                        <span className="text-[10px] font-black text-[#1A73E8] bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest block mb-3 w-fit mx-auto border border-blue-100">Continue Bank 회원</span>
                                        <div className="text-3xl font-black text-gray-900 mb-1 tracking-tight">
                                            {maskName(customer.name)} <span className="text-gray-300 text-lg ml-1 font-bold">고객님</span>
                                        </div>
                                        <div className="text-xl font-mono font-black text-[#1A73E8] tracking-widest">
                                            {maskPhone(customer.phone)}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button 
                                onClick={acceptCall}
                                disabled={loading}
                                className="w-full h-20 rounded-[36px] text-white font-black text-2xl transition-all flex items-center justify-center gap-4 hover:brightness-110 active:scale-[0.96] group"
                                style={{ backgroundColor: '#1A73E8', boxShadow: '0 20px 50px rgba(26,115,232,0.3)' }}
                            >
                                <PhoneIncoming size={28} strokeWidth={3} className="group-hover:animate-bounce" />
                                <span>상담 수락</span>
                            </button>
                        </div>
                    </div>

                    <style dangerouslySetInnerHTML={{ __html: `
                        .ringing-bg {
                            position: relative;
                            width: 100px;
                            height: 100px;
                        }
                        .ringing-dot {
                            position: absolute;
                            width: 100%;
                            height: 100%;
                            background: #1A73E8;
                            border-radius: 50%;
                            z-index: 2;
                            box-shadow: 0 15px 45px rgba(26, 115, 232, 0.4);
                        }
                        .ringing-bg::before,
                        .ringing-bg::after {
                            content: '';
                            position: absolute;
                            top: 0; left: 0; right: 0; bottom: 0;
                            border-radius: 50%;
                            background: #1A73E8;
                            opacity: 0.3;
                            animation: ring-ripple 2.5s infinite ease-out;
                            z-index: 1;
                        }
                        .ringing-bg::after {
                            animation-delay: 1.2s;
                        }
                        @keyframes ring-ripple {
                            0% { transform: scale(1); opacity: 0.6; }
                            100% { transform: scale(2.2); opacity: 0; }
                        }
                    ` }} />
                </div>
            )}
        </div>
    );
}

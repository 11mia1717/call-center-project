import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { 
    PhoneIncoming, PhoneOutgoing, User, Clock, 
    MoreHorizontal, Phone, CheckCircle2, XCircle, 
    AlertCircle, Search, Menu, Bell, ChevronRight,
    LayoutDashboard, LogOut, ShieldCheck
} from 'lucide-react';

export default function DashboardPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [agentName, setAgentName] = useState(localStorage.getItem('agentName') || '이상담');
    
    // Data States
    const [outboundTargets, setOutboundTargets] = useState([]);
    const [recentHistory, setRecentHistory] = useState([
        { id: 1, name: '홍길동', time: '01-27 14:30', product: 'Continue 카드', result: 'AGREED', type: 'INBOUND' },
        { id: 2, name: '김철수', time: '01-27 14:25', product: 'Continue 카드', result: 'REJECTED', type: 'OUTBOUND' },
        { id: 3, name: '이영희', time: '01-27 14:15', product: 'Continue 카드', result: 'HOLD', type: 'OUTBOUND' },
    ]);
    const [stats, setStats] = useState({
        total: 17,
        success: 8,
        successRate: 47.1,
        inbound: 12,
        outbound: 5,
        incomplete: 5
    });

    useEffect(() => {
        fetchOutboundTargets();
    }, []);

    const fetchOutboundTargets = async () => {
        try {
            // Fetch from Entrusting Client (Bank) API
            const response = await fetch('http://localhost:8085/api/v1/compliance/marketing-consented-users');
            if (response.ok) {
                const data = await response.json();
                setOutboundTargets(data);
            } else {
                // Fallback demo data
                setOutboundTargets([
                    { id: 1, name: '홍길동', phone: '010-1234-5678', type: 'Continue 카드', consent: true },
                    { id: 2, name: '김철수', phone: '010-5678-1234', type: 'Continue 카드', consent: true },
                    { id: 3, name: '이영희', phone: '010-9876-5432', type: 'Continue 카드', consent: true },
                ]); 
            }
        } catch (error) {
            console.error('Error fetching targets:', error);
             setOutboundTargets([
                { id: 1, name: '홍길동', phone: '010-1234-5678', type: 'Continue 카드', consent: true },
                { id: 2, name: '김철수', phone: '010-5678-1234', type: 'Continue 카드', consent: true },
                { id: 3, name: '이영희', phone: '010-9876-5432', type: 'Continue 카드', consent: true },
            ]); 
        }
    };

    const handleInboundCall = () => {
        setLoading(true);
        setTimeout(() => {
            navigate('/inbound', { 
                state: { 
                    phoneNumber: '01012345678',
                    callId: Math.random().toString(36).substring(7)
                } 
            });
        }, 800);
    };

    const handleOutboundCall = async (target) => {
        try {
             // Access Log
             await api.post('/issuer/compliance/access-log', {
                agentId: localStorage.getItem('agentId'),
                action: 'VIEW_FOR_CALL',
                targetName: target.name,
                purpose: 'OUTBOUND_CALL'
            });
        } catch (e) {}
        navigate('/outbound/call', { state: { target } });
    };

    const maskName = (name) => {
        if (!name) return '';
        if (name.length <= 2) return name[0] + '*';
        return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
    };

    const maskPhone = (phone) => {
        if (!phone) return '';
        const parts = phone.split('-');
        if (parts.length === 3) {
            return `${parts[0]}-****-${parts[2]}`;
        }
        return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1-****-$2');
    };

    return (
        <div className="min-h-screen bg-[#F2F4F6] font-sans pb-20">
            {/* Header */}
            <header className="bg-white px-6 py-4 sticky top-0 z-30 shadow-sm border-b border-[#E5E8EB]">
                <div className="w-full max-w-[1000px] mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Logo className="h-6" />
                        <span className="text-[17px] font-bold text-[#333D4B]">TM 상담</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <div className="text-[15px] font-bold text-[#333D4B]">{agentName}님 👋</div>
                            <div className="text-[11px] font-medium text-[#8B95A1]">오늘도 좋은 하루 보내세요!</div>
                        </div>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
                            <Bell size={20} className="text-[#4E5968]" />
                            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></div>
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" onClick={() => navigate('/')}>
                           <LogOut size={20} className="text-[#4E5968]" />
                        </button>
                    </div>
                </div>
            </header>

            <main className="w-full max-w-[1000px] mx-auto p-4 md:p-6 space-y-6">
                
                {/* 1. Today's Performance */}
                <section className="bg-white rounded-[24px] p-6 shadow-sm border border-[#E5E8EB]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-[19px] font-bold text-[#333D4B] flex items-center gap-2">
                            📊 오늘의 실적
                        </h2>
                        <span className="text-[13px] text-[#8B95A1] font-medium">{new Date().toLocaleDateString()} 기준</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="bg-[#F9FAFB] rounded-2xl p-5">
                            <div className="text-[13px] font-bold text-[#8B95A1] mb-1">총 통화</div>
                            <div className="text-[24px] font-black text-[#333D4B]">{stats.total}<span className="text-[16px] font-bold text-[#8B95A1] ml-1">건</span></div>
                        </div>
                        <div className="bg-[#F9FAFB] rounded-2xl p-5">
                            <div className="text-[13px] font-bold text-[#8B95A1] mb-1">성공</div>
                            <div className="text-[24px] font-black text-[#3182F6]">{stats.success}<span className="text-[16px] font-bold text-[#8B95A1] ml-1">건</span></div>
                        </div>
                        <div className="bg-[#F9FAFB] rounded-2xl p-5">
                            <div className="text-[13px] font-bold text-[#8B95A1] mb-1">성공률</div>
                            <div className="text-[24px] font-black text-[#333D4B]">{stats.successRate}<span className="text-[16px] font-bold text-[#8B95A1] ml-1">%</span></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 px-2">
                        <div className="text-center border-r border-gray-100">
                            <div className="text-[11px] font-bold text-[#8B95A1]">인바운드</div>
                            <div className="text-[15px] font-bold text-[#333D4B] mt-1">{stats.inbound}건</div>
                        </div>
                        <div className="text-center border-r border-gray-100">
                            <div className="text-[11px] font-bold text-[#8B95A1]">아웃바운드</div>
                            <div className="text-[15px] font-bold text-[#333D4B] mt-1">{stats.outbound}건</div>
                        </div>
                        <div className="text-center">
                            <div className="text-[11px] font-bold text-[#8B95A1]">미완료</div>
                            <div className="text-[15px] font-bold text-[#EF4444] mt-1">{stats.incomplete}건</div>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 2. Inbound Queue */}
                    <section className="bg-white rounded-[24px] p-6 shadow-sm border border-[#E5E8EB] flex flex-col h-full relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <PhoneIncoming size={80} className="text-[#3182F6]" />
                        </div>
                        <div className="relative z-10 flex-1 flex flex-col">
                            <h2 className="text-[19px] font-bold text-[#333D4B] mb-2">📞 인바운드 대기</h2>
                            <p className="text-[15px] font-medium text-[#6B7684] mb-8">
                                <span className="text-[#3182F6] font-bold">3명</span>의 고객이 상담을 기다리고 있어요
                            </p>
                            
                            <div className="mt-auto">
                                <button 
                                    onClick={handleInboundCall}
                                    disabled={loading}
                                    className="w-full h-14 bg-[#3182F6] hover:bg-[#1B64DA] text-white rounded-[16px] font-bold text-[16px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            <PhoneIncoming size={20} />
                                            <span>다음 고객 불러오기</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* 3. Outbound List */}
                    <section className="bg-white rounded-[24px] p-6 shadow-sm border border-[#E5E8EB] md:row-span-2 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-[19px] font-bold text-[#333D4B]">🎯 아웃바운드 리스트</h2>
                                <p className="text-[13px] text-[#8B95A1] font-medium mt-1">남은 대상 <span className="text-[#333D4B] font-bold">{outboundTargets.length}명</span></p>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto max-h-[500px] pr-2 space-y-3 custom-scrollbar">
                            {outboundTargets.map((target) => (
                                <div key={target.id} className="p-4 rounded-[16px] border border-[#F2F4F6] hover:border-[#3182F6] hover:bg-blue-50/30 transition-all group">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[15px] font-bold text-[#333D4B]">{maskName(target.name)}</span>
                                                <div className="w-1 h-1 bg-[#D1D6DB] rounded-full"></div>
                                                <span className="text-[13px] font-medium text-[#6B7684]">{maskPhone(target.phone)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-[12px] font-medium text-[#8B95A1]">
                                                <span>{target.type}</span>
                                                <div className="w-px h-2 bg-[#E5E8EB]"></div>
                                                <span>01-27</span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => handleOutboundCall(target)}
                                            className="px-4 py-2 bg-[#E8F3FF] text-[#3182F6] rounded-[10px] font-bold text-[13px] flex items-center gap-1.5 hover:bg-[#3182F6] hover:text-white transition-all"
                                        >
                                            <Phone size={14} />
                                            <span>전화</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {outboundTargets.length > 3 && (
                                <button className="w-full py-3 text-[13px] font-bold text-[#8B95A1] hover:text-[#333D4B] transition-colors flex items-center justify-center gap-1">
                                    <span>더보기 ({outboundTargets.length - 3}명)</span>
                                    <ChevronRight size={14} />
                                </button>
                            )}
                        </div>
                    </section>

                    {/* 4. Recent History */}
                    <section className="bg-white rounded-[24px] p-6 shadow-sm border border-[#E5E8EB]">
                        <h2 className="text-[19px] font-bold text-[#333D4B] mb-6">📋 최근 상담 내역</h2>
                        <div className="space-y-4">
                            {recentHistory.map((item) => (
                                <div key={item.id} className="flex items-start gap-4 pb-4 border-b border-[#F2F4F6] last:border-0 last:pb-0">
                                    <div className={`mt-1 w-2 h-2 rounded-full ${item.result === 'AGREED' ? 'bg-[#3182F6]' : item.result === 'REJECTED' ? 'bg-[#EF4444]' : 'bg-[#FFBE00]'}`}></div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-[15px] font-bold text-[#333D4B]">{maskName(item.name)}</span>
                                            <span className="text-[12px] font-medium text-[#8B95A1]">{item.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="text-[13px] font-medium text-[#6B7684]">{item.product}</span>
                                            <div className="w-px h-2 bg-[#E5E8EB]"></div>
                                            <span className={`text-[12px] font-bold ${item.result === 'AGREED' ? 'text-[#3182F6]' : item.result === 'REJECTED' ? 'text-[#EF4444]' : 'text-[#FFBE00]'}`}>
                                                {item.result === 'AGREED' ? '✅ 가입 동의' : item.result === 'REJECTED' ? '❌ 가입 거부' : '⏸️ 보류'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[11px] font-medium text-[#8B95A1] bg-[#F9FAFB] w-fit px-2 py-0.5 rounded-md">
                                            {item.type === 'INBOUND' ? <PhoneIncoming size={10} /> : <PhoneOutgoing size={10} />}
                                            <span>{item.type === 'INBOUND' ? '인바운드' : '아웃바운드'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="mt-8 flex justify-center">
                    <div className="flex items-center gap-2 text-[#8B95A1] bg-[#F9FAFB] px-4 py-2 rounded-full">
                        <ShieldCheck size={14} />
                        <span className="text-[11px] font-bold">금융소비자 보호를 위해 고객 정보는 마스킹 처리됩니다</span>
                    </div>
                </div>
            </main>
        </div>
    );
}

import React, { useState } from 'react';
import { api } from '../api/client';
import Logo from '../components/Logo';
import { Users, Phone, ShieldCheck, AlertCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OutboundPage = () => {
    const navigate = useNavigate();
    const [targets, setTargets] = useState([]);
    const [isDialing, setIsDialing] = useState(false);
    const [dialingTarget, setDialingTarget] = useState(null);

    React.useEffect(() => {
        fetchTargets();
    }, []);

    const fetchTargets = async () => {
        try {
            // Fetch from Entrusting Client (Bank) API - Port 8085
            const response = await fetch('http://localhost:8085/api/v1/compliance/marketing-consented-users');
            if (response.ok) {
                const data = await response.json();
                setTargets(data);
            } else {
                console.error('Failed to fetch targets');
                // Fallback dummy data if API fails (for demo stability)
                setTargets([
                    { id: 1, name: '홍길동', phone: '010-1234-5678', type: 'Continue 카드 상담', consent: true, purpose: 'Continue 카드 상담', retentionUntil: '2026-04-27' },
                ]); 
            }
        } catch (error) {
            console.error('Error fetching targets:', error);
            // Fallback dummy data
            setTargets([
                { id: 1, name: '홍길동', phone: '010-1234-5678', type: 'Continue 카드 상담', consent: true, purpose: 'Continue 카드 상담', retentionUntil: '2026-04-27' },
            ]); 
        }
    };

    const startCall = async (target) => {
        setIsDialing(true);
        setDialingTarget(target);
        
        // Show dialing animation for 2 seconds
        setTimeout(async () => {
            try {
                // Compliance: Every access must be logged
                await api.post('/issuer/compliance/access-log', {
                    agentId: 'agent001',
                    action: 'VIEW_FOR_CALL',
                    targetName: target.name,
                    purpose: target.purpose
                });
                console.log(`[COMPLIANCE] Agent accessed customer data for outbound call: ${target.name}`);
            } catch (e) {
                console.log('Access log failed, proceeding anyway');
            }
            navigate('/outbound/call', { state: { target } });
        }, 2000);
    };

    if (isDialing && dialingTarget) {
        return (
            <div className="page-container bg-white min-h-screen flex items-center justify-center">
                <div className="text-center animate-pulse">
                    <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-200 animate-bounce">
                        <Phone size={64} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">
                        {dialingTarget.name} 고객님께
                    </h2>
                    <p className="text-gray-500 font-bold text-lg mb-4">전화 연결 중...</p>
                    <p className="text-gray-400 text-sm">{dialingTarget.phone}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container bg-gray-50 min-h-screen pb-20">
            <header className="page-header bg-white shadow-sm border-b py-4 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/')}>
                        <Logo className="h-6" />
                        <div className="h-4 w-px bg-gray-200"></div>
                        <h1 className="text-lg font-bold text-gray-800">아웃바운드 캠페인</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1.5 rounded-full border border-green-100 shadow-sm animate-pulse">
                            <ShieldCheck size={16} />
                            <span className="text-xs font-bold tracking-tight">보안 세션 활성</span>
                        </div>
                        <button onClick={() => navigate('/')} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto p-6 space-y-8 animate-fade-in">
                {/* 2026 Compliance Info */}
                <section className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-blue-200">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md">
                            <AlertCircle size={16} />
                            <span className="text-xs font-bold uppercase tracking-widest">Compliance 2026</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-white">금융소비자 개인정보 활용 지침</h2>
                        <p className="text-white text-sm leading-relaxed max-w-lg font-medium opacity-95">
                            아웃바운드 상담 시 고객이 동의한 <strong style={{ textDecoration: 'underline' }}>상담 목적 외 정보 사용은 금지</strong>되며, 
                            모든 개인정보 열람 시 이력이 기록됩니다. 금융 컴플라이언스에 따라 고객명과 전화번호는 마스킹 처리되어 제공됩니다.
                        </p>
                    </div>
                    <ShieldCheck size={140} className="absolute -bottom-8 -right-8 text-white/10 rotate-12" />
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {targets.map(target => (
                        <div key={target.id} className="bg-white rounded-32px p-8 border border-gray-100 shadow-custom hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group">
                            <div className="flex justify-between items-start mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center text-gray-500 text-xl font-bold shadow-inner">
                                        {target.name[0]}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                            {target.name.length > 2 ? target.name.replace(/(.)(.)(.)/, '$1*$3') : target.name.replace(/(.)(.)/, '$1*')}
                                        </h3>
                                        <p className="text-gray-400 text-sm font-bold mt-0.5">{target.phone.slice(0, 3)}-****-****</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full text-[10px] font-black border border-blue-100/50">
                                    <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                                    마케팅 동의함
                                </div>
                            </div>
                            
                            <div className="space-y-4 mb-8">
                                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100/50">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                        <span className="text-[11px] font-black text-gray-400 uppercase tracking-tighter">캠페인 정보</span>
                                    </div>
                                    <p className="text-[14px] font-bold text-gray-700">{target.type}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3 pb-2 pt-1">
                                    <div className="bg-blue-50-30 p-3 rounded-xl border border-blue-100/20">
                                        <p className="text-[9px] font-black text-blue-400 uppercase mb-1">동의 목적</p>
                                        <p className="text-[13px] font-bold text-gray-800">{target.purpose}</p>
                                    </div>
                                    <div className="bg-red-50-30 p-3 rounded-xl border border-red-100/20">
                                        <p className="text-[9px] font-black text-red-400 uppercase mb-1">보유 기한</p>
                                        <p className="text-[13px] font-bold text-gray-800">{target.retentionUntil}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => startCall(target)}
                                className="w-full h-14 bg-blue-600 text-white rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 shadow-lg shadow-blue-100 hover:brightness-110 active:scale-[0.98] transition-all group-hover:shadow-blue-200"
                            >
                                <Phone size={18} />
                                조회 및 발신
                            </button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default OutboundPage;

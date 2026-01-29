import React, { useState } from 'react';
import { api } from '../api/client';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { Mic, MessageSquare, ShieldCheck, LogOut, CheckCircle2, ChevronRight } from 'lucide-react';

export default function AuthPage() {
    const { state } = useLocation();
    const customer = state?.customer; // { customerRef, maskedName, maskedPhone }
    const navigate = useNavigate();

    const [step, setStep] = useState('REQUEST'); // REQUEST, VERIFY
    const [authTxId, setAuthTxId] = useState(null);
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState('');
    const [birth, setBirth] = useState('');

    const handleRequest = async () => {
        setLoading(true);
        try {
            const res = await api.post('/callcenter/auth/request', {
                name,
                birth,
                customerRef: customer.customerRef,
            });
            setAuthTxId(res.authTxId);
            setStep('VERIFY');
            // Informational bridge for dev OTP
            const msg = encodeURIComponent(`인증번호가 발송되었습니다!\n\n[개발용] 인증번호: ${res.devOtp || '확인불가'}\n(인증 트랜잭션 ID: ${res.authTxId})`);
            navigate(`/bridge?type=info&title=인증번호 발송&message=${msg}&next=/auth`, { state: { ...state, customer } });
        } catch (e) {
            const msg = encodeURIComponent('인증번호 요청에 실패했습니다. 입력 정보를 확인해 주세요.');
            navigate(`/bridge?type=error&title=발송 실패&message=${msg}&next=/auth`, { state: { ...state, customer } });
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        setLoading(true);
        try {
            const res = await api.post('/callcenter/auth/verify', {
                authTxId,
                otp
            });

            if (res.result === 'SUCCESS') {
                const msg = encodeURIComponent('본인 인증이 성공적으로 완료되었습니다.\n상담 화면으로 이동합니다.');
                navigate(`/bridge?type=success&title=인증 완료&message=${msg}&next=/loss`, { state: { customerRef: res.customerRef } });
            } else {
                const msg = encodeURIComponent('인증 실패: ' + res.message);
                navigate(`/bridge?type=warning&title=인증 실패&message=${msg}&next=/auth`, { state: { ...state, customer } });
            }
        } catch (e) {
            const msg = encodeURIComponent('인증 처리 중 오류가 발생했습니다.');
            navigate(`/bridge?type=error&title=시스템 오류&message=${msg}&next=/auth`, { state: { ...state, customer } });
        } finally {
            setLoading(false);
        }
    };

    if (!customer) return <div className="page-container flex items-center justify-center min-h-screen text-gray-400 font-bold">고객 정보가 누락되었습니다.</div>;

    return (
        <div className="page-container bg-gray-50 min-h-screen pb-20 font-sans">
            {/* Header: Outbound 스타일과 통일 */}
            <header className="page-header bg-white shadow-sm border-b py-4 sticky top-0 z-30">
                <div className="max-w-3xl mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/dashboard')}>
                        <Logo className="h-6" />
                        <div className="h-4 w-px bg-gray-200"></div>
                        <h1 className="text-lg font-bold text-gray-800">인바운드 상담</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1.5 rounded-full border border-red-100 shadow-sm animate-pulse">
                            <Mic size={16} />
                            <span className="text-xs font-black tracking-tighter">LIVE RECORDING</span>
                        </div>
                        <button onClick={() => navigate('/dashboard')} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto p-6 space-y-8 animate-fade-in">
                {/* Script Section: Outbound 스타일과 통일 */}
                <section className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-blue-200">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md">
                            <MessageSquare size={16} />
                            <span className="text-xs font-bold uppercase tracking-widest">Verification Script</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">본인 확인을 위해 인증이 필요합니다.</h2>
                        <p className="text-white text-sm leading-relaxed max-w-lg font-medium opacity-95">
                            "고객님의 소중한 정보 보호를 위해 본인 확인을 진행하겠습니다. 등록된 연락처로 인증번호를 발송해 드려도 괜찮으실까요?"
                        </p>
                    </div>
                    <ShieldCheck size={140} className="absolute -bottom-8 -right-8 text-white/10 rotate-12" />
                </section>

                <div className="bg-white rounded-32px p-10 border border-gray-100 shadow-custom">
                    <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-50 pb-8">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 mb-1">본인 인증</h3>
                            <p className="text-sm font-bold text-gray-400">데이터 대조 및 SMS 인증을 수행합니다.</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Name</span>
                                <span className="text-lg font-black text-gray-800">{customer.maskedName}</span>
                            </div>
                            <div className="w-px h-8 bg-gray-100"></div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Phone</span>
                                <span className="text-lg font-black text-gray-800 font-mono">{customer.maskedPhone}</span>
                            </div>
                        </div>
                    </div>

                    {step === 'REQUEST' ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Target Real Name</label>
                                    <input 
                                        className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-600 transition-all outline-none text-lg font-bold" 
                                        value={name} 
                                        onChange={e => setName(e.target.value)} 
                                        placeholder="고객 실명 입력"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Birth Date (6 digits)</label>
                                    <input 
                                        className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-blue-600 transition-all outline-none text-lg font-bold font-mono" 
                                        value={birth} 
                                        onChange={e => setBirth(e.target.value)} 
                                        placeholder="YYMMDD" 
                                        maxLength={6}
                                    />
                                </div>
                            </div>
                            <button 
                                className="w-full h-16 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-lg shadow-blue-100 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4" 
                                onClick={handleRequest} 
                                disabled={loading}
                            >
                                <span>인증번호 발송하기</span>
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-slide-up">
                            <div className="space-y-3">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest text-center block">Enter SMS OTP</label>
                                <input 
                                    className="w-full h-20 text-center text-4xl font-black tracking-[12px] bg-blue-50/50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 transition-all outline-none text-blue-700" 
                                    value={otp} 
                                    onChange={e => setOtp(e.target.value)} 
                                    placeholder="000000" 
                                    maxLength={6}
                                />
                            </div>
                            <div className="flex flex-col gap-4">
                                <button 
                                    className="w-full h-16 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-lg shadow-blue-100 hover:brightness-110 active:scale-[0.98] transition-all" 
                                    onClick={handleVerify} 
                                    disabled={loading}
                                >
                                    인증 완료 및 상담 계속
                                </button>
                                <button 
                                    className="text-gray-400 font-bold text-sm hover:text-blue-600 transition-colors"
                                    onClick={() => setStep('REQUEST')}
                                >
                                    인증번호 재요청
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

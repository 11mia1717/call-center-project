import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import Logo from '../components/Logo';
import { 
    PhoneOff, MicOff, Pause, MessageSquare, 
    ShieldCheck, AlertCircle, CheckCircle2, Clock,
    Mic, User, FileText
} from 'lucide-react';

const OutboundCallPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const target = location.state?.target;

    const [callStatus, setCallStatus] = useState('DIALING'); // DIALING, CONNECTED, ENDED
    const [duration, setDuration] = useState(0);
    const [result, setResult] = useState('');
    const [recordingAgreed, setRecordingAgreed] = useState(false);
    const [showScript, setShowScript] = useState(true);

    useEffect(() => {
        let timer;
        if (callStatus === 'CONNECTED') {
            timer = setInterval(() => setDuration(prev => prev + 1), 1000);
        }
        return () => clearInterval(timer);
    }, [callStatus]);

    useEffect(() => {
        const dialingTimer = setTimeout(() => {
            setCallStatus('CONNECTED');
        }, 2000);
        return () => clearTimeout(dialingTimer);
    }, []);

    const formatTime = (s) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleEndCall = () => {
        setCallStatus('ENDED');
    };

    const submitResult = async () => {
        if (!result) {
            alert('상담 결과를 선택해 주세요.');
            return;
        }
        if (!recordingAgreed && result === '상담 완료') {
            alert('녹취 동의 여부를 확인해 주세요.');
            return;
        }
        try {
            await api.post('/callcenter/outbound/log', {
                targetName: target.name,
                result: result,
                duration: duration,
                recordingAgreed: recordingAgreed,
                purpose: target.purpose
            });
            
            // Compliance: Customer Notice Simulation
            console.log(`[COMPLIANCE] SMS Sent to ${target.name}: 상담이 완료되었습니다. 정보는 3개월 후 자동 파기됩니다.`);
            
            navigate('/outbound');
        } catch (e) {
            alert('결과 저장 중 오류가 발생했습니다.');
        }
    };

    if (!target) return null;

    return (
        <div className="page-container bg-[#F8F9FA] min-h-screen pb-10">
            <header className="page-header bg-white shadow-sm border-b py-4 sticky top-0 z-20">
                <div className="max-w-3xl mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/')}>
                        <Logo className="h-6" />
                        <div className="h-4 w-px bg-gray-200"></div>
                        <h1 className="text-lg font-bold text-gray-800">아웃바운드 캠페인</h1>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
                        callStatus === 'ENDED' 
                            ? 'bg-gray-100 text-gray-500 border-gray-200' 
                            : callStatus === 'CONNECTED' 
                                ? 'bg-red-50 text-red-600 border-red-100 animate-pulse outline outline-4 outline-red-500/10' 
                                : 'bg-gray-50 text-gray-400 border-gray-200'
                    }`}>
                        <Mic size={16} />
                        <span className="text-sm font-black tracking-tighter">
                            {callStatus === 'ENDED' ? '통화 종료됨' : callStatus === 'CONNECTED' ? 'LIVE CALL RECORDING' : 'RECORDING OFF'}
                        </span>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
                
                {/* Left Side: Call Control & Status */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-32px p-8 shadow-xl border border-gray-100 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-50"></div>
                        
                        <div className="relative z-10">
                            <div className="mb-8 flex justify-center">
                                <div className={`w-32 h-32 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-700 ${
                                    callStatus === 'ENDED' 
                                        ? 'bg-gray-500 scale-100' 
                                        : callStatus === 'CONNECTED' 
                                            ? 'bg-blue-600 scale-110 shadow-blue-200 animate-bounce' 
                                            : 'bg-gray-400 rotate-12 animate-bounce'
                                }`}>
                                    <User size={64} strokeWidth={2} />
                                </div>
                            </div>

                            <h2 className="text-2xl font-black text-gray-900 mb-1">
                                {target.name} 고객님
                            </h2>
                            <p className="text-gray-400 font-bold mb-6">{target.phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-****')}</p>

                            <div className="inline-flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-2xl mb-8">
                                <Clock size={16} className="text-blue-500" />
                                <span className="text-2xl font-black text-gray-800 font-mono tracking-tighter">{formatTime(duration)}</span>
                            </div>

                        <div className="grid grid-cols-3 gap-4 mt-8">
                            <CircleAction icon={<MicOff size={22} />} label="음소거" bgColor="bg-blue-600" />
                            <CircleAction icon={<Pause size={22} />} label="대기" bgColor="bg-blue-600" />
                            <CircleAction icon={<MessageSquare size={22} />} label="메모" bgColor="bg-blue-600" />
                        </div>

                        {callStatus !== 'ENDED' && (
                            <button
                                onClick={handleEndCall}
                                className="w-full mt-10 h-16 bg-gradient-to-r from-red-500 to-red-600 text-gray-900 rounded-[24px] font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-red-200 hover:from-red-600 hover:to-red-700 active:scale-[0.98] transition-all"
                            >
                                <PhoneOff size={24} className="text-gray-900" />
                                통화 종료
                            </button>
                        )}
                        </div>
                    </div>

                    {/* Purpose Info */}
                    <div className="bg-blue-600 rounded-32px p-6 text-white shadow-xl">
                        <div className="flex items-center gap-2 mb-4 opacity-90">
                            <FileText size={16} />
                            <span className="text-xs font-bold uppercase tracking-widest">Call Purpose</span>
                        </div>
                        <p className="text-lg font-bold mb-1">{target.purpose}</p>
                        <p className="text-blue-100 text-xs font-medium leading-relaxed">
                            본 상담용 데이터는 {target.retentionUntil} 이후 보안 정책에 따라 자동 파기 예정입니다.
                        </p>
                    </div>
                </div>

                {/* Right Side: Script & Result */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Compliance Script */}
                    <div className="bg-white rounded-32px p-8 shadow-xl border border-gray-100 relative">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                    <ShieldCheck size={24} />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 leading-tight">필수 상담 스크립트</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-black px-3 py-1.5 rounded-full ${recordingAgreed ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                    {recordingAgreed ? '녹취 동의 완료' : '동의 대기 중'}
                                </span>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-6 mb-6 font-medium text-gray-700 leading-relaxed border-l-4 border-blue-500">
                            <p className="mb-4">"안녕하세요 {target.name} 고객님, Continue Card 입니다."</p>
                            <p className="mb-4 text-[#1A73E8] font-bold">
                                ⭐ (필수 고지) "본 통화는 서비스 품질 향상 및 금융 소비자 보호를 위해 상담 전 과정이 녹음됩니다. 이에 동의하십니까?"
                            </p>
                            <p className="italic text-gray-400 text-sm">→ 고객이 "예"라고 답변한 경우에만 아래 진행</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setRecordingAgreed(true)}
                                className={`flex-1 h-14 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                                    recordingAgreed 
                                        ? 'bg-blue-600 text-white shadow-2xl shadow-blue-200' 
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-gray-200'
                                }`}
                            >
                                <CheckCircle2 size={18} />
                                고객 녹취 동의 확인
                            </button>
                            <button
                                className="h-14 px-8 bg-red-50 text-red-500 rounded-2xl font-bold hover:bg-red-100 transition-colors"
                                onClick={() => {
                                    alert('녹취 거부 시 상담 진행이 불가합니다. 통화를 종료합니다.');
                                    handleEndCall();
                                }}
                            >
                                동의 거부
                            </button>
                        </div>
                    </div>

                    {/* Result Form */}
                    {callStatus === 'ENDED' && (
                        <div className="bg-white rounded-32px p-8 shadow-2xl border-2 border-blue-500 animate-slide-up">
                            <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                                <CheckCircle2 className="text-blue-500" />
                                상담 결과 입력
                            </h3>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                                {['상담 완료', '부재 중', '상담 거절', '재통화 예약'].map(r => (
                                    <button
                                        key={r}
                                        onClick={() => setResult(r)}
                                        className={`h-12 rounded-xl text-sm font-bold transition-all ${result === r ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-100'}`}
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={submitResult}
                                className="w-full h-16 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 active:scale-[0.98]"
                            >
                                결과 저장 및 캠페인 목록으로
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

const CircleAction = ({ icon, label, bgColor = "bg-gray-600" }) => (
    <div className="flex flex-col items-center gap-3">
        <button className={`w-16 h-16 ${bgColor} text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl`}>
            {icon}
        </button>
        <span className="text-xs font-bold text-gray-700">{label}</span>
    </div>
);

export default OutboundCallPage;

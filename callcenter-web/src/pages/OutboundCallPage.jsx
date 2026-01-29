import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import Logo from '../components/Logo';
import { 
    PhoneOff, MicOff, Pause, MessageSquare, 
    ShieldCheck, AlertCircle, CheckCircle2, Clock,
    Mic, User, FileText, Smartphone, ShieldAlert
} from 'lucide-react';

const OutboundCallPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const target = location.state?.target;

    const [callStatus, setCallStatus] = useState('DIALING'); // DIALING, CONNECTED, ENDED
    const [duration, setDuration] = useState(0);
    const [result, setResult] = useState('');
    const [recordingAgreed, setRecordingAgreed] = useState(false);

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
                        <h1 className="text-lg font-bold text-gray-800">아웃바운드 서비스</h1>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
                        callStatus === 'ENDED' 
                            ? 'bg-gray-100 text-gray-500 border-gray-200' 
                            : 'bg-red-50 text-red-600 border-red-100 animate-pulse'
                    }`}>
                        <Mic size={14} />
                        <span className="text-[10px] font-black tracking-widest uppercase">
                            {callStatus === 'ENDED' ? 'Session Offline' : 'Live Voice Recording'}
                        </span>
                    </div>
                </div>
            </header>

            <main className="max-w-3xl mx-auto p-6 space-y-8 animate-fade-in">
                
                {/* 1. Call Control Card */}
                <div className="bg-white rounded-[48px] p-10 shadow-custom border border-gray-100 flex flex-col items-center relative overflow-hidden text-center">
                    <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
                    
                    <div className="mb-10 relative">
                        <div className={`w-32 h-32 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-700 ${
                            callStatus === 'ENDED' ? 'bg-gray-400 scale-90' : 'bg-blue-600 scale-100 shadow-blue-200'
                        }`}>
                            <User size={64} strokeWidth={2.5} />
                        </div>
                        {callStatus === 'CONNECTED' && (
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 border-4 border-white rounded-full flex items-center justify-center animate-bounce">
                                <Smartphone size={20} className="text-white" />
                            </div>
                        )}
                    </div>

                    <div className="space-y-1 mb-8">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tighter decoration-blue-600/30 underline decoration-8 underline-offset-[-2px]">
                            {target.name} 고객님
                        </h2>
                        <p className="text-lg font-mono font-bold text-gray-400">{target.phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-****')}</p>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 px-8 py-4 rounded-2xl mb-10 border border-gray-100">
                        <Clock size={18} className="text-blue-600" />
                        <span className="text-3xl font-black text-gray-800 font-mono tracking-tighter">{formatTime(duration)}</span>
                    </div>

                    <div className="flex gap-4 mb-10">
                        <CircleAction icon={<MicOff size={24} />} bgColor="bg-gray-100 text-gray-400 hover:bg-gray-200" title="음소거" />
                        <CircleAction icon={<Pause size={24} />} bgColor="bg-gray-100 text-gray-400 hover:bg-gray-200" title="대기" />
                        <CircleAction icon={<MessageSquare size={24} />} bgColor="bg-blue-600 text-white shadow-lg shadow-blue-100 hover:brightness-110" title="메모" />
                    </div>

                    {callStatus !== 'ENDED' && (
                        <button
                            onClick={handleEndCall}
                            className="w-full h-20 bg-red-600 text-white rounded-[24px] font-black text-xl flex items-center justify-center gap-3 shadow-2xl shadow-red-100 hover:bg-red-700 active:scale-[0.98] transition-all"
                        >
                            <PhoneOff size={28} />
                            <span>통화 종료</span>
                        </button>
                    )}
                </div>

                {/* 2. Target Context (Purpose) */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 text-gray-400">
                        <FileText size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Target Context</span>
                    </div>
                    <h4 className="text-xl font-black text-gray-900 mb-2">{target.purpose}</h4>
                    <p className="text-xs font-bold text-gray-400 leading-relaxed italic">
                        금융소비자 정보는 상담 종료 3개월 후 자동 파기 예정입니다.
                    </p>
                </div>

                {/* 3. Compliance Script (Moved below Target Context) */}
                <div className="bg-white rounded-[40px] p-10 shadow-custom border border-gray-100">
                    <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-50">
                        <div className="flex items-center gap-3">
                            <ShieldCheck size={28} className="text-blue-600" />
                            <h3 className="text-2xl font-black text-gray-900 tracking-tighter">필수 안전 스크립트</h3>
                        </div>
                        <div className={`px-4 py-2 rounded-xl text-xs font-black border tracking-widest ${
                            recordingAgreed ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                            {recordingAgreed ? 'COMPLIANCE OK' : 'PENDING CONSENT'}
                        </div>
                    </div>

                    <div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden mb-10 shadow-xl shadow-blue-100">
                        <div className="relative z-10 space-y-6">
                            <p className="text-2xl font-bold leading-tight italic opacity-90">"안녕하세요 {target.name} 고객님, Continue Bank 입니다."</p>
                            <div className="space-y-2">
                                <p className="text-xl font-black leading-relaxed">
                                    ⭐ (필수 고지) "본 상담은 서비스 품질 향상 및 관련 법령에 따라 모든 통화 내용이 녹음됩니다. 이에 동의하십니까?"
                                </p>
                                <p className="text-sm font-bold text-blue-200">※ 고객님께서 명확하게 "예" 또는 "네"라고 대답하실 때까지 기다려 주세요.</p>
                            </div>
                        </div>
                        <Mic size={140} className="absolute -bottom-8 -right-8 text-white/10 rotate-12" />
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setRecordingAgreed(true)}
                            className={`flex-1 h-16 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 ${
                                recordingAgreed 
                                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' 
                                    : 'bg-white text-gray-800 border-2 border-gray-100 hover:border-blue-600'
                            }`}
                        >
                            <CheckCircle2 size={24} />
                            <span>고객 녹취 동의 확인</span>
                        </button>
                        {!recordingAgreed && (
                            <button
                                onClick={() => { alert('규정에 따라 상담이 불가합니다.'); handleEndCall(); }}
                                className="h-16 px-10 bg-red-50 text-red-500 rounded-2xl font-black hover:bg-red-100 transition-all border border-red-100"
                            >
                                동의 거부
                            </button>
                        )}
                    </div>
                </div>

                {/* 4. Result Form */}
                {callStatus === 'ENDED' && (
                    <div className="bg-white rounded-[40px] p-10 shadow-2xl border-4 border-blue-600 animate-slide-up">
                        <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                            <CheckCircle2 className="text-blue-600" size={32} />
                            <span>상담 결과 최종 확정</span>
                        </h3>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                            {['상담 완료', '부재 중', '상담 거절', '재통화 예약'].map(r => (
                                <button
                                    key={r}
                                    onClick={() => setResult(r)}
                                    className={`h-16 rounded-2xl text-sm font-black transition-all ${
                                        result === r 
                                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 scale-105' 
                                        : 'bg-gray-50 text-gray-400 border border-gray-100 hover:bg-gray-100'
                                    }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={submitResult}
                            className="w-full h-20 bg-blue-600 text-white rounded-[32px] font-black text-xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 active:scale-[0.98]"
                        >
                            결과 저장 및 리스트 복귀
                        </button>
                    </div>
                )}

                {/* 5. Legal Notice */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex gap-6">
                    <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                        <ShieldAlert size={28} />
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-sm font-black uppercase tracking-widest text-gray-900">Legal Compliance Notice</h4>
                        <p className="text-xs font-bold text-gray-400 leading-relaxed">
                            본 통화 내용은 **금융소비자 보호에 관한 법률** 및 **전자금융거래법**에 의거하여 상담원 및 고객의 안전과 정당한 업무 집행을 위해 기록됩니다. 
                            거짓된 정보 제공이나 고압적인 언행은 법적 제재의 대상이 될 수 있음을 고객님께 인지 시켜 주시기 바랍니다.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

const CircleAction = ({ icon, bgColor = "bg-gray-100", title }) => (
    <button 
        title={title}
        className={`w-20 h-20 ${bgColor} rounded-full flex items-center justify-center hover:scale-110 active:scale-90 transition-all shadow-md`}
    >
        {icon}
    </button>
);

export default OutboundCallPage;

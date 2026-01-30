import React, { useState, useEffect, useRef } from 'react';
import { 
    PhoneIncoming, User, Calendar, Smartphone, CreditCard, 
    AlertCircle, FileText, CheckCircle2, XCircle, 
    ShieldCheck, History, ArrowRight, Loader2, 
    Lock, Mic, FileWarning, Save, Tag, Search
} from 'lucide-react';
import { api } from '../api/client';

import { useLocation } from 'react-router-dom';
// ... inside component ...
const InboundCallPage = () => {
    const location = useLocation();
    // ... states ...

    useEffect(() => {
        if (location.state?.phoneNumber) {
            setPhoneNumber(location.state.phoneNumber);
            // Auto-start check for demo
            setLoading(true);
            setTimeout(() => {
                setMemberInfo({ name: '홍*동', realName: '홍길동', isMember: true, grade: 'PLATINUM' });
                setPhase(1);
                setLoading(false);
            }, 800);
        }
    }, [location.state]);
    
    // ... rest of code
    
    // Phase 0: Call Reception
    const [phoneNumber, setPhoneNumber] = useState('');
    const [memberInfo, setMemberInfo] = useState(null); // { name, isMember, ... }

    // Phase 1: Compliance
    const [scriptsRead, setScriptsRead] = useState({ recording: false, purpose: false, privacy: false });

    // Phase 2: ID Verification (Input)
    const [idInput, setIdInput] = useState({ name: '', birthDate: '' });
    const [idVerified, setIdVerified] = useState(false);

    // Phase 3: SMS Auth
    const [smsSent, setSmsSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [smsVerified, setSmsVerified] = useState(false);

    // Phase 4: Customer Detail
    const [customerData, setCustomerData] = useState(null); // Cards, etc.
    const [masking, setMasking] = useState({ name: true, phone: true, card: true });

    // Phase 5: Consultation / Lost Report
    const [selectedAction, setSelectedAction] = useState(null); // 'LOST_REPORT', 'BILLING', etc.
    const [lostCardSelection, setLostCardSelection] = useState(null);

    // Phase 6: Conclusion
    const [consultationResult, setConsultationResult] = useState({
        category: '',
        tags: [],
        summary: '',
        resultStatus: 'COMPLETED'
    });

    // Mock Data Helpers
    const handleCheckMember = () => {
        setLoading(true);
        setTimeout(() => {
            // Mock Member Check
            if (phoneNumber === '01012345678') {
                setMemberInfo({ name: '홍*동', realName: '홍길동', isMember: true, grade: 'PLATINUM' });
                setPhase(1);
            } else {
                setMemberInfo({ isMember: false });
                alert('회원 정보가 없습니다. 비회원 상담 프로세스로 전환합니다.');
                // Handle non-member flow (omit for now or simple end)
            }
            setLoading(false);
        }, 800);
    };

    const handleScriptComplete = () => {
        if (!scriptsRead.recording || !scriptsRead.purpose || !scriptsRead.privacy) {
            alert('모든 필수 고지 항목을 안내해야 합니다.');
            return;
        }
        setPhase(2);
    };

    const handleIdVerify = () => {
        if (idInput.name === '홍길동' && idInput.birthDate === '900101') {
            setIdVerified(true);
            setPhase(3);
        } else {
            alert('본인 확인 정보가 일치하지 않습니다. (Demo: 홍길동 / 900101)');
        }
    };

    const handleSendSms = () => {
        setSmsSent(true);
        alert('인증번호가 발송되었습니다. (Demo OTP: 123456)');
    };

    const handleSmsVerify = () => {
        if (otp === '123456') {
            setSmsVerified(true);
            fetchCustomerData();
        } else {
            alert('인증번호가 일치하지 않습니다.');
        }
    };

    const fetchCustomerData = () => {
        setLoading(true);
        setTimeout(() => {
            setCustomerData({
                cards: [
                    { name: 'Continue Platinum', number: '1234-5678-****-****', status: 'NORMAL', type: 'CREDIT' },
                    { name: 'Travel Master', number: '9876-5432-****-****', status: 'NORMAL', type: 'CHECK' }
                ],
                accounts: [
                    { name: 'Continue 입출금', number: '110-***-******', balance: 5400000 }
                ]
            });
            setPhase(4);
            setLoading(false);
        }, 1000);
    };

    const handleLostReport = () => {
        if (!lostCardSelection) {
            alert('분실 신고할 카드를 선택해 주세요.');
            return;
        }
        if (window.confirm(`[${lostCardSelection.name}] 카드를 분실 처리 하시겠습니까?\n처리 후 즉시 거래가 정지됩니다.`)) {
            // Call API to suspend card
            alert('분실 신고 접수 및 카드 거래 정지가 완료되었습니다.');
            setConsultationResult(prev => ({ 
                ...prev, 
                category: 'LOST_REPORT', 
                summary: `${lostCardSelection.name} 분실 신고 및 정지 처리`
            }));
            setPhase(6); // Go to save
        }
    };

    const handleSaveConsultation = async () => {
        try {
            setLoading(true);
            await api.post('/callcenter/operator/calls/result', {
                targetId: phoneNumber,
                maskedName: memberInfo?.name || 'Unknown',
                category: consultationResult.category,
                tags: consultationResult.tags,
                summary: consultationResult.summary,
                result: consultationResult.resultStatus,
                recordingAgreed: true, // Confirmed in phase 1
                timestamp: new Date().toISOString()
            });
            alert('상담 이력이 저장되었습니다.');
            // Reset
            setPhase(0);
            setPhoneNumber('');
            setMemberInfo(null);
            setScriptsRead({ recording: false, purpose: false, privacy: false });
            setIdInput({ name: '', birthDate: '' });
            setIdVerified(false);
            setSmsSent(false);
            setOtp('');
            setSmsVerified(false);
            setCustomerData(null);
            setSelectedAction(null);
            setLostCardSelection(null);
            setConsultationResult({ category: '', tags: [], summary: '', resultStatus: 'COMPLETED' });
        } catch (e) {
            console.error(e);
            alert('저장 실패');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F7FA] font-sans p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                
                {/* Header / Active Call Status */}
                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${phase > 0 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                            <PhoneIncoming size={24} className={phase > 0 ? "animate-pulse" : ""} />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Current Call</div>
                            <div className="text-xl font-black text-gray-800">
                                {phase === 0 ? '대기 중...' : (memberInfo?.name || phoneNumber)}
                            </div>
                        </div>
                    </div>
                    {phase > 0 && (
                        <div className="px-4 py-1.5 bg-blue-50 text-[#3182F6] rounded-full text-xs font-bold">
                            Phase {phase} / 6
                        </div>
                    )}
                </div>

                {/* PHASE 0: Call Reception */}
                {phase === 0 && (
                    <div className="bg-white rounded-[32px] p-10 shadow-lg border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
                        <h2 className="text-2xl font-black text-gray-900 mb-6">인바운드 콜 수신</h2>
                        <div className="flex gap-4">
                            <input 
                                type="text" 
                                placeholder="고객 전화번호 입력 (Demo: 01012345678)"
                                className="flex-1 h-16 px-6 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#3182F6] focus:bg-white transition-all text-xl font-bold outline-none"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleCheckMember()}
                            />
                            <button 
                                onClick={handleCheckMember}
                                className="w-32 h-16 bg-[#3182F6] hover:bg-[#1B64DA] text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-blue-200"
                            >
                                수신 확인
                            </button>
                        </div>
                    </div>
                )}

                {/* PHASE 1: Compliance Script */}
                {phase === 1 && (
                    <div className="bg-white rounded-[32px] p-10 shadow-lg border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-gray-900 mb-2">필수 고지 안내 (스크립트)</h2>
                            <p className="text-gray-500 font-medium">상담 시작 전 반드시 아래 내용을 고객에게 안내해야 합니다.</p>
                        </div>

                        <div className="space-y-4 mb-8">
                            {[
                                { k: 'recording', t: '녹취 동의 안내', desc: '고객님의 원활한 상담과 권익 보호를 위해 통화 내용이 녹음됩니다. 동의하십니까?' },
                                { k: 'purpose', t: '상담 목적 안내', desc: '본 상담은 고객님의 문의 사항 처리 및 금융 상품 안내를 위해 진행됩니다.' },
                                { k: 'privacy', t: '개인정보 처리 안내', desc: '상담 처리를 위해 고객님의 일부 개인정보가 조회/이용될 수 있음을 안내드립니다.' }
                            ].map((script) => (
                                <div 
                                    key={script.k}
                                    onClick={() => setScriptsRead(p => ({...p, [script.k]: !p[script.k]}))}
                                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${scriptsRead[script.k] ? 'bg-blue-50 border-[#3182F6]' : 'bg-gray-50 border-transparent hover:bg-gray-100'}`}
                                >
                                    <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${scriptsRead[script.k] ? 'bg-[#3182F6] border-[#3182F6] text-white' : 'bg-white border-gray-300 text-transparent'}`}>
                                        <CheckCircle2 size={14} />
                                    </div>
                                    <div>
                                        <div className={`font-bold text-sm mb-1 ${scriptsRead[script.k] ? 'text-[#3182F6]' : 'text-gray-700'}`}>{script.t}</div>
                                        <div className="text-gray-500 text-sm leading-relaxed">"{script.desc}"</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={handleScriptComplete}
                            disabled={!Object.values(scriptsRead).every(Boolean)}
                            className="w-full h-16 bg-[#3182F6] disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-2xl font-bold text-lg transition-all shadow-lg disabled:shadow-none"
                        >
                            안내 완료 및 다음 단계
                        </button>
                    </div>
                )}

                {/* PHASE 2: Identity Verification */}
                {phase === 2 && (
                    <div className="bg-white rounded-[32px] p-10 shadow-lg border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-gray-900 mb-2">본인 확인 (정보 입력)</h2>
                            <p className="text-gray-500 font-medium">고객님께 성함과 생년월일을 확인해 주세요.</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">이름</label>
                                <input 
                                    type="text" 
                                    placeholder="예: 홍길동"
                                    className="w-full h-16 px-6 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#3182F6] focus:bg-white transition-all font-bold outline-none"
                                    value={idInput.name}
                                    onChange={e => setIdInput({...idInput, name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">생년월일 (6자리)</label>
                                <input 
                                    type="text" 
                                    placeholder="YYMMDD"
                                    maxLength={6}
                                    className="w-full h-16 px-6 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#3182F6] focus:bg-white transition-all font-bold outline-none tracking-widest"
                                    value={idInput.birthDate}
                                    onChange={e => setIdInput({...idInput, birthDate: e.target.value.replace(/\D/g, '')})}
                                />
                            </div>
                        </div>

                        <button 
                            onClick={handleIdVerify}
                            className="w-full h-16 bg-[#333D4B] hover:bg-black text-white rounded-2xl font-bold text-lg transition-all shadow-lg"
                        >
                            정보 검증
                        </button>
                    </div>
                )}

                {/* PHASE 3: SMS Verification */}
                {phase === 3 && (
                    <div className="bg-white rounded-[32px] p-10 shadow-lg border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
                        <div className="mb-8 text-center">
                            <div className="w-16 h-16 bg-blue-50 text-[#3182F6] rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Smartphone size={32} />
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 mb-2">SMS 추가 인증</h2>
                            <p className="text-gray-500 font-medium">등록된 휴대폰 번호({phoneNumber})로 인증번호를 전송합니다.</p>
                        </div>

                        {!smsSent ? (
                            <button 
                                onClick={handleSendSms}
                                className="w-full h-16 bg-[#3182F6] text-white rounded-2xl font-bold text-lg transition-all shadow-lg hover:bg-[#1B64DA]"
                            >
                                인증번호 발송하기
                            </button>
                        ) : (
                            <div className="space-y-6">
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        placeholder="인증번호 6자리"
                                        maxLength={6}
                                        className="w-full h-20 text-center text-3xl font-black tracking-[0.5em] bg-gray-50 rounded-2xl border-2 border-transparent focus:border-[#3182F6] focus:bg-white transition-all outline-none"
                                        value={otp}
                                        onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-red-500">
                                        02:59
                                    </div>
                                </div>
                                <button 
                                    onClick={handleSmsVerify}
                                    className="w-full h-16 bg-[#3182F6] text-white rounded-2xl font-bold text-lg transition-all shadow-lg hover:bg-[#1B64DA]"
                                >
                                    인증 확인
                                </button>
                                <div className="text-center">
                                    <button onClick={handleSendSms} className="text-sm text-gray-400 hover:text-gray-600 font-bold underline">인증번호 재전송</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* PHASE 4: Customer Detail & Card Info */}
                {phase === 4 && customerData && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        {/* Title Bar with SSAP Logo */}
                        <div className="flex justify-between items-center px-2">
                             <h2 className="text-2xl font-black text-gray-900">고객 정보 및 보유 상품</h2>
                             <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                                <ShieldCheck size={16} className="text-emerald-500" />
                                <span className="text-xs font-black text-gray-500">Secured by SSAP</span>
                             </div>
                        </div>

                        <div className="bg-white rounded-[32px] p-8 shadow-lg border border-gray-100">
                            <div className="grid grid-cols-2 gap-8 mb-8">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Customer Name</label>
                                    <div className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        {masking.name ? memberInfo.name : memberInfo.realName}
                                        <button onClick={() => setMasking(p => ({...p, name: !p.name}))} className="text-gray-300 hover:text-[#3182F6]">
                                            {masking.name ? <Lock size={16} /> : <User size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Phone Number</label>
                                    <div className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        {masking.phone ? phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1-****-$2') : phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')}
                                        <button onClick={() => setMasking(p => ({...p, phone: !p.phone}))} className="text-gray-300 hover:text-[#3182F6]">
                                            {masking.phone ? <Lock size={16} /> : <Smartphone size={16} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <h3 className="text-sm font-black text-gray-500 flex items-center gap-2">
                                    <CreditCard size={16} /> 보유 카드 목록
                                </h3>
                                {customerData.cards.map((card, idx) => (
                                    <div 
                                        key={idx} 
                                        onClick={() => {
                                            setLostCardSelection(card);
                                            setSelectedAction('LOST_REPORT'); // Auto-select for demo flow ease, or user can pick below
                                        }}
                                        className="group p-5 bg-gray-50 hover:bg-[#3182F6] rounded-2xl border border-transparent hover:border-blue-400 transition-all cursor-pointer"
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="font-bold text-gray-800 group-hover:text-white">{card.name}</div>
                                            <div className="text-[10px] font-black bg-white/50 text-gray-600 px-2 py-0.5 rounded group-hover:text-blue-600 group-hover:bg-white">{card.status}</div>
                                        </div>
                                        <div className="text-sm font-mono text-gray-500 group-hover:text-blue-100">
                                            {masking.card ? card.number : card.number.replace('****', '1234')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button 
                            onClick={() => setPhase(5)}
                            className="w-full h-16 bg-[#333D4B] text-white rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-lg"
                        >
                            상담 업무 진행
                        </button>
                    </div>
                )}

                {/* PHASE 5: Consultation / Lost Report */}
                {phase === 5 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="bg-white rounded-[32px] p-10 shadow-lg border border-gray-100">
                            <h2 className="text-2xl font-black text-gray-900 mb-6">상담 업무 선택</h2>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                {[
                                    { id: 'GENERAL', label: '일반 문의', icon: FileText },
                                    { id: 'LOST_REPORT', label: '분실 신고', icon: FileWarning, color: 'text-red-500 bg-red-50 hover:bg-red-500 hover:text-white' },
                                    { id: 'LIMIT', label: '한도 조회', icon: ArrowRight },
                                    { id: 'BILL', label: '청구 문의', icon: FileText }
                                ].map((action) => (
                                    <button 
                                        key={action.id}
                                        onClick={() => setSelectedAction(action.id)}
                                        className={`p-6 rounded-2xl border font-bold text-sm flex flex-col items-center gap-3 transition-all ${selectedAction === action.id ? 'bg-gray-800 text-white ring-4 ring-gray-100' : 'bg-gray-50 text-gray-600 border-transparent hover:bg-white hover:shadow-md'}`}
                                    >
                                        <action.icon size={24} className={selectedAction === action.id ? "text-white" : (action.color?.split(' ')[0] || "text-gray-400")} />
                                        {action.label}
                                    </button>
                                ))}
                            </div>

                            {/* Lost Report Specific UI */}
                            {selectedAction === 'LOST_REPORT' && (
                                <div className="bg-red-50 p-6 rounded-3xl border border-red-100 animate-in zoom-in-95 duration-200">
                                    <h3 className="font-bold text-red-600 flex items-center gap-2 mb-4">
                                        <AlertCircle size={18} /> 분실 신고 접수
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        고객님의 요청에 따라 분실/도난 신고를 접수합니다. 처리 즉시 해당 카드의 거래가 정지됩니다.
                                    </p>
                                    <div className="bg-white p-4 rounded-xl border border-red-200 mb-4">
                                        <div className="text-xs font-bold text-gray-500 mb-2">분실 대상 카드</div>
                                        {customerData?.cards.map(card => (
                                            <label key={card.number} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                                                <input 
                                                    type="radio" 
                                                    name="lostCard" 
                                                    className="w-4 h-4 text-red-600"
                                                    checked={lostCardSelection?.number === card.number}
                                                    onChange={() => setLostCardSelection(card)}
                                                />
                                                <span className="font-bold text-gray-800">{card.name}</span>
                                                <span className="text-xs text-gray-400 font-mono ml-auto">{card.number}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <button 
                                        onClick={handleLostReport}
                                        className="w-full h-14 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                                    >
                                        분실 신고 및 거래 정지 실행
                                    </button>
                                </div>
                            )}

                             {selectedAction === 'GENERAL' && (
                                <div className="p-6 bg-gray-50 rounded-3xl text-center">
                                    <p className="text-gray-500 font-bold mb-4">일반적인 상담 내용을 기록하고 종료합니다.</p>
                                    <button 
                                        onClick={() => { setConsultationResult(p => ({...p, category: 'GENERAL', summary: '일반 상담 진행'})); setPhase(6); }}
                                        className="px-8 py-3 bg-white border border-gray-200 rounded-xl font-bold shadow-sm hover:bg-gray-100"
                                    >
                                        상담 내용 저장 단계로 이동
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* PHASE 6: Save & Conclusion */}
                {phase === 6 && (
                    <div className="bg-white rounded-[32px] p-10 shadow-lg border border-gray-100 animate-in fade-in slide-in-from-bottom-4">
                        <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                            <Save className="text-[#3182F6]" /> 상담 이력 저장
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">상담 카테고리</label>
                                <div className="flex gap-2">
                                    <span className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold text-gray-700">{consultationResult.category}</span>
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">상담 요약 / 메모</label>
                                <textarea 
                                    className="w-full h-32 p-4 bg-gray-50 border-2 border-transparent focus:border-[#3182F6] rounded-2xl font-medium outline-none resize-none"
                                    placeholder="특이사항이나 상담 내용을 상세히 기록해 주세요."
                                    value={consultationResult.summary}
                                    onChange={e => setConsultationResult({...consultationResult, summary: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">태그 (선택)</label>
                                <div className="flex flex-wrap gap-2">
                                    {['친절 상담', '불만 제기', '재연락 필요', '시스템 오류'].map(tag => (
                                        <button 
                                            key={tag}
                                            onClick={() => {
                                                const tags = consultationResult.tags.includes(tag) 
                                                    ? consultationResult.tags.filter(t => t !== tag)
                                                    : [...consultationResult.tags, tag];
                                                setConsultationResult({...consultationResult, tags});
                                            }}
                                            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${consultationResult.tags.includes(tag) ? 'bg-blue-50 border-blue-200 text-[#3182F6]' : 'bg-white border-gray-200 text-gray-500'}`}
                                        >
                                            #{tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button 
                                onClick={handleSaveConsultation}
                                disabled={loading}
                                className="w-full h-16 bg-[#1A73E8] text-white rounded-2xl font-black text-lg hover:brightness-110 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : '저장 및 상담 종료'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 z-50 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <Loader2 size={48} className="text-[#3182F6] animate-spin mb-4" />
                        <span className="text-sm font-black text-gray-600">처리 중...</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InboundCallPage;

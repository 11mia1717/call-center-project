import UnmaskReasonModal from '../components/UnmaskReasonModal';

// ... (existing imports)

const InboundCallPage = () => {
    // ... (existing states)
    
    // Compliance States
    const [maskingState, setMaskingState] = useState({ name: true, phone: true });
    const [unmaskTarget, setUnmaskTarget] = useState(null); // { field: 'name' | 'phone', label: string }
    const [recordingAgreed, setRecordingAgreed] = useState(false); // [COMPLIANCE] Recording Consent

    // ... (existing effects/functions)

    const handleUnmaskRequest = (field, label) => {
        setUnmaskTarget({ field, label });
    };

    const handleUnmaskConfirm = (reason) => {
        console.log(`[COMPLIANCE] Unmasking ${unmaskTarget?.label} - Reason: ${reason} - Agent: ${localStorage.getItem('agentName') || 'AGENT-1'} - Time: ${new Date().toISOString()}`);
        setMaskingState(prev => ({ ...prev, [unmaskTarget.field]: false }));
        setUnmaskTarget(null);
    };

    const saveConsultation = async () => {
        if (!recordingAgreed) {
            alert('녹취 동의 여부를 확인해 주세요.');
            return;
        }
        setLoading(true);
        try {
            await api.post('/callcenter/operator/calls/result', {
                agentId: localStorage.getItem('agentId'),
                targetId: memberInfo?.isExist ? memberInfo.username : '01012345678', // Demo target
                maskedName: maskingState.name ? (memberInfo?.maskedName || '홍*동') : (authData.name || '홍길동'),
                purpose: consulContent.category,
                result: 'COMPLETED',
                duration: 120, // Demo duration
                recordingAgreed: recordingAgreed, // [COMPLIANCE]
                summary: consulContent.summary
            });
            alert('상담 이력이 저장되었습니다.');
            setPhase(1); // Reset to idle
            // Reset states
            setConsulContent({ category: 'CARD_GENERAL', summary: '' });
            setRecordingAgreed(false);
        } catch (error) {
            console.error(error);
            setError('상담 이력 저장 실패');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">

    {/* Compliance: Unmask Reason Modal */}
    <UnmaskReasonModal 
        isOpen={!!unmaskTarget}
        onClose={() => setUnmaskTarget(null)}
        onConfirm={handleUnmaskConfirm}
        fieldName={unmaskTarget?.label}
    />
    
    <main className="max-w-[1200px] mx-auto p-8 relative">
        
        {/* Compliance: Recording Consent Toggle (Always Visible) */}
        <div className="mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between animate-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Call Recording Active</span>
            </div>
            <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${recordingAgreed ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300 group-hover:border-blue-400'}`}>
                    {recordingAgreed && <CheckCircle2 size={14} className="text-white" />}
                </div>
                <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={recordingAgreed} 
                    onChange={e => setRecordingAgreed(e.target.checked)} 
                />
                <span className={`text-sm font-bold transition-colors ${recordingAgreed ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-500'}`}>
                    녹취 동의 (필수 안내 및 동의)
                </span>
            </label>
        </div>
    
    {/* Inside Phase 2 & 3 - Replace direct access with masked view */}
    {/* Example for Phase 2 Name Display */}
    {phase === 2 && memberInfo?.isExist && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="mb-10">
                <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">본인 인증</h2>
                <p className="text-gray-500 font-bold">회원임이 확인되었습니다. SSAP SMS 인증을 진행해 주세요.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                            <User size={20} />
                        </div>
                        <span className="text-lg font-black text-gray-800 tracking-tight">회원 기본 정보</span>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Customer Name</label>
                        <div className="flex items-center gap-2">
                            <div className="text-xl font-bold bg-gray-50 p-4 rounded-2xl border border-gray-100 flex-1">
                                {maskingState.name ? memberInfo.maskedName : (authData.name || '홍길동')}
                            </div>
                             <button 
                                onClick={() => maskingState.name ? handleUnmaskRequest('name', '고객 성명') : setMaskingState(p => ({...p, name: true}))}
                                className={`p-4 rounded-2xl border transition-all ${maskingState.name ? 'bg-white border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-200' : 'bg-red-50 border-red-100 text-red-500'}`}
                                title={maskingState.name ? "마스킹 해제 (사유 입력 필요)" : "다시 가리기"}
                            >
                                {maskingState.name ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <input 
                            type="text" placeholder="성함 입력" 
                            className="w-full h-14 px-6 bg-white border-2 border-gray-100 rounded-2xl font-bold focus:border-blue-600 transition-all outline-none"
                            value={authData.name} onChange={e => setAuthData({...authData, name: e.target.value})}
                        />
                        <input 
                            type="text" placeholder="생년월일 (YYYY-MM-DD)" 
                            className="w-full h-14 px-6 bg-white border-2 border-gray-100 rounded-2xl font-bold focus:border-blue-600 transition-all outline-none"
                            value={authData.birthDate} onChange={e => setAuthData({...authData, birthDate: e.target.value})}
                        />
                        <button 
                            onClick={requestSms}
                            className="w-full h-14 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-black transition-all"
                        >
                            인증번호 전송 요청
                        </button>
                    </div>
                </div>

                {authStatus !== 'idle' && (
                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 flex flex-col justify-center animate-in zoom-in duration-300">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-emerald-50 rounded-[24px] flex items-center justify-center text-emerald-500 mx-auto mb-4">
                                <Smartphone size={32} />
                            </div>
                            <h3 className="text-xl font-black text-gray-800 tracking-tight">인증번호 입력</h3>
                            {authData.devOtp && (
                                <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl mb-4 text-amber-600 text-[10px] font-black uppercase tracking-widest">
                                    [DEV ONLY] OTP: <span className="text-amber-700 text-sm select-all">{authData.devOtp}</span>
                                </div>
                            )}
                            <p className="text-xs font-bold text-gray-400">발송된 6자리 번호를 입력해 주세요.</p>
                            <input 
                                type="text" maxLength={6}
                                className="w-full h-20 text-center text-3xl font-black tracking-[1em] bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-emerald-500 transition-all outline-none text-emerald-600"
                                value={authData.otp} onChange={e => setAuthData({...authData, otp: e.target.value})}
                            />
                            <button 
                                onClick={verifySms}
                                className="w-full h-16 bg-emerald-500 text-white rounded-2xl font-black text-lg hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
                            >
                                인증 완료
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )}

                        {phase === 3 && customerDetail && (
                            <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-8">
                                <div className="flex items-end justify-between mb-2">
                                    <div>
                                        <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">고객 360 View</h2>
                                        <p className="text-gray-500 font-bold">인증이 성공하였습니다. 고객의 전체 금융 정보를 조회합니다.</p>
                                    </div>
                                    <div className="px-6 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black border border-emerald-100 uppercase tracking-widest shadow-sm">
                                        Verified
                                    </div>
                                </div>

                                {/* Customer Profile Card */}
                                <div className="bg-white p-10 rounded-[48px] shadow-sm border border-gray-100 flex gap-10 items-center">
                                    <div className="w-32 h-32 bg-blue-50 rounded-[40px] flex items-center justify-center text-blue-600">
                                        <User size={56} />
                                    </div>
                                    <div className="flex-1 grid grid-cols-2 gap-y-6 gap-x-12">
                                        <div>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Full Name</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl font-black text-gray-900">
                                                    {maskingState.name ? customerDetail.basic.name.replace(/.(?=.$)/g, '*') : customerDetail.basic.name}
                                                </span>
                                                <button 
                                                    onClick={() => maskingState.name ? handleUnmaskRequest('name', '고객 성명') : setMaskingState(p => ({...p, name: true}))}
                                                    className="text-gray-300 hover:text-blue-600 transition-colors"
                                                >
                                                    {maskingState.name ? <Eye size={16} /> : <EyeOff size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Phone Number</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl font-bold text-gray-900">
                                                    {maskingState.phone ? customerDetail.basic.phone.replace(/(\d{3})-\d{4}-(\d{4})/, '$1-****-$2') : customerDetail.basic.phone}
                                                </span>
                                                <button 
                                                    onClick={() => maskingState.phone ? handleUnmaskRequest('phone', '전화번호') : setMaskingState(p => ({...p, phone: true}))}
                                                    className="text-gray-300 hover:text-blue-600 transition-colors"
                                                >
                                                    {maskingState.phone ? <Eye size={16} /> : <EyeOff size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Residential Address</span>
                                            <span className="text-lg font-bold text-gray-700">{customerDetail.basic.address}</span>
                                        </div>
                                        
                                        {/* Compliance: Granular Consent Status */}
                                        <div className="col-span-2 mt-4 pt-6 border-t border-gray-100">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-3">Consent Status (2026 PIPA)</span>
                                            <div className="flex gap-3">
                                                <div className="px-4 py-2 bg-gray-100 rounded-xl flex items-center gap-2">
                                                    <CheckCircle2 size={14} className="text-gray-500" />
                                                    <span className="text-xs font-black text-gray-600">필수 정보 (동의함)</span>
                                                </div>
                                                <button 
                                                    onClick={() => {
                                                        const newStatus = !customerDetail.marketingConsent;
                                                        setCustomerDetail(prev => ({...prev, marketingConsent: newStatus}));
                                                        alert(newStatus ? '마케팅 정보 수신 동의 처리되었습니다.' : '마케팅 정보 수신 동의가 철회되었습니다.\n(즉시 반영 완료)');
                                                    }}
                                                    className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all border-2 ${customerDetail.marketingConsent ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-white border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500'}`}
                                                >
                                                    {customerDetail.marketingConsent ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                                                    <span className="text-xs font-black">
                                                        마케팅/선택 ({customerDetail.marketingConsent ? '동의함' : '미동의'})
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Dash Tabs */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Cards List */}
                                    <div className="bg-white px-8 py-10 rounded-[48px] shadow-sm border border-gray-100">
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-[13px] font-black text-gray-900 flex items-center gap-2">
                                                <CreditCard size={18} className="text-blue-600" />
                                                보유 카드/계좌
                                            </h3>
                                            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{customerDetail.cards.length}건</span>
                                        </div>
                                        <div className="space-y-4">
                                            {customerDetail.cards.map((c, idx) => (
                                                <div key={idx} className="group p-6 bg-gray-50 rounded-[32px] hover:bg-blue-600 transition-all cursor-pointer border border-transparent hover:border-blue-400 shadow-sm overflow-hidden relative">
                                                    <div className="relative z-10 flex justify-between items-start mb-4">
                                                        <div className="text-md font-black text-gray-900 group-hover:text-white transition-colors">{c.cardName}</div>
                                                        <span className="text-[9px] font-black px-2 py-0.5 bg-white text-blue-600 rounded-md group-hover:bg-blue-500 group-hover:text-white">{c.status}</span>
                                                    </div>
                                                    <div className="relative z-10 text-xl font-mono font-bold text-gray-400 group-hover:text-blue-100 transition-colors tracking-widest mb-4">
                                                        {c.cardNumber}
                                                    </div>
                                                    <div className="relative z-10 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-blue-200">
                                                        <span>Limit: {c.creditLimit.toLocaleString()}원</span>
                                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                    </div>
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-20 transition-opacity blur-3xl"></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Recent History */}
                                    <div className="bg-white px-8 py-10 rounded-[48px] shadow-sm border border-gray-100 overflow-hidden">
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-[13px] font-black text-gray-900 flex items-center gap-2">
                                                <History size={18} className="text-[#1A73E8]" />
                                                최근 상담 이력
                                            </h3>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="flex gap-4">
                                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 ring-4 ring-blue-50"></div>
                                                <div className="flex-1 pb-6 border-b border-gray-50">
                                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">2026-01-25</div>
                                                    <div className="text-sm font-bold text-gray-800 mb-1">카드 이용내역 조회</div>
                                                    <div className="text-xs text-gray-400 font-medium">실시간 결제 금액 확인 요청으로 처리 완료</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 opacity-50">
                                                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full mt-2 ring-4 ring-gray-50"></div>
                                                <div className="flex-1 pb-6 border-b border-gray-50">
                                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">2026-01-10</div>
                                                    <div className="text-sm font-bold text-gray-800 mb-1">비밀번호 변경</div>
                                                    <div className="text-xs text-gray-400 font-medium">영업점 안내 후 모바일 앱 연동</div>
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setPhase(4)}
                                            className="w-full h-16 bg-[#1A73E8] text-white rounded-[24px] font-black text-[16px] hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-blue-200 mt-6"
                                        >
                                            상담 업무 진행하기
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {phase === 4 && (
                            <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">
                                <div className="mb-10">
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">상담 업무</h2>
                                    {memberInfo?.isExist ? (
                                        <p className="text-gray-500 font-bold">원하시는 업무를 선택하여 처리를 진행해 주세요.</p>
                                    ) : (
                                        <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl mb-6">
                                            <div className="flex items-center gap-2 text-amber-600 font-black text-xs uppercase tracking-widest mb-1">
                                                <UserPlus size={14} /> New Customer
                                            </div>
                                            <p className="text-amber-700 font-bold text-sm">
                                                가입되지 않은 전화번호입니다. 신규 회원 가입 상담 또는 일반 문의 업무를 진행해 주세요.
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {[
                                        { i: Search, t: '카드 조회', c: 'blue', action: () => alert('카드 조회 기능은 준비중입니다.') },
                                        { i: Smartphone, t: '변경 신청', c: 'emerald', action: () => alert('변경 신청 기능은 준비중입니다.') },
                                        { i: UserPlus, t: '신규 신청', c: 'amber', action: () => alert('신규 신청 기능은 준비중입니다.') },
                                        { i: ShieldCheck, t: '분실 신고', c: 'red', action: () => setConsulContent({...consulContent, category: 'CARD_LOST'}) }, // Triggers Lost Flow View
                                        { i: Lock, t: '비밀번호', c: 'indigo' },
                                        { i: FileText, t: '청구서', c: 'purple' },
                                        { i: MapPin, t: '지점 안내', c: 'gray' },
                                        { i: Mail, t: 'SMS 발송', c: 'sky' }
                                    ].map((m, idx) => (
                                        <button 
                                            key={idx} 
                                            onClick={m.action}
                                            className={`group p-8 bg-white border border-gray-100 rounded-[40px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center gap-4 ${consulContent.category === 'CARD_LOST' && m.t === '분실 신고' ? 'ring-4 ring-red-100' : ''}`}
                                        >
                                            <div className={`w-14 h-14 bg-${m.c}-50 rounded-2xl flex items-center justify-center text-${m.c}-500 group-hover:bg-${m.c}-500 group-hover:text-white transition-all`}>
                                                <m.i size={28} />
                                            </div>
                                            <span className="text-sm font-black text-gray-800">{m.t}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Lost Report Form Sub-View */}
                                {consulContent.category === 'CARD_LOST' && (
                                    <div className="mt-10 bg-red-50 p-8 rounded-[40px] border border-red-100 animate-in slide-in-from-bottom-4">
                                        <h3 className="text-xl font-black text-red-600 mb-6 flex items-center gap-2">
                                            <AlertCircle /> 분실 신고 접수
                                        </h3>
                                        <div className="space-y-6">
                                            <div className="bg-white p-6 rounded-3xl border border-red-100">
                                                <label className="text-xs font-bold text-gray-500 mb-2 block">1. 분실/도난 카드 선택</label>
                                                <div className="space-y-2">
                                                    {customerDetail?.cards.map((c, i) => (
                                                        <label key={i} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer">
                                                            <input type="radio" name="lostCard" className="w-5 h-5 text-red-500 focus:ring-red-500" />
                                                            <div className="flex-1">
                                                                <div className="font-bold text-gray-800">{c.cardName}</div>
                                                                <div className="text-xs text-gray-500">{c.cardNumber}</div>
                                                            </div>
                                                            <span className="text-[10px] font-black bg-emerald-100 text-emerald-600 px-2 py-1 rounded-md">{c.status}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-white p-6 rounded-3xl border border-red-100">
                                                    <label className="text-xs font-bold text-gray-500 mb-2 block">2. 분실 유형</label>
                                                    <div className="flex gap-4">
                                                        <label className="flex items-center gap-2"><input type="radio" name="type" /> 분실</label>
                                                        <label className="flex items-center gap-2"><input type="radio" name="type" /> 도난</label>
                                                        <label className="flex items-center gap-2"><input type="radio" name="type" /> 훼손</label>
                                                    </div>
                                                </div>
                                                <div className="bg-white p-6 rounded-3xl border border-red-100">
                                                    <label className="text-xs font-bold text-gray-500 mb-2 block">3. 재발급 신청</label>
                                                    <label className="flex items-center gap-2 mt-2">
                                                        <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" />
                                                        <span className="font-bold">즉시 재발급 신청 (동일 주소지)</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    alert('분실신고가 접수되었습니다 (카드 정지 완료)');
                                                    setConsulContent({...consulContent, summary: '플래티늄카드 분실신고 및 정지 처리 완료 (재발급 신청)'});
                                                    handleCallEnd(); // Move to ACW
                                                }}
                                                className="w-full h-16 bg-red-500 text-white rounded-2xl font-black text-lg hover:bg-red-600 transition-all shadow-lg shadow-red-200"
                                            >
                                                분실 신고 즉시 처리 및 정지
                                            </button>
                                        </div>
                                    </div>

                                )}
                            </div>
                        )}

                        {phase === 5 && (
                            <div className="animate-in zoom-in duration-500 max-w-xl mx-auto py-10">
                                <div className="text-center mb-10">
                                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-sm">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">통화 종료 및 후처리</h2>
                                    <p className="text-gray-500 font-bold">상담 내용을 요약하여 저장해 주세요.</p>
                                </div>

                                <div className="bg-white p-10 rounded-[48px] shadow-xl border border-gray-100 space-y-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">상담 카테고리</label>
                                            <select 
                                                className="w-full h-14 px-6 bg-gray-50 border-2 border-transparent rounded-2xl font-bold focus:border-blue-600 transition-all outline-none"
                                                value={consulContent.category} onChange={e => setConsulContent({...consulContent, category: e.target.value})}
                                            >
                                                <option value="CARD_GENERAL">일반 문의</option>
                                                <option value="CARD_LOST">분실/도난 신고</option>
                                                <option value="CARD_ISSUE">카드 신청/발급</option>
                                                <option value="CARD_BILL">청구/납부 관련</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">상담 요약</label>
                                            <textarea 
                                                rows={4}
                                                className="w-full p-6 bg-gray-50 border-2 border-transparent rounded-3xl font-bold focus:border-blue-600 transition-all outline-none resize-none"
                                                placeholder="상담 내용을 간략히 기록하세요..."
                                                value={consulContent.summary} onChange={e => setConsulContent({...consulContent, summary: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <button 
                                        onClick={saveConsultation}
                                        className="w-full h-20 bg-[#1A73E8] text-white rounded-[30px] font-black text-xl hover:brightness-110 active:scale-[0.98] transition-all shadow-2xl shadow-blue-200"
                                    >
                                        상담 완료 및 저장
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {error && (
                            <div className="mt-8 p-6 bg-red-50 border border-red-100 rounded-[30px] flex items-start gap-4 animate-in slide-in-from-top-4 duration-300">
                                <AlertCircle className="text-red-500 mt-1" />
                                <div>
                                    <div className="text-sm font-black text-red-600 mb-1">처리 오류 발생</div>
                                    <div className="text-xs text-red-400 font-bold">{error}</div>
                                </div>
                                <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600 font-black text-xs">닫기</button>
                            </div>
                        )}



                {/* Loading Overlay */}
                {loading && (
                    <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 size={48} className="text-[#1A73E8] animate-spin" />
                            <span className="text-sm font-black text-blue-600 animate-pulse">데이터를 불러오는 중...</span>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default InboundCallPage;

import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { Mic, AlertCircle, ShieldAlert, CheckCircle2, CreditCard, ChevronRight, LogOut, MessageSquare } from 'lucide-react';

export default function LossPage() {
    const { state } = useLocation();
    const customerRef = state?.customerRef;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [complete, setComplete] = useState(false);
    const [result, setResult] = useState(null);
    const [cards, setCards] = useState([]);
    const [selectedCardRefs, setSelectedCardRefs] = useState([]);

    useEffect(() => {
        if (customerRef) {
            loadCards();
        }
    }, [customerRef]);

    const loadCards = async () => {
        try {
            const res = await api.get(`/callcenter/customer/${customerRef}/cards`);
            const fetchedCards = res.cards || [];
            setCards(fetchedCards);

            const activeRefs = fetchedCards
                .filter(c => c.status === 'ACTIVE')
                .map(c => c.cardRef);
            setSelectedCardRefs(activeRefs);
        } catch (e) {
            console.error('카드 목록 조회 실패', e);
        }
    };

    const toggleCardSelection = (cardRef) => {
        setSelectedCardRefs(prev =>
            prev.includes(cardRef)
                ? prev.filter(ref => ref !== cardRef)
                : [...prev, cardRef]
        );
    };

    const handleLoss = async () => {
        if (selectedCardRefs.length === 0) {
            alert('중지할 카드를 선택해 주세요.');
            return;
        }

        if (!confirm(`선택한 ${selectedCardRefs.length}개의 카드를 정말로 분실 신고 하시겠습니까?`)) return;

        setLoading(true);
        try {
            const res = await api.post('/callcenter/card/loss', {
                customerRef,
                lossType: 'LOSS',
                selectedCardRefs
            });
            setResult(res);
            setComplete(true);
        } catch (e) {
            alert('신고 접수 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleEndSession = async () => {
        try {
            await api.post('/callcenter/session/end', {});
        } catch (e) {}
        api.clearToken();
        navigate('/dashboard');
    };

    if (!customerRef) return <div className="page-container flex items-center justify-center min-h-screen text-gray-400 font-bold">인증 정보가 만료되었습니다.</div>;

    if (complete) {
        return (
            <div className="page-container bg-gray-50 min-h-screen pb-20 font-sans">
                <header className="page-header bg-white shadow-sm border-b py-4 px-6 flex justify-center sticky top-0 z-30">
                    <Logo className="h-6" />
                </header>

                <main className="max-w-3xl mx-auto p-6 animate-fade-in text-center flex flex-col items-center justify-center pt-20">
                    <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mb-8 shadow-xl shadow-green-100">
                        <CheckCircle2 size={48} />
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">분실 신고 접수 완료</h1>
                    <p className="text-gray-500 text-lg font-bold mb-10 italic">"카드 분실 신고 처리가 모두 완료되었습니다."</p>

                    <div className="bg-white rounded-[32px] shadow-custom border border-gray-100 p-10 w-full mb-10">
                        <div className="flex justify-between items-center pb-6 border-b border-gray-50 mb-8">
                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Receipt ID</span>
                            <span className="text-lg font-mono font-black text-blue-600">{result?.lossCaseId}</span>
                        </div>

                        <div className="space-y-4">
                            {result?.stoppedCards?.map(card => (
                                <div key={card.cardRef} className="flex justify-between items-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm">
                                            <CreditCard size={24} />
                                        </div>
                                        <strong className="text-xl font-black text-gray-800 tracking-widest font-mono">{card.maskedCardNo}</strong>
                                    </div>
                                    <span className="px-3 py-1 bg-red-50 text-red-500 text-[10px] font-black rounded-lg border border-red-100 uppercase">Suspended</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button 
                        className="w-full max-w-sm h-18 bg-gray-900 text-white rounded-2xl font-black text-lg shadow-xl shadow-gray-200 hover:brightness-110 active:scale-[0.98] transition-all"
                        onClick={handleEndSession}
                    >
                        상담 종료 (홈으로)
                    </button>
                </main>
            </div>
        );
    }

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
                {/* Script Section: Outbound 스타일과 통일 (빨간색 경고 버전) */}
                <section className="bg-red-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-red-200">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md">
                            <ShieldAlert size={16} />
                            <span className="text-xs font-bold uppercase tracking-widest">Loss Report Script</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">사고 및 분실 신고를 접수합니다.</h2>
                        <p className="text-white text-sm leading-relaxed max-w-lg font-medium opacity-95">
                            "선택하신 카드의 분실 신고를 접수하겠습니다. 신고 즉시 카드의 모든 기능이 정지되며, 철회는 영업점을 방문하셔야 합니다. 진행하시겠습니까?"
                        </p>
                    </div>
                    <ShieldAlert size={140} className="absolute -bottom-8 -right-8 text-white/10 rotate-12" />
                </section>

                <div className="bg-white rounded-32px p-10 border border-gray-100 shadow-custom">
                    <div className="mb-8">
                        <h3 className="text-xl font-black text-gray-900 mb-2">분실 신고 카드 선택</h3>
                        <p className="text-sm font-bold text-gray-400">정지할 활성 카드를 선택하여 주십시오.</p>
                    </div>

                    <div className="space-y-4 mb-10">
                        {cards.map(card => (
                            <div
                                key={card.cardRef}
                                className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                                    selectedCardRefs.includes(card.cardRef) 
                                    ? 'border-blue-600 bg-blue-50/30' 
                                    : 'border-gray-50 bg-white hover:border-gray-200 shadow-sm'
                                } ${card.status !== 'ACTIVE' ? 'opacity-40 cursor-not-allowed' : ''}`}
                                onClick={() => card.status === 'ACTIVE' && toggleCardSelection(card.cardRef)}
                            >
                                <div className="flex items-center gap-6">
                                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                        selectedCardRefs.includes(card.cardRef) 
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100' 
                                        : 'border-gray-200 bg-white'
                                    }`}>
                                        {selectedCardRefs.includes(card.cardRef) && <CheckCircle2 size={16} strokeWidth={3} />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`text-xl font-black font-mono tracking-[4px] ${selectedCardRefs.includes(card.cardRef) ? 'text-blue-700' : 'text-gray-900'}`}>
                                            {card.maskedCardNo}
                                        </span>
                                    </div>
                                </div>
                                <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black border uppercase ${
                                    card.status === 'ACTIVE' 
                                    ? 'bg-green-50 text-green-600 border-green-100' 
                                    : 'bg-red-50 text-red-500 border-red-100'
                                }`}>
                                    {card.status === 'ACTIVE' ? '사용 가능' : '정지됨'}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-red-50 rounded-2xl p-6 border border-dashed border-red-200 mb-8 flex gap-4">
                        <AlertCircle className="text-red-500 shrink-0" size={20} />
                        <p className="text-red-600/80 text-sm font-bold leading-relaxed">
                            이 작업은 취소가 불가능하며 실시간으로 카드 효력이 중지됩니다. 
                            반드시 고객에게 최종 확인을 받은 후 처리해 주십시오.
                        </p>
                    </div>

                    <button
                        className={`w-full h-18 py-6 rounded-2xl font-black text-xl shadow-xl transition-all flex items-center justify-center gap-3 ${
                            selectedCardRefs.length > 0 
                            ? 'bg-red-600 text-white shadow-red-100 hover:brightness-110 active:scale-[0.98]' 
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                        onClick={handleLoss}
                        disabled={loading || selectedCardRefs.length === 0}
                    >
                        {loading ? '데이터 전송 중...' : (
                            <>
                                <span>선택한 {selectedCardRefs.length}건 분실 신고 접수</span>
                                <ChevronRight size={24} />
                            </>
                        )}
                    </button>
                    
                    <button 
                        className="w-full py-4 mt-2 text-gray-400 font-bold hover:text-gray-600 transition-colors text-sm"
                        onClick={handleEndSession}
                    >
                        취소 및 상담 종료
                    </button>
                </div>
            </main>
        </div>
    );
}

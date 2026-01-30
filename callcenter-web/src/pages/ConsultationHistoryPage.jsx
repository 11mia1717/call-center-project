import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Clock, PhoneIncoming, PhoneOutgoing, 
    User, FileText, CheckCircle2, XCircle, AlertCircle, 
    Calendar, Loader2 
} from 'lucide-react';
import { api } from '../api/client';

export default function ConsultationHistoryPage() {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Fetch call history from backend
                const response = await api.get('/callcenter/operator/calls/history');
                const data = response.data.map(item => ({
                    id: item.id,
                    name: item.maskedName || '알 수 없음',
                    time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    date: new Date(item.timestamp).toLocaleDateString(),
                    product: item.category === 'CARD_LOST' ? '분실 신고' : (item.tags?.[0] || '일반 상담'),
                    result: item.result || 'COMPLETED',
                    type: 'INBOUND', // Assuming inbound for now based on context
                    duration: '03:30', // Mock duration if not provided
                    note: item.summary
                }));
                 // Sort by date desc
                setHistory(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
            } catch (error) {
                console.error("Failed to fetch history:", error);
                // Fallback to empty or retained mock if error
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const getResultBadge = (result) => {
        switch(result) {
            case 'COMPLETED': return <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px] font-bold animate-in fade-in"><CheckCircle2 size={12}/> 완료</span>;
            case 'AGREED': return <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md text-[11px] font-bold animate-in fade-in"><CheckCircle2 size={12}/> 가입</span>;
            case 'REJECTED': return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-0.5 rounded-md text-[11px] font-bold animate-in fade-in"><XCircle size={12}/> 거절</span>;
            case 'HOLD': return <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md text-[11px] font-bold animate-in fade-in"><AlertCircle size={12}/> 보류</span>;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#F2F4F6] font-sans pb-20">
            {/* Header */}
            <header className="bg-white px-6 py-4 sticky top-0 z-30 shadow-sm border-b border-[#E5E8EB]">
                <div className="w-full max-w-[480px] mx-auto flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors text-gray-700">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-[17px] font-bold text-[#333D4B]">상담 이력 조회</h1>
                    <div className="w-10"></div>
                </div>
            </header>

            <main className="w-full max-w-[480px] mx-auto p-4 space-y-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 size={32} className="text-[#3182F6] animate-spin" />
                        <span className="text-gray-400 font-bold text-sm">기록을 불러오는 중...</span>
                    </div>
                ) : history.length === 0 ? (
                    <div className="text-center py-20 text-gray-400 font-bold">
                        최근 상담 이력이 없습니다.
                    </div>
                ) : (
                    history.map((item, idx) => (
                        <div key={idx} className="bg-white rounded-[24px] p-6 shadow-sm border border-[#E5E8EB] active:scale-[0.99] transition-transform hover:shadow-md animate-in slide-in-from-bottom-2" style={{animationDelay: `${idx * 50}ms`}}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center shadow-inner ${item.type === 'INBOUND' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                                        {item.type === 'INBOUND' ? <PhoneIncoming size={20} /> : <PhoneOutgoing size={20} />}
                                    </div>
                                    <div>
                                        <div className="text-[16px] font-bold text-[#333D4B] flex items-center gap-1.5">
                                            {item.name} <span className="text-xs font-normal text-gray-400">고객님</span>
                                        </div>
                                        <div className="text-[11px] text-[#8B95A1] font-bold flex items-center gap-1.5 mt-0.5">
                                            <Calendar size={10} /> {item.date}
                                            <span className="w-0.5 h-2 bg-gray-200"></span>
                                            <Clock size={10} /> {item.time}
                                        </div>
                                    </div>
                                </div>
                                {getResultBadge(item.result)}
                            </div>
                            
                            <div className="bg-[#F9FAFB] rounded-2xl p-4 border border-gray-100">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <FileText size={14} className="text-[#3182F6]" />
                                    <span className="text-[13px] font-bold text-[#4E5968]">{item.product}</span>
                                </div>
                                <p className="text-[13px] text-[#6B7684] pl-5.5 leading-relaxed font-medium">{item.note}</p>
                            </div>
                        </div>
                    ))
                )}
            </main>
        </div>
    );
}

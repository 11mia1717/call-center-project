import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { 
    FileAudio, Download, Play, Trash2, 
    ChevronLeft, Search, Filter, ShieldCheck,
    Clock, Database, HardDrive, AlertCircle
} from 'lucide-react';

export default function RecordingListPage() {
    const navigate = useNavigate();
    const [recordings, setRecordings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load simulated recordings from localStorage
        const loadRecordings = () => {
            setLoading(true);
            const saved = JSON.parse(localStorage.getItem('saved_recordings') || '[]');
            // Sort by latest first
            setRecordings(saved.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
            setLoading(false);
        };
        
        loadRecordings();
    }, []);

    const formatSize = (bytes) => {
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    return (
        <div className="page-container bg-[#F4F7FA] min-h-screen flex flex-col font-sans">
            {/* Header */}
            <header className="bg-white border-b shadow-sm sticky top-0 z-30 h-16">
                <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
                    <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-all" onClick={() => navigate('/admin')}>
                        <Logo className="h-6" />
                        <div className="h-4 w-px bg-gray-200"></div>
                        <span className="text-sm font-bold text-gray-800">녹취 관리 시스템</span>
                    </div>
                    
                    <button 
                        onClick={() => navigate('/admin')}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold text-sm transition-colors"
                    >
                        <ChevronLeft size={18} />
                        관리자 대시보드
                    </button>
                </div>
            </header>

            <main className="flex-1 max-w-7xl w-full mx-auto p-8 animate-fade-in">
                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard icon={<Database size={24} />} label="총 보관 상담" value={recordings.length} color="blue" />
                    <StatCard icon={<HardDrive size={24} />} label="스토리지 사용량" value={formatSize(recordings.length * 1048576)} color="indigo" />
                    <StatCard icon={<Clock size={24} />} label="평균 보관 기간" value="90일 (Compliance)" color="gray" />
                </div>

                {/* List Container */}
                <div className="bg-white rounded-[40px] shadow-custom border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-1">통화 녹취 이력</h2>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Digital Evidence & Compliance Repository</p>
                        </div>
                        <div className="flex gap-3">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="고객명, 파일명 검색..." 
                                    className="pl-12 pr-6 h-12 bg-white border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64 transition-all"
                                />
                            </div>
                            <button className="h-12 w-12 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
                                <Filter size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">파일명 (Naming Convention)</th>
                                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">고객 정보</th>
                                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">저장 시간</th>
                                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">소요 시간</th>
                                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">관리</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                                                <span className="text-sm font-bold text-gray-400">보안 서버 로딩 중...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : recordings.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-30">
                                                <FileAudio size={48} />
                                                <span className="text-base font-bold text-gray-400">등록된 녹취 데이터가 없습니다.</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    recordings.map((rec, idx) => (
                                        <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                                        <FileAudio size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-gray-900 mb-0.5">{rec.filename}</div>
                                                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-tight">MP3 | {formatSize(rec.size)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-sm font-bold text-gray-800">{rec.customerName}</div>
                                                <div className="text-xs font-medium text-gray-400">{rec.customerPhone}</div>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-medium text-gray-600">
                                                {formatDate(rec.timestamp)}
                                            </td>
                                            <td className="px-8 py-6 text-sm font-bold text-gray-900 font-mono">
                                                {rec.duration}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all" title="미리듣기">
                                                        <Play size={18} fill="currentColor" />
                                                    </button>
                                                    <button className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-200 shadow-sm transition-all" title="다운로드">
                                                        <Download size={18} />
                                                    </button>
                                                    <button className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-600 hover:border-red-200 shadow-sm transition-all" title="삭제 (권한 필요)">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Compliance Footer */}
                <div className="mt-10 p-6 bg-amber-50 rounded-3xl border border-amber-100 flex gap-5 items-start">
                    <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-amber-900 mb-1">통신비밀보호법 및 개인정보 보호 안내</h4>
                        <p className="text-xs font-bold text-amber-800/70 leading-relaxed">
                            관리되는 모든 녹취 파일은 금융사 보안 지침에 따라 암호화되어 저장됩니다. 
                            인가되지 않은 외부 유출 및 사적 이용은 법적 처벌의 대상이 될 수 있으며, 
                            모든 접속 이력은 시스템에 의해 실시간으로 로깅 및 감시되고 있습니다.
                        </p>
                    </div>
                </div>
            </main>

            <footer className="h-14 bg-white border-t px-6 flex items-center justify-center text-[10px] font-black text-gray-300 uppercase tracking-[2px]">
                Compliance Management System v1.2.0 | Continue Core Tech
            </footer>
        </div>
    );
}

function StatCard({ icon, label, value, color }) {
    const colors = {
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
        gray: 'bg-gray-50 text-gray-600 border-gray-100'
    };
    
    return (
        <div className={`p-6 rounded-[32px] border ${colors[color]} flex items-center gap-5 shadow-sm`}>
            <div className="w-12 h-12 rounded-2xl bg-white border border-inherit flex items-center justify-center shadow-sm">
                {icon}
            </div>
            <div>
                <div className="text-[11px] font-black uppercase tracking-wider opacity-60 mb-1">{label}</div>
                <div className="text-2xl font-black tracking-tight">{value}</div>
            </div>
        </div>
    );
}

import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { Shield, FileText, Activity, ArrowLeft, Clock, User, ShieldCheck } from 'lucide-react';

export default function AdminDashboardPage() {
    const [activeTab, setActiveTab] = useState('results');
    const [callResults, setCallResults] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const adminId = localStorage.getItem('agentId') || 'admin';

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'results') {
                const res = await fetch(`http://localhost:8082/callcenter/operator/admin/results?adminId=${adminId}`);
                const data = await res.json();
                setCallResults(data);
            } else {
                const res = await fetch(`http://localhost:8082/callcenter/operator/admin/audit-logs?adminId=${adminId}`);
                const data = await res.json();
                setAuditLogs(data);
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container bg-gray-50 min-h-screen pb-20 font-sans">
            {/* Header */}
            <header className="page-header bg-white shadow-sm border-b py-4 sticky top-0 z-30">
                <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft size={20} className="text-gray-400" />
                        <Logo className="h-6" />
                        <div className="h-4 w-px bg-gray-200"></div>
                        <h1 className="text-lg font-bold text-gray-800">관리자 시스템</h1>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full border bg-blue-50 text-blue-600 border-blue-100 shadow-sm">
                        <ShieldCheck size={16} />
                        <span className="text-xs font-black tracking-widest uppercase">Admin Security Mode</span>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-6xl mx-auto p-6 animate-fade-in">
                <div className="mb-10">
                    <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tighter">시스템 로그 분석</h1>
                    <p className="text-gray-400 font-bold text-lg leading-tight">"전체 상담 이력 및 보안 감사 로그를 통합 관리합니다."</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-10">
                    <button 
                        className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all shadow-md active:scale-95 ${
                            activeTab === 'results' 
                                ? 'bg-blue-600 text-white shadow-blue-100' 
                                : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
                        }`}
                        onClick={() => setActiveTab('results')}
                    >
                        <FileText size={20} />
                        상담 결과 로그
                    </button>
                    <button 
                        className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all shadow-md active:scale-95 ${
                            activeTab === 'audit' 
                                ? 'bg-gray-800 text-white shadow-gray-100' 
                                : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
                        }`}
                        onClick={() => setActiveTab('audit')}
                    >
                        <Activity size={20} />
                        보안 감사 로그
                    </button>
                </div>

                {/* Compliance Notice */}
                <div className="bg-blue-600 rounded-3xl p-6 mb-10 text-white shadow-xl shadow-blue-100 flex items-center gap-4 relative overflow-hidden">
                    <div className="relative z-10 w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                        <Shield size={24} />
                    </div>
                    <div className="relative z-10">
                        <strong className="text-sm font-black uppercase tracking-widest block mb-1 opacity-70 border-b border-white/20 pb-1 mb-2">Compliance Notice</strong>
                        <p className="text-md font-bold leading-relaxed">
                            모든 개인정보는 마스킹 처리되어 표시되며, 상담 결과는 금융 규정에 따라 보관 기한(3개월) 후 자동 파기됩니다.
                        </p>
                    </div>
                    <Shield size={100} className="absolute -bottom-4 -right-4 text-white/10 rotate-12" />
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-[32px] shadow-custom border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-40 gap-4">
                            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                            <span className="text-gray-400 font-bold">대용량 데이터를 분석 중입니다...</span>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        {activeTab === 'results' ? (
                                            <>
                                                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">상담원</th>
                                                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">고객명</th>
                                                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">목적</th>
                                                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">결과</th>
                                                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">통화 시간</th>
                                                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">녹취 동의</th>
                                                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">수행 일시</th>
                                            </>
                                        ) : (
                                            <>
                                                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">접근 주체</th>
                                                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">보안 액션</th>
                                                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">데이터 대상</th>
                                                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">상세 이력</th>
                                                <th className="px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">기록 시점</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {activeTab === 'results' ? (
                                        callResults.length === 0 ? (
                                            <EmptyRow colSpan={7} message="기록된 상담 결과가 존재하지 않습니다." />
                                        ) : callResults.map((row, idx) => (
                                            <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                                                <td className="px-6 py-5 text-sm font-black text-gray-900 uppercase">{row.agentId}</td>
                                                <td className="px-6 py-5 text-sm font-bold text-gray-700">{row.maskedName}</td>
                                                <td className="px-6 py-5 text-sm font-bold text-gray-600">{row.purpose}</td>
                                                <td className="px-6 py-5">
                                                    <StatusTag status={row.result} />
                                                </td>
                                                <td className="px-6 py-5 text-sm font-mono text-gray-500 font-bold">
                                                    {Math.floor(row.duration / 60)}m {row.duration % 60}s
                                                </td>
                                                <td className="px-6 py-5">
                                                    {row.recordingAgreed ? (
                                                        <span className="text-green-500 font-black text-xs">AGREED</span>
                                                    ) : (
                                                        <span className="text-gray-300 font-black text-xs">N/A</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-5 text-[11px] font-bold text-gray-400 font-mono">
                                                    {row.createdAt?.slice(0, 16).replace('T', ' ')}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        auditLogs.length === 0 ? (
                                            <EmptyRow colSpan={5} message="기록된 보안 감사 로그가 존재하지 않습니다." />
                                        ) : auditLogs.map((log, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-5 text-sm font-black text-gray-900 flex items-center gap-2">
                                                    <User size={14} className="text-blue-600" />
                                                    {log.agentId}
                                                </td>
                                                <td className="px-6 py-5">
                                                    <ActionTag action={log.action} />
                                                </td>
                                                <td className="px-6 py-5 text-sm font-mono font-bold text-gray-500">{log.targetId}</td>
                                                <td className="px-6 py-5 text-sm font-bold text-gray-700">{log.details}</td>
                                                <td className="px-6 py-5 text-[11px] font-bold text-gray-400 font-mono flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {log.timestamp?.slice(0, 19).replace('T', ' ')}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

const EmptyRow = ({ colSpan, message }) => (
    <tr>
        <td colSpan={colSpan} className="px-6 py-32 text-center text-gray-300 font-bold">
            <div className="flex flex-col items-center gap-4">
                <FileText size={48} className="opacity-20" />
                {message}
            </div>
        </td>
    </tr>
);

const StatusTag = ({ status }) => {
    let style = "bg-gray-100 text-gray-600";
    if (status === '상담 완료') style = "bg-green-100 text-green-700";
    if (status === '부재' || status === '부재 중') style = "bg-amber-100 text-amber-700";
    if (status === '상담 거절') style = "bg-red-100 text-red-700";
    
    return (
        <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg border border-transparent uppercase tracking-tighter ${style}`}>
            {status}
        </span>
    );
};

const ActionTag = ({ action }) => {
    let style = "bg-gray-100 text-gray-700";
    if (action.includes('SAVE')) style = "bg-green-50 text-green-700 border-green-100";
    if (action.includes('VIEW')) style = "bg-blue-50 text-blue-700 border-blue-100";
    
    return (
        <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg border uppercase tracking-widest ${style}`}>
            {action}
        </span>
    );
};

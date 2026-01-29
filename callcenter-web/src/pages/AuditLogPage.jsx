import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import Logo from '../components/Logo';
import { 
    FileText, Search, Filter, ShieldCheck, 
    ChevronLeft, Download, AlertCircle, CheckCircle2,
    Calendar, User, Smartphone, Clock
} from 'lucide-react';

export default function AuditLogPage() {
    const navigate = useNavigate();
    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                // Fetch real audit logs directly from Trustee Backend (S2S Endpoint)
                // In production, this should be proxied via callcenter-backend
                const response = await fetch('http://localhost:8080/api/v1/s2s/audit/logs');
                const data = await response.json();
                
                // Map backend fields to UI model
                // Backend AccessLog: { id, userId, accessorType, accessorId, action, details, ipAddress, accessedAt }
                const mappedLogs = Array.isArray(data) ? data.map(log => ({
                    id: `AUDIT-${log.id}`,
                    timestamp: log.accessedAt,
                    type: log.accessorType, 
                    agentId: log.accessorId,
                    customerName: `UID:${log.userId}`, // We don't have name here, just ID
                    customerPhone: log.ipAddress, // Use IP for "Location/Phone" column or rename column
                    result: log.details,
                    recordingAgreed: log.details.includes('Agreed'),
                    action: log.action
                })) : [];
                
                setAuditLogs(mappedLogs);
            } catch (err) {
                console.error("Failed to fetch audit logs", err);
                // Demo fallback
                setAuditLogs([
                    { id: 'AUDIT-DEMO', timestamp: new Date().toISOString(), type: 'TM_AGENT', agentId: 'agent01', customerName: '김*수', customerPhone: '192.168.0.1', result: '데모 데이터: 백엔드 연결 실패', action: 'VIEW_360' }
                ]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchLogs();
    }, []);

    return (
        <div className="page-container bg-[#F4F7FA] min-h-screen flex flex-col font-sans">
            {/* Header */}
            <header className="bg-white border-b shadow-sm sticky top-0 z-30 h-16">
                <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
                    <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-all" onClick={() => navigate('/admin')}>
                        <Logo className="h-6" />
                        <div className="h-4 w-px bg-gray-200"></div>
                        <span className="text-sm font-bold text-gray-800">감사 로그 시스템</span>
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
                {/* Title Section */}
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">통화 감사 로그</h1>
                        <p className="text-gray-400 font-bold text-sm uppercase tracking-wider">
                            Comprehensive Audit Trail & Monitoring
                        </p>
                    </div>
                    <button className="h-12 px-6 bg-white border border-gray-200 rounded-2xl flex items-center gap-2 text-gray-600 font-bold hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm">
                        <Download size={18} />
                        Excel 내보내기
                    </button>
                </div>

                {/* Filter Section */}
                <div className="bg-white rounded-[32px] p-6 mb-8 border border-gray-100 shadow-sm flex gap-4 items-center">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="로그 ID, 상담원, 고객명 검색..." 
                            className="w-full pl-12 pr-4 h-12 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                    <div className="flex gap-2">
                        <FilterButton label="전체 기간" icon={<Calendar size={16} />} />
                        <FilterButton label="모든 유형" icon={<Filter size={16} />} />
                        <FilterButton label="전체 상담원" icon={<User size={16} />} />
                    </div>
                </div>

                {/* Log Table */}
                <div className="bg-white rounded-[40px] shadow-custom border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">로그 ID / 시간</th>
                                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">유형</th>
                                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">상담원</th>
                                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">고객 정보</th>
                                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest">녹취 동의</th>
                                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-widest text-right">상세</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                                                <span className="text-sm font-bold text-gray-400">감사 데이터 로딩 중...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    auditLogs.map((log, idx) => (
                                        <tr key={idx} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="text-xs font-black text-gray-900 font-mono mb-1">{log.id}</div>
                                                <div className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
                                                    <Clock size={12} />
                                                    {new Date(log.timestamp).toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                                                    log.type === 'INBOUND' 
                                                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                                        : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                                                }`}>
                                                    {log.type}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                                        <User size={12} />
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-700">{log.agentId}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="text-sm font-bold text-gray-900">{log.customerName}</div>
                                                <div className="text-xs font-medium text-gray-400 font-mono">{log.customerPhone}</div>
                                            </td>
                                            <td className="px-8 py-5">
                                                {log.recordingAgreed ? (
                                                    <div className="flex items-center gap-1.5 text-green-600">
                                                        <CheckCircle2 size={14} />
                                                        <span className="text-xs font-bold">동의 완료</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 text-amber-500">
                                                        <AlertCircle size={14} />
                                                        <span className="text-xs font-bold">동의 없음</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button className="text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors">
                                                    조회
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

function FilterButton({ label, icon }) {
    return (
        <button className="h-12 px-4 bg-gray-50 border border-gray-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors">
            {icon}
            {label}
        </button>
    );
}

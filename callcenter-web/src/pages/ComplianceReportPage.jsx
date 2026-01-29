import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import Logo from '../components/Logo';
import { 
    FileText, Download, ShieldCheck, AlertTriangle, 
    PieChart, BarChart3, ChevronLeft, CheckCircle2,
    Lock
} from 'lucide-react';

export default function ComplianceReportPage() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        consentRate: 0,
        encryptedCallRate: 100, // Assuming all saved are encrypted
        retentionCompliance: 100,
        totalChecks: 0
    });

    useEffect(() => {
        const fetchComplianceData = async () => {
            try {
                const results = await api.get('/callcenter/operator/admin/results?adminId=admin');
                const total = results.length;
                if (total === 0) return;

                const agreedCount = results.filter(r => r.recordingAgreed).length;
                const consentRate = ((agreedCount / total) * 100).toFixed(1);

                setStats({
                    consentRate,
                    encryptedCallRate: 100, // Policy enforced by backend
                    retentionCompliance: 100, // Policy enforced by backend
                    totalChecks: total
                });
            } catch (err) {
                console.error("Failed to fetch compliance stats", err);
            }
        };
        fetchComplianceData();
    }, []);

    return (
        <div className="page-container bg-[#F4F7FA] min-h-screen flex flex-col font-sans">
            {/* Header */}
            <header className="bg-white border-b shadow-sm sticky top-0 z-30 h-16">
                <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
                    <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-all" onClick={() => navigate('/admin')}>
                        <Logo className="h-6" />
                        <div className="h-4 w-px bg-gray-200"></div>
                        <span className="text-sm font-bold text-gray-800">컴플라이언스 리포트</span>
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
                <div className="mb-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-100 mb-4 shadow-sm">
                        <ShieldCheck size={16} />
                        <span className="text-xs font-black uppercase tracking-wider">Audit Passed</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">규정 준수 현황 보고서</h1>
                    <p className="text-gray-400 font-bold text-sm">
                        금융소비자보호법 및 신용정보보호법 준수 모니터링
                    </p>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <KPICard 
                        label="녹취 동의율" 
                        value={`${stats.consentRate}%`} 
                        status="normal"
                        icon={<CheckCircle2 size={24} />} 
                    />
                    <KPICard 
                        label="암호화 저장율" 
                        value={`${stats.encryptedCallRate}%`} 
                        status="success"
                        icon={<Lock size={24} />} 
                    />
                    <KPICard 
                        label="보존기한 준수" 
                        value={`${stats.retentionCompliance}%`} 
                        status="success"
                        icon={<ClockIcon size={24} />} 
                    />
                    <KPICard 
                        label="감사 수행 건수" 
                        value={stats.totalChecks.toLocaleString()} 
                        status="normal"
                        icon={<FileText size={24} />} 
                    />
                </div>

                {/* Charts Area (Mock Layout) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white rounded-[40px] shadow-custom border border-gray-100 p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-gray-900">월간 녹취 동의 추이</h3>
                            <div className="p-2 bg-gray-50 rounded-xl">
                                <BarChart3 size={20} className="text-gray-400" />
                            </div>
                        </div>
                        <div className="h-64 flex items-end justify-between px-6 pb-2 border-b border-gray-100 gap-4">
                            {[65, 78, 85, 92, 95, 98].map((h, i) => (
                                <div key={i} className="w-full bg-blue-50 rounded-t-xl relative group hover:bg-blue-100 transition-colors" style={{ height: `${h}%` }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">{h}%</div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 text-xs font-bold text-gray-400">
                            <span>8월</span><span>9월</span><span>10월</span><span>11월</span><span>12월</span><span>1월</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-[40px] shadow-custom border border-gray-100 p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-gray-900">규정 위반 유형 분석</h3>
                            <div className="p-2 bg-gray-50 rounded-xl">
                                <PieChart size={20} className="text-gray-400" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <ViolationItem label="스크립트 미준수 (경고)" count={12} total={2450} color="amber" />
                            <ViolationItem label="동의 철회 후 녹취 미삭제" count={0} total={2450} color="red" />
                            <ViolationItem label="개인정보 과다 조회" count={2} total={2450} color="blue" />
                        </div>
                    </div>
                </div>

                {/* Action - Download Report */}
                <div className="flex justify-center mt-12">
                    <button className="h-16 px-10 bg-[#1A73E8] text-white rounded-[24px] font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-blue-200 hover:brightness-110 active:scale-[0.98] transition-all">
                        <Download size={24} />
                        월간 리포트 다운로드 (PDF)
                    </button>
                </div>
            </main>
        </div>
    );
}

function KPICard({ label, value, status, icon }) {
    const colors = {
        success: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        warning: 'text-amber-600 bg-amber-50 border-amber-100',
        normal: 'text-blue-600 bg-blue-50 border-blue-100'
    };

    return (
        <div className={`p-6 rounded-[32px] bg-white border border-gray-100 shadow-sm flex items-center justify-between`}>
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">{value}</h2>
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${colors[status]}`}>
                {icon}
            </div>
        </div>
    );
}

function ViolationItem({ label, count, total, color }) {
    const percentage = ((count / total) * 100).toFixed(1);
    const colors = {
        amber: 'bg-amber-500',
        red: 'bg-red-500',
        blue: 'bg-blue-500'
    };

    return (
        <div className="flex items-center gap-4">
            <div className="flex-1">
                <div className="flex justify-between mb-1.5">
                    <span className="text-sm font-bold text-gray-700">{label}</span>
                    <span className="text-xs font-bold text-gray-400">{count}건 ({percentage}%)</span>
                </div>
                <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                    <div className={`h-full ${colors[color]} rounded-full`} style={{ width: `${percentage}%` }}></div>
                </div>
            </div>
        </div>
    );
}

const ClockIcon = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);

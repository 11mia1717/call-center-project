import React, { useState } from 'react';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { Mic, MessageSquare, User, AlertCircle, Search, LogOut, ChevronRight, ShieldCheck } from 'lucide-react';

export default function SearchPage() {
    const [phone, setPhone] = useState('010-0000-0000'); // 테스트 고객 기본값 (포맷 포함)
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // 전화번호 자동 하이픈 및 필터링 로직
    const handlePhoneChange = (e) => {
        const input = e.target.value.replace(/[^0-9]/g, ''); // 숫자만 남기기
        let formatted = input;

        if (input.length > 3 && input.length <= 7) {
            formatted = `${input.slice(0, 3)}-${input.slice(3)}`;
        } else if (input.length > 7) {
            formatted = `${input.slice(0, 3)}-${input.slice(3, 7)}-${input.slice(7, 11)}`;
        }
        
        setPhone(formatted);
    };

    const handleSearch = async () => {
        const rawPhone = phone.replace(/-/g, ''); // API 전송 시 하이픈 제거
        
        if (rawPhone.length < 10) {
            alert('올바른 전화번호를 입력해 주세요. (예: 010-0000-0000)');
            return;
        }

        setLoading(true);
        try {
            // [DEBUG] API 엔드포인트 및 페이로드 확인
            const res = await api.post('/callcenter/customer/candidates', { phone: rawPhone });
            
            if (res.candidateCount > 0) {
                const customer = res.candidates[0];
                navigate('/auth', { state: { customer } });
            } else {
                alert('해당 번호로 가입된 고객을 찾을 수 없습니다.\n입력하신 번호: ' + phone);
            }
        } catch (e) {
            console.error('Search Error:', e);
            alert('조회 중 오류가 발생했습니다. 시스템 관리자에게 문의하세요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container bg-gray-50 min-h-screen pb-20 font-sans">
            {/* Header */}
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
                {/* Script Section */}
                <section className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-blue-200">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md">
                            <MessageSquare size={16} />
                            <span className="text-xs font-bold uppercase tracking-widest">Opening Script</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">안녕하십니까, Continue Bank 고객센터입니다.</h2>
                        <p className="text-white text-sm leading-relaxed max-w-lg font-medium opacity-95">
                            "무엇을 도와드릴까요? 본 상담은 개인정보보호법 및 금융소비자보호법에 따라 모든 통화 내용이 녹음되며, 조회 이력이 안전하게 보관됩니다."
                        </p>
                    </div>
                    <Search size={140} className="absolute -bottom-8 -right-8 text-white/10 rotate-12" />
                </section>

                <div className="bg-white rounded-32px p-10 border border-gray-100 shadow-custom">
                    <div className="mb-8">
                        <h3 className="text-xl font-black text-gray-900 mb-2">고객 정보 조회</h3>
                        <p className="text-sm font-bold text-gray-400">수신된 전화번호(ANI) 또는 요청하신 번호를 입력하세요.</p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Customer Phone Number</label>
                            <input
                                className="w-full px-6 py-5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-600 transition-all outline-none text-2xl font-black font-mono tracking-widest text-gray-900"
                                value={phone}
                                onChange={handlePhoneChange}
                                placeholder="010-0000-0000"
                                maxLength={13}
                            />
                        </div>

                        <button 
                            className="w-full h-16 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-lg shadow-blue-100 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                            onClick={handleSearch} 
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <User size={20} />
                                    <span>회원 정보 통합 조회</span>
                                    <ChevronRight size={20} />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Compliance Info Section */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 text-gray-900 mb-2">
                        <ShieldCheck size={20} className="text-blue-600" />
                        <h4 className="text-sm font-black uppercase tracking-widest">Compliance & Legal Notice</h4>
                    </div>
                    <ul className="space-y-3">
                        <li className="flex gap-3 text-xs text-gray-500 leading-relaxed">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>
                            <p><strong>개인정보보호법 제15조</strong>에 의거, 상담 목적 외의 고객 정보 열람 및 오남용은 엄격히 금지되며 모든 접근 이력은 실시간으로 모니터링됩니다.</p>
                        </li>
                        <li className="flex gap-3 text-xs text-gray-500 leading-relaxed">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>
                            <p><strong>금융소비자보호법</strong> 등 관련 법령에 따라 모든 상담 내용은 서비스 품질 향상 및 분쟁 조절을 위해 최소 3년간 안전하게 보존됩니다.</p>
                        </li>
                        <li className="flex gap-3 text-xs text-gray-500 leading-relaxed">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>
                            <p>조회된 정보가 실제 고객 정보와 상이할 경우, 즉시 <strong>ARS 본인 재인증</strong> 절차를 거쳐야 하며 부정 사용 적발 시 관련 법에 따라 처벌받을 수 있습니다.</p>
                        </li>
                    </ul>
                </div>

                <div className="bg-gray-100/50 rounded-2xl p-6 border border-gray-100 text-[10px] text-gray-400 font-bold leading-relaxed flex gap-3 italic">
                    <AlertCircle size={16} className="shrink-0" />
                    <p>
                        본 화면은 오퍼레이터 전용 보안 구역입니다. 화면 캡처 및 외부 매체로의 정보 유출은 보안 정책 위반에 해당합니다.
                    </p>
                </div>
            </main>
        </div>
    );
}

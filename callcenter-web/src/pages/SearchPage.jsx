import React, { useState } from 'react';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { Mic, MessageSquare, User, AlertCircle, Search, LogOut, ChevronRight, ShieldCheck } from 'lucide-react';

export default function SearchPage() {
    const [phone, setPhone] = useState(''); // 초기값 제거
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
            const msg = encodeURIComponent('올바른 전화번호를 입력해 주세요. (예: 010-0000-0000)');
            navigate(`/bridge?type=warning&title=번호 입력 오류&message=${msg}&next=/search`);
            return;
        }

        setLoading(true);
        try {
            // Updated Endpoint matching CallCenterProxyController
            const res = await api.post('/callcenter/customer/candidates', { phone: rawPhone });
            
            if (res.isExist) {
                // Backend returns { isExist: true, memberId, maskedName, ... }
                // We pass this entire object or specific fields to AuthPage
                const customer = {
                    maskedName: res.maskedName,
                    maskedPhone: phone, // Pass formatted phone as maskedPhone for display
                    customerRef: res.memberId // Map memberId to customerRef
                };
                navigate('/auth', { state: { customer } });
            } else {
                const msg = encodeURIComponent(`해당 번호로 가입된 고객을 찾을 수 없습니다.\n입력하신 번호: ${phone}`);
                navigate(`/bridge?type=info&title=조회 결과 없음&message=${msg}&next=/search`);
            }
        } catch (e) {
            console.error('Search Error:', e);
            const msg = encodeURIComponent('조회 중 오류가 발생했습니다. 시스템 관리자에게 문의하세요.');
            navigate(`/bridge?type=error&title=시스템 오류&message=${msg}&next=/search`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container bg-white min-h-screen font-sans">
            {/* Header */}
            <header className="page-header bg-white py-4 px-6 flex justify-center items-center relative">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#1A73E8] rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(26,115,232,0.3)]">
                        <Infinity className="text-white" size={24} />
                    </div>
                    <span className="text-[20px] font-black tracking-tight text-[#1A1A1A]">
                        Continue Card <span className="text-[#1A73E8]">콜센터</span>
                    </span>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-10 pt-4 animate-fade-in">
                <div className="mb-10">
                    <h1 className="text-[28px] font-black text-gray-900 mb-2 tracking-tight">고객 조회</h1>
                    <p className="text-gray-500 font-bold text-[15px]">수신 전화번호(ANI)를 입력하여 가입 고객 정보를 확인하세요.</p>
                </div>

                <div className="bg-white rounded-[32px] p-10 pt-8 border border-gray-100 shadow-[0_15px_60px_-15px_rgba(0,0,0,0.05)] mb-10">
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-400 pl-1">휴대폰 번호</label>
                            <input
                                className="w-full px-6 py-4 bg-white border-2 border-blue-100 rounded-2xl focus:border-blue-600 transition-all outline-none text-xl font-bold font-mono tracking-wider text-gray-800"
                                value={phone}
                                onChange={handlePhoneChange}
                                placeholder="01012345678"
                                maxLength={13}
                            />
                        </div>

                        <button 
                            className="w-full h-18 text-white rounded-[24px] font-black text-xl hover:brightness-110 transition-all flex items-center justify-center"
                            style={{ backgroundColor: '#1A73E8', boxShadow: '0 8px 25px rgba(26,115,232,0.25)' }}
                            onClick={handleSearch} 
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <span>고객 찾기</span>
                            )}
                        </button>
                    </div>
                </div>

                <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100/80 text-sm text-gray-400 font-bold leading-relaxed">
                    ※ 조회된 고객이 없을 경우, 번호를 다시 확인하거나 신규 가입 안내를 진행하세요.
                </div>
            </main>
        </div>
    );
}

import { Infinity } from 'lucide-react';

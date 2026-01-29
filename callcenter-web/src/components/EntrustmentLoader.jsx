import React from 'react';
import Logo from './Logo';
import { ShieldCheck, Lock } from 'lucide-react';

const EntrustmentLoader = ({ message = "위수탁사로부터 회원정보를 조회 중입니다..." }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm animate-fade-in">
            <div className="flex flex-col items-center max-w-md p-8 bg-white rounded-[32px] shadow-2xl border border-blue-50 relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 animate-loading-bar"></div>
                
                {/* Logo & Spinner */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20"></div>
                    <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border border-blue-50">
                        <Logo className="h-8" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center border-2 border-white shadow-md">
                        <ShieldCheck size={16} />
                    </div>
                </div>

                {/* Main Message */}
                <h3 className="text-xl font-black text-gray-900 mb-2 text-center tracking-tight">
                    {message}
                </h3>
                <p className="text-sm font-bold text-gray-400 mb-8 text-center">
                    잠시만 기다려 주세요
                </p>

                {/* Compliance Notice */}
                <div className="w-full bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-start gap-3">
                    <Lock size={16} className="text-gray-400 shrink-0 mt-0.5" />
                    <div className="text-[11px] text-gray-500 font-medium leading-relaxed">
                        <strong className="block text-gray-700 mb-1">금융소비자보호법 준수</strong>
                        본 조회는 적법한 위수탁 계약에 의거하여 수행되며, 모든 조회 이력은 감사 로그에 암호화되어 기록됩니다.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EntrustmentLoader;

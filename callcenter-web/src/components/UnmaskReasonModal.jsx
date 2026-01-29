import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Eye, X } from 'lucide-react';

const UnmaskReasonModal = ({ isOpen, onClose, onConfirm, fieldName }) => {
    const [reason, setReason] = useState('');
    const [customReason, setCustomReason] = useState('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        const finalReason = reason === 'OTHER' ? customReason : reason;
        if (!finalReason) return;
        
        onConfirm(finalReason);
        onClose();
        setReason('');
        setCustomReason('');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100">
                {/* Header */}
                <div className="bg-red-50 p-6 flex flex-col items-center text-center border-b border-red-100">
                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-3">
                        <ShieldAlert size={28} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">민감정보 열람 사유</h3>
                    <p className="text-xs font-bold text-red-500 mt-1">
                        '{fieldName}' 정보를 조회합니다.
                    </p>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-start gap-3">
                            <AlertTriangle size={16} className="text-amber-500 mt-0.5" />
                            <div className="text-[11px] font-bold text-gray-500 leading-relaxed">
                                개인정보보호법에 의거하여 고객의 민감정보 열람 시 <span className="text-gray-900 underline decoration-amber-400 decoration-2">접속 기록이 로그로 저장</span>되며, 오남용 시 법적 책임을 질 수 있습니다.
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">열람 사유 선택 (필수)</label>
                        <div className="space-y-2">
                            {[
                                { id: 'VERIFICATION', label: '본인 확인 및 인증' },
                                { id: 'TRANSACTION', label: '금융 거래 및 결제 처리' },
                                { id: 'DISPUTE', label: '민원 및 분쟁 해결' },
                                { id: 'OTHER', label: '기타 (직접 입력)' }
                            ].map((option) => (
                                <label 
                                    key={option.id}
                                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                                        reason === option.id 
                                        ? 'border-red-500 bg-red-50/50' 
                                        : 'border-transparent bg-white hover:bg-gray-50'
                                    }`}
                                >
                                    <input 
                                        type="radio" 
                                        name="unmaskReason"
                                        className="w-4 h-4 text-red-500 focus:ring-red-500"
                                        checked={reason === option.id}
                                        onChange={() => setReason(option.id)}
                                    />
                                    <span className={`text-sm font-bold ${reason === option.id ? 'text-red-700' : 'text-gray-700'}`}>
                                        {option.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {reason === 'OTHER' && (
                        <input 
                            type="text" 
                            className="w-full p-3 bg-gray-50 border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-red-500 outline-none"
                            placeholder="열람 사유를 구체적으로 입력하세요"
                            value={customReason}
                            onChange={(e) => setCustomReason(e.target.value)}
                            autoFocus
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 flex gap-3">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-black text-sm transition-colors"
                    >
                        취소
                    </button>
                    <button 
                        onClick={handleConfirm}
                        disabled={!reason || (reason === 'OTHER' && !customReason.trim())}
                        className="flex-[2] py-3 px-4 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-black text-sm transition-colors flex items-center justify-center gap-2"
                    >
                        <Eye size={16} />
                        확인 및 열람 (로그 저장)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UnmaskReasonModal;

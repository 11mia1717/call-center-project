import React, { useState } from 'react';
import { FileText, Check, X } from 'lucide-react';

const LegalScriptModal = ({ isOpen, onClose, onConfirm, scriptType }) => {
    const [isChecked, setIsChecked] = useState(false);

    if (!isOpen) return null;

    const scripts = {
        'CARD_ISSUE': {
            title: '신용카드 발급 필수 고지',
            content: `[금융소비자보호법 제19조(설명의무)에 따른 고지]
            
1. 본 카드의 연회비는 해외겸용 15,000원, 국내전용 10,000원입니다.
2. 카드 이용 시 제공되는 포인트 적립 혜택과 전월 실적 제외 항목에 대해 설명 들으셨습니까?
3. 카드론, 현금서비스 이용 시 이자율과 상환 방식에 대해 이해하셨습니까?
4. 개인신용평점 하락 가능성에 대해 인지하셨습니까?

※ 위 내용을 고객님께 빠짐없이 설명하였으며, 고객님께서 이를 충분히 이해하였음을 확인합니다.`
        }
    };

    const currentScript = scripts[scriptType] || scripts['CARD_ISSUE'];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-slate-900 p-6 flex items-center gap-4 text-white">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black tracking-tight">{currentScript.title}</h3>
                        <p className="text-xs font-bold text-slate-400">고객에게 반드시 낭독해야 합니다.</p>
                    </div>
                </div>
                
                <div className="p-8">
                    <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200 mb-6">
                        <pre className="whitespace-pre-wrap font-mono text-sm font-bold text-gray-700 leading-relaxed">
                            {currentScript.content}
                        </pre>
                    </div>
                    
                    <label className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isChecked ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'}`}>
                            {isChecked && <Check size={14} className="text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} />
                        <span className="text-sm font-black text-gray-800">
                            위 내용을 모두 설명하였으며, 고객의 이해를 확인했습니다.
                        </span>
                    </label>

                    <button 
                        onClick={() => {
                            if (isChecked) {
                                onConfirm();
                                onClose();
                            }
                        }}
                        disabled={!isChecked}
                        className="w-full mt-6 h-14 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-black disabled:bg-gray-200 disabled:text-gray-400 transition-all flex items-center justify-center gap-2"
                    >
                        확인 및 진행
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LegalScriptModal;

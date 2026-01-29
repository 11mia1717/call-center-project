import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Info, Timer, ArrowRight, ShieldCheck } from 'lucide-react';

const StatusBridge = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const type = searchParams.get('type') || 'info'; // success, error, warning, info
    const title = searchParams.get('title') || '처리 중';
    const message = decodeURIComponent(searchParams.get('message') || '');
    const next = searchParams.get('next') || '/dashboard';
    const delay = parseInt(searchParams.get('delay') || '3000');

    const [timeLeft, setTimeLeft] = useState(delay / 1000);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        const redirect = setTimeout(() => {
            navigate(next);
        }, delay);

        return () => {
            clearInterval(timer);
            clearTimeout(redirect);
        };
    }, [navigate, next, delay]);

    const config = {
        success: {
            icon: CheckCircle2,
            color: '#10B981',
            bg: '#ECFDF5',
            shadow: 'rgba(16, 185, 129, 0.2)'
        },
        error: {
            icon: AlertCircle,
            color: '#EF4444',
            bg: '#FEF2F2',
            shadow: 'rgba(239, 68, 68, 0.2)'
        },
        warning: {
            icon: AlertCircle,
            color: '#F59E0B',
            bg: '#FFFBEB',
            shadow: 'rgba(245, 158, 11, 0.2)'
        },
        info: {
            icon: Info,
            color: '#1A73E8',
            bg: '#EFF6FF',
            shadow: 'rgba(26, 115, 232, 0.2)'
        }
    };

    const current = config[type] || config.info;
    const Icon = current.icon;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F9FAFB] font-sans">
            <div className="w-full max-w-md animate-fade-in">
                <div className="bg-white rounded-[48px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-white p-12 flex flex-col items-center text-center relative overflow-hidden">
                    
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none" 
                         style={{ background: `radial-gradient(circle, ${current.color} 0%, transparent 70%)`, transform: 'translate(30%, -30%)' }}></div>

                    {/* Icon Section */}
                    <div className="relative mb-10">
                        <div className="w-24 h-24 rounded-[32px] flex items-center justify-center animate-bounce-subtle" 
                             style={{ backgroundColor: current.bg, color: current.color, boxShadow: `0 20px 40px ${current.shadow}` }}>
                            <Icon size={48} strokeWidth={2.5} />
                        </div>
                    </div>

                    {/* Text Section */}
                    <div className="space-y-4 mb-12 relative z-10">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tighter leading-tight">
                            {title}
                        </h1>
                        <p className="text-gray-500 font-bold leading-relaxed whitespace-pre-wrap">
                            {message}
                        </p>
                    </div>

                    {/* Action Section */}
                    <div className="w-full space-y-4 relative z-10">
                        <button 
                            onClick={() => navigate(next)}
                            className="w-full h-16 bg-gray-900 text-white rounded-3xl font-black text-lg flex items-center justify-center gap-3 hover:bg-black transition-all active:scale-[0.98] shadow-xl"
                        >
                            확인
                            <ArrowRight size={20} />
                        </button>
                        
                        <div className="flex items-center justify-center gap-2 text-gray-400 font-bold text-[11px] uppercase tracking-widest">
                            <Timer size={14} />
                            <span>{timeLeft}초 후 자동으로 이동합니다</span>
                        </div>
                    </div>

                    {/* Footer Brandt */}
                    <div className="mt-12 pt-8 border-t border-gray-50 flex items-center gap-2">
                        <ShieldCheck size={14} className="text-blue-500" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Secured by Continue Bank</span>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-subtle {
                    animation: bounce-subtle 3s ease-in-out infinite;
                }
                .animate-fade-in {
                    animation: fade-in 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            ` }} />
        </div>
    );
};

export default StatusBridge;

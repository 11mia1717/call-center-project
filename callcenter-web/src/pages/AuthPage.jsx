import React, { useState } from 'react';
import { api } from '../api/client';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

export default function AuthPage() {
    const { state } = useLocation();
    const customer = state?.customer; // { customerRef, maskedName, maskedPhone }
    const navigate = useNavigate();

    const [step, setStep] = useState('REQUEST'); // REQUEST, VERIFY
    const [authTxId, setAuthTxId] = useState(null);
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    // For verifying name/birth (Using search data or empty for fresh input)
    const [name, setName] = useState('');
    const [birth, setBirth] = useState('');

    const handleRequest = async () => {
        setLoading(true);
        try {
            const res = await api.post('/callcenter/auth/request', {
                name,
                birth,
                customerRef: customer.customerRef,
            });
            setAuthTxId(res.authTxId);
            setStep('VERIFY');
            // [DEV ONLY] Show OTP for easier testing
            alert(`인증번호가 발송되었습니다!\n\n[개발용] 인증번호: ${res.devOtp || '확인불가'}\n(인증 트랜잭션 ID: ${res.authTxId})`);
        } catch (e) {
            alert('인증번호 요청에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        setLoading(true);
        try {
            const res = await api.post('/callcenter/auth/verify', {
                authTxId,
                otp
            });

            if (res.result === 'SUCCESS') {
                navigate('/loss', { state: { customerRef: res.customerRef } });
            } else {
                alert('인증 실패: ' + res.message);
            }
        } catch (e) {
            alert('인증 처리 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    if (!customer) return <div className="padding">고객 정보가 선택되지 않았습니다.</div>;

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-3xl mx-auto px-6">
            <div style={{ marginBottom: 48 }}>
                <Logo style={{ marginBottom: '24px' }} />
                <h1>본인 인증</h1>
                <p style={{ color: 'var(--text-dim)', fontWeight: 500 }}>고객의 안전한 업무 대행을 위해 본인 확인 절차를 진행합니다.</p>
            </div>

            <div className="card">
                <div className="card-row">
                    <span className="card-label">성명</span>
                    <strong className="card-value">{customer.maskedName}</strong>
                </div>
                <div className="card-row">
                    <span className="card-label">연락처</span>
                    <strong className="card-value">{customer.maskedPhone}</strong>
                </div>
            </div>

            {step === 'REQUEST' && (
                <div className="card">
                    <div className="input-group">
                        <label className="label">성명 확인</label>
                        <input className="input" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label className="label">생년월일 (6자리)</label>
                        <input className="input" value={birth} onChange={e => setBirth(e.target.value)} placeholder="YYMMDD" />
                    </div>
                    <button className="btn" onClick={handleRequest} disabled={loading}>
                        {loading ? '발송 중...' : '인증번호 발송'}
                    </button>
                </div>
            )}

            {step === 'VERIFY' && (
                <div className="card animate-fade">
                    <div className="input-group">
                        <label className="label">인증번호 입력</label>
                        <input className="input" value={otp} onChange={e => setOtp(e.target.value)} placeholder="000000" />
                    </div>
                    <button className="btn" onClick={handleVerify} disabled={loading}>
                        {loading ? '확인 중...' : '인증 완료'}
                    </button>
                    <div style={{ marginTop: 16, textAlign: 'center' }}>
                        <button style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }} onClick={() => setStep('REQUEST')}>
                            인증번호 다시 받기
                        </button>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}

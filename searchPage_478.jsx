import React, { useState } from 'react';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

export default function SearchPage() {
    const [phone, setPhone] = useState('01012345678'); // Default format from seed
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSearch = async () => {
        setLoading(true);
        try {
            const res = await api.post('/callcenter/customer/candidates', { phone });
            if (res.candidateCount > 0) {
                const customer = res.candidates[0];
                // Pass candidate info only
                navigate('/auth', { state: { customer } });
            } else {
                alert('해당 번호로 가입된 고객을 찾을 수 없습니다.');
            }
        } catch (e) {
            alert('조회 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-3xl mx-auto px-6">
            <div style={{ marginBottom: 48 }}>
                <Logo style={{ marginBottom: '24px' }} />
                <h1>고객 조회</h1>
                <p style={{ color: 'var(--text-dim)', fontSize: '15px', fontWeight: 500 }}>수신 전화번호(ANI)를 입력하여 가입 고객 정보를 확인하세요.</p>
            </div>

            <div className="card">
                <div className="input-group">
                    <label className="label">휴대폰 번호</label>
                    <input
                        className="input"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="01012345678"
                    />
                </div>

                <button className="btn" onClick={handleSearch} disabled={loading}>
                    {loading ? '조회 중...' : '고객 찾기'}
                </button>
            </div>

            <div className="card" style={{ marginTop: 32, backgroundColor: 'var(--bg-dim)' }}>
                <p style={{ fontSize: '14px', color: 'var(--text-dim)', lineHeight: 1.6 }}>
                    ※ 조회된 고객이 없을 경우, 번호를 다시 확인하거나 신규 가입 안내를 진행하세요.
                </p>
            </div>
            </div>
        </div>
    );
}

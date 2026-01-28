import React, { useState } from 'react';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';

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
        <div className="padding animate-fade">
            <div style={{ marginBottom: 40 }}>
                <h1>고객 조회</h1>
                <p style={{ color: 'var(--text-dim)', fontSize: '15px' }}>수신 전화번호(ANI)를 입력하여 가입 고객 정보를 확인하세요.</p>
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

            <div className="info-box" style={{ marginTop: 24 }}>
                <strong>Tip</strong>
                <p style={{ marginTop: 8 }}>입력된 번호는 카드사 시스템과 연동되어 실시간으로 고객을 식별합니다.</p>
            </div>
        </div>
    );
}

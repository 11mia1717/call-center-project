import React, { useEffect, useState } from 'react';
import { api } from './api/client';

// Simple Dashboard for monitoring
export default function App() {
    const [activeTab, setActiveTab] = useState('AUDIT'); // AUDIT, CARDS

    return (
        <div className="app-container">
            <header className="header">
                <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #1A73E8 0%, #0D47A1 100%)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 14, height: 14, border: '3px solid #fff', borderRadius: '50%' }} />
                    </div>
                    Continue Card Admin
                </div>
                <div className="nav-buttons">
                    <button
                        className={`nav-btn ${activeTab === 'AUDIT' ? 'active' : ''}`}
                        onClick={() => setActiveTab('AUDIT')}
                    >
                        감사 로그
                    </button>
                    <button
                        className={`nav-btn ${activeTab === 'CARDS' ? 'active' : ''}`}
                        onClick={() => setActiveTab('CARDS')}
                    >
                        고객 카드 조회
                    </button>
                </div>
            </header>

            <main className="content">
                {activeTab === 'AUDIT' && <AuditView />}
                {activeTab === 'CARDS' && <CardView />}
            </main>
        </div>
    );
}

function AuditView() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        loadEvents();
        const interval = setInterval(loadEvents, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    const loadEvents = async () => {
        try {
            const data = await api.get('/issuer/audit/events');
            setEvents(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="view-card">
            <h1>실시간 감사 로그 (Audit Events)</h1>
            <table>
                <thead>
                    <tr>
                        <th>시간</th>
                        <th>유형</th>
                        <th>결과</th>
                        <th>사고 번호</th>
                        <th>상담원 ID</th>
                        <th>콜 ID</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map(ev => (
                        <tr key={ev.eventId}>
                            <td>{new Date(ev.createdAt).toLocaleString()}</td>
                            <td><span className="tag">{ev.eventType === 'CARD_LOSS' ? '카드 분실' : ev.eventType}</span></td>
                            <td><span className={`tag ${ev.resultCode}`}>{ev.resultCode === 'SUCCESS' ? '성공' : '실패'}</span></td>
                            <td>{ev.lossCaseId || '-'}</td>
                            <td>{ev.operatorId}</td>
                            <td>{ev.callId}</td>
                        </tr>
                    ))}
                    {events.length === 0 && (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>
                                기록된 로그가 없습니다.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

function CardView() {
    const [customerRef, setCustomerRef] = useState('11111111-1111-1111-1111-111111111111');
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);

    const search = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/issuer/customer/${customerRef}/cards`);
            setCards(res.cards);
        } catch (e) {
            alert('카드 정보를 불러오는 데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="view-card">
            <h1>고객 카드 상태 조회</h1>
            <div className="search-bar">
                <input
                    className="input"
                    value={customerRef}
                    onChange={e => setCustomerRef(e.target.value)}
                    placeholder="고객 참조 ID (UUID)"
                />
                <button className="btn-primary" onClick={search} disabled={loading}>
                    {loading ? '조회 중...' : '조회'}
                </button>
            </div>

            {cards.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>카드 ID</th>
                            <th>카드 번호</th>
                            <th>상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cards.map(c => (
                            <tr key={c.cardRef}>
                                <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>{c.cardRef}</td>
                                <td>{c.maskedCardNo}</td>
                                <td><span className={`tag ${c.status}`}>{c.status === 'ACTIVE' ? '활성' : c.status === 'LOST' ? '분실 정지' : c.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

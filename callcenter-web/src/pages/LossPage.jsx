import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

export default function LossPage() {
    const { state } = useLocation();
    const customerRef = state?.customerRef;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [complete, setComplete] = useState(false);
    const [result, setResult] = useState(null);
    const [cards, setCards] = useState([]);
    const [selectedCardRefs, setSelectedCardRefs] = useState([]);

    useEffect(() => {
        if (customerRef) {
            loadCards();
        }
    }, [customerRef]);

    const loadCards = async () => {
        try {
            const res = await api.get(`/callcenter/customer/${customerRef}/cards`);
            const fetchedCards = res.cards || [];
            setCards(fetchedCards);

            // Pre-select all active cards by default so the button is not disabled
            const activeRefs = fetchedCards
                .filter(c => c.status === 'ACTIVE')
                .map(c => c.cardRef);
            setSelectedCardRefs(activeRefs);
        } catch (e) {
            console.error('카드 목록 조회 실패', e);
        }
    };

    const toggleCardSelection = (cardRef) => {
        setSelectedCardRefs(prev =>
            prev.includes(cardRef)
                ? prev.filter(ref => ref !== cardRef)
                : [...prev, cardRef]
        );
    };

    const handleLoss = async () => {
        if (selectedCardRefs.length === 0) {
            alert('중지할 카드를 선택해 주세요.');
            return;
        }

        if (!confirm(`선택한 ${selectedCardRefs.length}개의 카드를 정말로 분실 신고 하시겠습니까?`)) return;

        setLoading(true);
        try {
            const res = await api.post('/callcenter/card/loss', {
                customerRef,
                lossType: 'LOSS',
                selectedCardRefs
            });
            setResult(res);
            setComplete(true);
        } catch (e) {
            alert('신고 접수 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleEndSession = async () => {
        await api.post('/callcenter/session/end', {});
        api.clearToken();
        navigate('/');
    };

    if (!customerRef) return <div className="padding">인증 정보가 없습니다. 다시 시도해 주세요.</div>;

    if (complete) {
        return (
            <div className="bg-gray-50 min-h-screen py-8">
                <div className="max-w-3xl mx-auto px-6">
                <div style={{ textAlign: 'center', margin: '48px 0' }}>
                    <div style={{ fontSize: 60, marginBottom: 24 }}>✨</div>
                    <h1 style={{ marginBottom: 12 }}>사고 신고 접수 완료</h1>
                    <p style={{ color: 'var(--text-dim)' }}>접수 번호: <strong>{result?.lossCaseId}</strong></p>
                </div>

                <div style={{ marginBottom: 16, fontSize: '15px', fontWeight: 700 }}>중단된 카드 목록</div>
                {result?.stoppedCards?.map(card => (
                    <div key={card.cardRef} className="card">
                        <div className="card-row">
                            <strong style={{ fontSize: '17px', letterSpacing: '1px' }}>{card.maskedCardNo}</strong>
                            <span className={`tag ${card.status}`}>{card.status === 'LOST' ? '분실 정지' : card.status}</span>
                        </div>
                    </div>
                ))}

                {(!result?.stoppedCards || result.stoppedCards.length === 0) && (
                    <p style={{ textAlign: 'center', color: 'var(--text-dim)', padding: '20px' }}>중단할 활성 카드가 없었습니다.</p>
                )}

                <div className="spacer" style={{ height: 32 }} />
                <button className="btn" onClick={handleEndSession} style={{ marginTop: 32 }}>
                    상담 종료
                </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="max-w-3xl mx-auto px-6">
            <div style={{ marginBottom: 48 }}>
                <Logo style={{ marginBottom: '24px' }} />
                <h1>카드 분실 신고</h1>
                <p style={{ color: 'var(--text-dim)', fontWeight: 500 }}>인증이 완료되었습니다. 아래 카드들을 정지 처리합니다.</p>
            </div>

            <div style={{ marginBottom: 24 }}>
                <div style={{ marginBottom: 12, fontSize: '15px', fontWeight: 700 }}>보유 카드 목록</div>
                {cards.map(card => (
                    <div
                        key={card.cardRef}
                        className={`card ${card.status === 'ACTIVE' ? 'selectable' : ''}`}
                        style={{
                            opacity: card.status === 'ACTIVE' ? 1 : 0.6,
                            cursor: card.status === 'ACTIVE' ? 'pointer' : 'default',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            border: selectedCardRefs.includes(card.cardRef) ? '1px solid var(--primary)' : '1px solid var(--border)',
                            background: selectedCardRefs.includes(card.cardRef) ? 'rgba(4, 118, 242, 0.04)' : 'transparent'
                        }}
                        onClick={() => card.status === 'ACTIVE' && toggleCardSelection(card.cardRef)}
                    >
                        {card.status === 'ACTIVE' && (
                            <input
                                type="checkbox"
                                checked={selectedCardRefs.includes(card.cardRef)}
                                onChange={() => { }} // Controlled by onClick on parent
                                style={{ pointerEvents: 'none' }}
                            />
                        )}
                        <div className="card-row" style={{ flex: 1 }}>
                            <strong style={{ fontSize: '16px' }}>{card.maskedCardNo}</strong>
                            <span className={`tag ${card.status}`}>{card.status === 'ACTIVE' ? '사용 가능' : card.status === 'LOST' ? '분실 정지' : card.status}</span>
                        </div>
                    </div>
                ))}
                {cards.length === 0 && <p style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '10px' }}>보유한 카드가 없습니다.</p>}
            </div>

            <div className="card" style={{ background: '#fff0f0', borderColor: '#ffcdd2', borderStyle: 'dashed' }}>
                <strong style={{ color: '#d32f2f', display: 'flex', alignItems: 'center', gap: 6 }}>
                    ⚠️ 주의 사항
                </strong>
                <p style={{ color: '#d32f2f', marginTop: 12, fontSize: '14px', lineHeight: 1.5 }}>
                    이 작업은 고객의 <strong>선택한 활성 카드</strong>를 즉시 정지시킵니다. 정지 후에는 해제가 불가능할 수 있으므로 신중히 진행해 주세요.
                </p>
            </div>

            <div className="spacer" style={{ height: 40 }} />

            <button
                className="btn"
                style={{ background: selectedCardRefs.length > 0 ? '#f04452' : '#cbd5e0' }}
                onClick={handleLoss}
                disabled={loading || selectedCardRefs.length === 0}
            >
                {loading ? '처리 중...' : `선택한 ${selectedCardRefs.length}개 카드 정지`}
            </button>

            <button className="btn" style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text-dim)', marginTop: 12 }} onClick={handleEndSession}>
                취소 후 종료
            </button>
            </div>
        </div>
    );
}

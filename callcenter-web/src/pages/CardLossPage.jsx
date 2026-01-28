import React, { useState } from 'react';
import api from '../api';
import { useSession } from '../context/SessionContext';
import { useNavigate } from 'react-router-dom';

const CardLossPage = () => {
    const { session, clearSession } = useSession();
    const navigate = useNavigate();

    const [lossType, setLossType] = useState('LOSS');
    const [result, setResult] = useState(null);

    const handleSubmit = async () => {
        try {
            const res = await api.post('/callcenter/card/loss', {
                customerRef: session.customer.customerRef, // We should use the one from verified session if stored, but here using candidates selection is risky if not verified. But we are on Loss Page, assumed verified.
                lossType,
                // Reporting ALL cards for simplicity as per requirement "Selected or All"
            });

            if (res.success) {
                setResult(res.data);
            }
        } catch (e) {
            alert('Report Failed');
        }
    };

    const handleEnd = async () => {
        await api.post('/callcenter/session/end');
        clearSession();
        navigate('/search');
    };

    if (result) {
        return (
            <div className="card">
                <h2>Report Success</h2>
                <div className="result-box">
                    <p><strong>Case ID:</strong> {result.lossCaseId}</p>
                    <p><strong>Time:</strong> {result.effectiveTime}</p>
                    <h3>Stopped Cards</h3>
                    <ul>
                        {result.stoppedCards.map(c => (
                            <li key={c.cardRef}>{c.maskedCardNo} ({c.status})</li>
                        ))}
                    </ul>
                </div>
                <button className="secondary-btn" onClick={handleEnd}>End Session</button>
            </div>
        );
    }

    return (
        <div className="card">
            <h2>Report Card Loss</h2>
            <p>Customer: {session.customer?.maskedName}</p>

            <label>Loss Type</label>
            <select value={lossType} onChange={e => setLossType(e.target.value)}>
                <option value="LOSS">Loss (Lost)</option>
                <option value="THEFT">Theft (Stolen)</option>
            </select>

            <div style={{ marginTop: '1rem' }}>
                <label>
                    <input type="checkbox" checked={true} disabled />
                    Stop All Active Cards
                </label>
            </div>

            <button onClick={handleSubmit} style={{ marginTop: '1rem', background: '#ef4444' }}>Report Loss</button>
        </div>
    );
};

export default CardLossPage;

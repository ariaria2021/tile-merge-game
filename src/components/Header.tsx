import React from 'react';

type Props = {
    score: number;
    onReset: () => void;
};

export const Header: React.FC<Props> = ({ score, onReset }) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
            width: '100%',
            maxWidth: '500px',
            margin: '0 auto 30px',
            padding: '0'
        }}>
            <h1 style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#1f2937',
                margin: 0,
                letterSpacing: '-0.025em'
            }}>2048</h1>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{
                    background: '#e5e7eb',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    color: '#374151',
                    textAlign: 'center',
                    minWidth: '80px'
                }}>
                    <div style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SCORE</div>
                    <div style={{ fontSize: '18px', fontWeight: '700' }}>{score}</div>
                </div>

                <button
                    onClick={onReset}
                    style={{
                        background: '#8b5cf6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '10px 20px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        boxShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.4)'
                    }}
                >
                    New Game
                </button>
            </div>
        </div>
    );
};

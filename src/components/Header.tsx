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
            marginBottom: '20px',
            width: '100%',
            maxWidth: '500px',
            margin: '0 auto 20px',
            padding: '0 10px'
        }}>
            <h1 style={{ fontSize: '40px', fontWeight: 'bold', color: '#776e65', margin: 0 }}>2048</h1>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{
                    background: '#bbada0',
                    padding: '10px 20px',
                    borderRadius: '3px',
                    color: 'white',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '13px', color: '#eee4da' }}>SCORE</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{score}</div>
                </div>

                <button
                    onClick={onReset}
                    style={{
                        background: '#8f7a66',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        padding: '10px 20px',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    New Game
                </button>
            </div>
        </div>
    );
};

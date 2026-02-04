import React from 'react';

type Props = {
    isGameOver: boolean;
    onRetry: () => void;
};

export const GameOverlay: React.FC<Props> = ({ isGameOver, onRetry }) => {
    if (!isGameOver) return null;

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(238, 228, 218, 0.73)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '6px',
            animation: 'fade-in 800ms ease'
        }}>
            <h2 style={{ fontSize: '60px', fontWeight: 'bold', color: '#776e65', margin: '0 0 30px' }}>
                Game Over!
            </h2>
            <button
                onClick={onRetry}
                style={{
                    background: '#8f7a66',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '15px 30px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                }}
            >
                Try Again
            </button>
        </div>
    );
};

import React, { useEffect, useState } from 'react';
import { Board } from './components/Board';
import { Header } from './components/Header';
import { GameOverlay } from './components/GameOverlay';
import { useGrid } from './hooks/useGrid';
import { isGameOver } from './utils/gridUtils';
import './App.css';

function App() {
  const { grid, move, resetGrid, scoreIncrease } = useGrid();
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [finished, setFinished] = useState(false);

  // ハイスコア読み込み
  useEffect(() => {
    const saved = localStorage.getItem('tile-merge-best-score');
    if (saved) setBestScore(parseInt(saved, 10));
  }, []);

  // スコア更新
  useEffect(() => {
    if (scoreIncrease > 0) {
      setScore(s => {
        const newScore = s + scoreIncrease;
        if (newScore > bestScore) {
          setBestScore(newScore);
          localStorage.setItem('tile-merge-best-score', newScore.toString());
        }
        return newScore;
      });
    }
  }, [scoreIncrease, bestScore]);

  // ゲームオーバー判定
  useEffect(() => {
    if (isGameOver(grid)) {
      setFinished(true);
    } else {
      setFinished(false);
    }
  }, [grid]);

  // リセット処理
  const handleReset = () => {
    resetGrid();
    setScore(0);
    setFinished(false);
  };

  // キーボード操作
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (finished) return;

      switch (e.key) {
        case 'ArrowUp':
          move('UP');
          e.preventDefault();
          break;
        case 'ArrowDown':
          move('DOWN');
          e.preventDefault();
          break;
        case 'ArrowLeft':
          move('LEFT');
          e.preventDefault();
          break;
        case 'ArrowRight':
          move('RIGHT');
          e.preventDefault();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move, finished]);

  // タッチ操作（簡易実装）
  // TODO: 本格的なスワイプ検知にはライブラリを使うと良いが、
  // ここではネイティブイベントで実装
  const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || finished) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchEndX - touchStart.x;
    const diffY = touchEndY - touchStart.y;
    const threshold = 30; // 最小スワイプ距離

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (Math.abs(diffX) > threshold) {
        move(diffX > 0 ? 'RIGHT' : 'LEFT');
      }
    } else {
      if (Math.abs(diffY) > threshold) {
        move(diffY > 0 ? 'DOWN' : 'UP');
      }
    }
    setTouchStart(null);
  };

  return (
    <div
      className="app-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Header score={score} onReset={handleReset} />

      <div style={{ position: 'relative', width: 'fit-content', margin: '0 auto' }}>
        <Board grid={grid} />
        <GameOverlay isGameOver={finished} onRetry={handleReset} />
      </div>

      <p style={{ textAlign: 'center', marginTop: '20px', color: '#776e65' }}>
        Use <strong>arrow keys</strong> or <strong>swipe</strong> to join the tiles!
      </p>
    </div>
  );
}

export default App;

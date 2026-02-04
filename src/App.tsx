import React, { useEffect, useState } from 'react';
import { Board } from './components/Board';
import { Header } from './components/Header';
import { GameOverlay } from './components/GameOverlay';
import { useGrid } from './hooks/useGrid';
import { isGameOver } from './utils/gridUtils';
import './App.css';

function App() {
  const { grid, move, resetGrid } = useGrid();
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [finished, setFinished] = useState(false);

  // ハイスコア読み込み
  useEffect(() => {
    const saved = localStorage.getItem('tile-merge-best-score');
    if (saved) setBestScore(parseInt(saved, 10));
  }, []);

  // ゲームオーバー判定
  useEffect(() => {
    if (isGameOver(grid)) {
      setFinished(true);
    } else {
      setFinished(false);
    }
  }, [grid]);

  // スコア更新処理（共通化）
  const updateScore = (addedScore: number) => {
    if (addedScore > 0) {
      setScore(s => {
        const newScore = s + addedScore;
        if (newScore > bestScore) {
          setBestScore(newScore);
          localStorage.setItem('tile-merge-best-score', newScore.toString());
        }
        return newScore;
      });
    }
  };

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

      let result = { moved: false, score: 0 };

      switch (e.key) {
        case 'ArrowUp':
          result = move('UP');
          e.preventDefault();
          break;
        case 'ArrowDown':
          result = move('DOWN');
          e.preventDefault();
          break;
        case 'ArrowLeft':
          result = move('LEFT');
          e.preventDefault();
          break;
        case 'ArrowRight':
          result = move('RIGHT');
          e.preventDefault();
          break;
        default:
          return;
      }

      if (result.moved) {
        updateScore(result.score);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move, finished, bestScore]); // updateScoreは依存に含めたいが、関数内でstate使うのでbestScoreへのアクセス注意。今回はsetterのcallback内で処理してるのでOK。

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
        const result = move(diffX > 0 ? 'RIGHT' : 'LEFT');
        if (result.moved) updateScore(result.score);
      }
    } else {
      if (Math.abs(diffY) > threshold) {
        const result = move(diffY > 0 ? 'DOWN' : 'UP');
        if (result.moved) updateScore(result.score);
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

import { useState, useCallback } from 'react';
import type { Grid, Direction } from '../types';
import { createEmptyGrid, addRandomTile } from '../utils/gridUtils';
import { rotateRight, rotateLeft, processRow } from '../utils/moveUtils';

export const useGrid = () => {
    const [grid, setGrid] = useState<Grid>(() => {
        let initialGrid = createEmptyGrid();
        initialGrid = addRandomTile(initialGrid);
        initialGrid = addRandomTile(initialGrid);
        return initialGrid;
    });
    const [scoreIncrease, setScoreIncrease] = useState<number>(0);

    const move = useCallback((direction: Direction) => {
        let moved = false;
        let totalScore = 0;

        setGrid((currentGrid) => {
            let processingGrid = [...currentGrid];

            // 方向に応じて回転させて「左移動」の問題に帰着させる
            if (direction === 'RIGHT') processingGrid = rotateRight(rotateRight(processingGrid));
            if (direction === 'UP') processingGrid = rotateLeft(processingGrid);
            if (direction === 'DOWN') processingGrid = rotateRight(processingGrid);

            // 各行を処理
            const newRows = processingGrid.map((row) => {
                const { newRow, score } = processRow(row);
                totalScore += score;
                return newRow;
            });

            // 元の向きに戻す
            let finalGrid = newRows;
            if (direction === 'RIGHT') finalGrid = rotateLeft(rotateLeft(finalGrid));
            if (direction === 'UP') finalGrid = rotateRight(finalGrid);
            if (direction === 'DOWN') finalGrid = rotateLeft(finalGrid);

            // 変更があったかチェック（JSON文字列化して比較）
            const isChanged = JSON.stringify(currentGrid.map(r => r.map(c => c?.value))) !==
                JSON.stringify(finalGrid.map(r => r.map(c => c?.value)));

            if (isChanged) {
                moved = true;
                setScoreIncrease(totalScore);
                // 新しいタイルを追加
                finalGrid = addRandomTile(finalGrid);

                // 正しいposition情報を注入し直す
                finalGrid = finalGrid.map((row, r) =>
                    row.map((cell, c) =>
                        cell ? { ...cell, position: [r, c] } : null
                    )
                );
                return finalGrid;
            }

            return currentGrid;
        });

        return { moved, score: totalScore };
    }, []);

    const resetGrid = useCallback(() => {
        let newGrid = createEmptyGrid();
        newGrid = addRandomTile(newGrid);
        newGrid = addRandomTile(newGrid);
        setGrid(newGrid);
        setScoreIncrease(0);
    }, []);

    return { grid, move, resetGrid, scoreIncrease };
};

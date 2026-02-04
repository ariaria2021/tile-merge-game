import type { Grid } from '../types';

export const GRID_SIZE = 4;

// 一意なID生成
export const generateId = (): string => {
    return Math.random().toString(36).substr(2, 9);
};

// 空のグリッド生成
export const createEmptyGrid = (): Grid => {
    return Array.from({ length: GRID_SIZE }, () =>
        Array.from({ length: GRID_SIZE }, () => null)
    );
};

// 空いているセルを取得
export const getEmptyCells = (grid: Grid): [number, number][] => {
    const emptyCells: [number, number][] = [];
    grid.forEach((row, r) => {
        row.forEach((cell, c) => {
            if (!cell) {
                emptyCells.push([r, c]);
            }
        });
    });
    return emptyCells;
};

// ランダムな位置に新しいタイルを追加
export const addRandomTile = (grid: Grid): Grid => {
    const emptyCells = getEmptyCells(grid);
    if (emptyCells.length === 0) return grid;

    const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newGrid = grid.map(row => [...row]);

    // 90%の確率で2, 10%の確率で4
    const value = Math.random() < 0.9 ? 2 : 4;

    newGrid[r][c] = {
        id: generateId(),
        value,
        position: [r, c],
        isNew: true,
    };

    return newGrid;
};

// グリッドが埋まっていて、かつマージできる場所がないかチェック
export const isGameOver = (grid: Grid): boolean => {
    // 空きがあるならゲームオーバーではない
    if (getEmptyCells(grid).length > 0) return false;

    // 横方向のマージ可能性チェック
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE - 1; c++) {
            if (grid[r][c]?.value === grid[r][c + 1]?.value) return false;
        }
    }

    // 縦方向のマージ可能性チェック
    for (let c = 0; c < GRID_SIZE; c++) {
        for (let r = 0; r < GRID_SIZE - 1; r++) {
            if (grid[r][c]?.value === grid[r + 1][c]?.value) return false;
        }
    }

    return true;
};

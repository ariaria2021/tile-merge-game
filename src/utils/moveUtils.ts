import type { Grid, Cell } from '../types';
import { GRID_SIZE } from './gridUtils';

// グリッドを右に90度回転
export const rotateRight = (grid: Grid): Grid => {
    const newGrid: Grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            newGrid[c][GRID_SIZE - 1 - r] = grid[r][c];
        }
    }
    return newGrid;
};

// グリッドを左に90度回転
export const rotateLeft = (grid: Grid): Grid => {
    const newGrid: Grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            newGrid[GRID_SIZE - 1 - c][r] = grid[r][c];
        }
    }
    return newGrid;
};

// 1行を左に詰めてマージする処理
export const processRow = (row: (Cell | null)[]): { newRow: (Cell | null)[], score: number } => {
    // 1. nullを取り除く
    let cells = row.filter((cell) => cell !== null) as Cell[];
    let score = 0;

    // 2. マージ処理
    const mergedCells: Cell[] = [];
    let skip = false;

    for (let i = 0; i < cells.length; i++) {
        if (skip) {
            skip = false;
            continue;
        }

        const current = cells[i];
        const next = cells[i + 1];

        if (next && current.value === next.value) {
            // マージ発生
            const doubledValue = current.value * 2;
            score += doubledValue;

            // 新しいセルを作成（IDは新しくするが、アニメーション用に旧セル情報を保持したい場合はここで工夫が必要）
            // 今回は簡易実装として、mergedFromなどは省略し、新しいセルとして扱う
            // 本格的なアニメーションにはID管理が重要だが、まずはロジック優先
            mergedCells.push({
                ...current,
                id: Math.random().toString(36).substr(2, 9), // 新しいID
                value: doubledValue,
                mergedFrom: [current, next], // マージ元情報を保存
                isNew: false, // マージされたセルは新規出現扱いではない
            });
            skip = true;
        } else {
            // マージなし
            // 状態リセット（isNewなどを消す）
            mergedCells.push({
                ...current,
                mergedFrom: undefined,
                isNew: false,
            });
        }
    }

    // 3. 長さを4に戻すためにnullで埋める
    const newRow = [...mergedCells, ...Array(4 - mergedCells.length).fill(null)];
    return { newRow, score };
};

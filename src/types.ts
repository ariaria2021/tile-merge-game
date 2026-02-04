export type Cell = {
    id: string;
    value: number;
    position: [number, number]; // [row, col]
    mergedFrom?: Cell[]; // アニメーション用
    isNew?: boolean; // 新規出現アニメーション用
};

export type Grid = (Cell | null)[][];

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

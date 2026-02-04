import React, { memo } from 'react';
import type { Cell } from '../types';
import styles from '../styles/Tile.module.css';

type Props = {
    cell: Cell;
};

export const Tile: React.FC<Props> = memo(({ cell }) => {
    const { value, position, isNew, mergedFrom } = cell;
    const [row, col] = position;

    // 位置計算 (パーセンテージベース)
    // const x = col * 100 + col * 15 / (100 + 15 * 3);
    // TODO: CSS側でGap込みの計算をするのが少し面倒なので、
    // シンプルにCSS Gridとは別に absolute で配置する。
    // 1セルあたり 100% + gap 分ずらすと考えたほうが楽。

    // NOTE: シンプルにするため、translate計算はCSSのcalcに任せるより、
    // 親コンテナに対するパーセント配置 + gap考慮をする。
    // width: calc(25% - gap * 3/4)
    // left: (width + gap) * col

    // スマホ(gap 10px)とPC(gap 15px)でずれるので、CSS変数を使うか、
    // ここではスタイルクラス制御ではなく、インラインスタイルで位置制御するのが確実。

    // ただし、レスポンシブ対応がJS側に入ると複雑になるので、
    // CSS Gridのセルの中にTileを入れるのではなく、
    // Boardの上に絶対配置するアプローチをとる。

    // 簡易的に calc() を使ってインラインスタイル生成
    // gap = 15px (PC), 10px (Mobile). CSS変数で制御するのがベスト。

    const positionStyle: React.CSSProperties = {
        // CSS変数 --tile-pos-x, --tile-pos-y をセットしてCSS側で calc する手法推奨
        transform: `translate(calc(${col} * (100% + var(--gap))), calc(${row} * (100% + var(--gap))))`,
    };

    const classes = [
        styles.tile,
        styles[`tile${value}`],
        isNew ? styles.newTile : '',
        mergedFrom ? styles.mergedTile : '',
    ].join(' ');

    return (
        <div className={classes} style={positionStyle}>
            {value}
        </div>
    );
});

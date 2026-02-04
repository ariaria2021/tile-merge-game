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

    // 位置計算ロジック
    // 全体幅 100% に対して、4つのタイルと3つのギャップがある。
    // タイル幅 w, ギャップ g とすると
    // 4w + 3g = 100%
    // w = (100% - 3g) / 4

    // 左位置 left = col * (w + g)
    // left = col * ( (100% - 3g)/4 + g )
    //      = col * ( 25% - 0.75g + g )
    //      = col * ( 25% + 0.25g )

    // これをCSS calcで表現する。
    // gapは var(--gap) で受け取る。

    const positionStyle: React.CSSProperties = {
        // 幅と高さもここで計算して指定する方が確実
        width: `calc((100% - 3 * var(--gap)) / 4)`,
        height: `calc((100% - 3 * var(--gap)) / 4)`,

        // 絶対位置配置
        left: `calc(${col} * (25% + var(--gap) / 4))`,
        top: `calc(${row} * (25% + var(--gap) / 4))`,

        // transformはアニメーション用として残すが、配置自体はtop/leftで行うアプローチの方が
        // transitionが素直に効く場合もある。
        // しかしTile.module.cssで transition: transform を指定しているので、
        // ここでは transform ではなく top/left で配置し、transitionプロパティも top, left に変えるのが一般的だが、
        // パフォーマンス的には transform が有利。

        // 今回は transform 方式を維持しつつ、計算式を修正する。
        // transform: translate(X, Y)
        // X = col * (tileWidth + gap)

        // 検証:
        // transform: translate( calc( col * (100% + var(--gap)) ) )  <-- これはTile自身の幅(100%)基準になるので間違い。
        // 親(Board)基準の % は transform では使えない（transformの%は自身基準）。

        // したがって、top/left で配置する方式に変更する。
        // transitionプロパティも .tile クラスで all または top, left に変更が必要。
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

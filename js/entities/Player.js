import { Entity } from './Entity.js';
import { GRID_CONFIG, GAMEPLAY_CONFIG, STYLE_CONFIG } from '../config.js';

/**
 * 玩家控制實體 (Player Snake)
 * 負責蛇身節點追蹤、轉向緩衝判定、移動成長與視覺渲染
 */
export class Player extends Entity {
    constructor() {
        super(0, 0, GRID_CONFIG.TILE_SIZE, GRID_CONFIG.TILE_SIZE);
        this.reset();
    }

    /**
     * 重置蛇身狀態為初始設定
     */
    reset() {
        this.segments = GAMEPLAY_CONFIG.INITIAL_SNAKE.map(seg => ({ ...seg }));
        this.currentDir = { ...GAMEPLAY_CONFIG.INITIAL_DIRECTION };
        this.nextDir = { ...GAMEPLAY_CONFIG.INITIAL_DIRECTION };
        this.x = this.segments[0].x;
        this.y = this.segments[0].y;
    }

    /**
     * 變更預計移動方向（加入防 180 度即死判定）
     * @param {{x: number, y: number}} dir
     */
    setDirection(dir) {
        if (dir.x !== 0 && this.currentDir.x === 0) {
            this.nextDir = { x: dir.x, y: 0 };
        } else if (dir.y !== 0 && this.currentDir.y === 0) {
            this.nextDir = { x: 0, y: dir.y };
        }
    }

    /**
     * 獲取下一格預計蛇頭座標
     */
    getNextHeadPosition() {
        this.currentDir = { ...this.nextDir };
        return {
            x: this.segments[0].x + this.currentDir.x,
            y: this.segments[0].y + this.currentDir.y
        };
    }

    /**
     * 移動蛇身節點
     * @param {{x: number, y: number}} newHead
     * @param {boolean} grow 是否成長（吃到食物時不移除尾巴）
     */
    move(newHead, grow = false) {
        this.segments.unshift(newHead);
        this.x = newHead.x;
        this.y = newHead.y;

        if (!grow) {
            this.segments.pop();
        }
    }

    /**
     * 獲取目前蛇頭座標
     */
    get head() {
        return this.segments[0];
    }

    /**
     * 獲取目前蛇身身體節點（不包含蛇頭）
     */
    get bodySegments() {
        return this.segments.slice(1);
    }

    /**
     * 繪製蛇頭、眼睛、動態吐舌與霓虹漸層蛇身
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        const tileSize = GRID_CONFIG.TILE_SIZE;
        const total = this.segments.length;

        // 1. 先反向繪製蛇身（從尾部到身體），確保蛇頭覆蓋在最上層
        for (let index = total - 1; index >= 1; index--) {
            const segment = this.segments[index];
            const px = segment.x * tileSize;
            const py = segment.y * tileSize;

            // 計算從青藍 -> 寶藍 -> 霓虹紫的漸層顏色
            const t = index / Math.max(1, total - 1);
            let color;
            if (t < 0.5) {
                color = this._interpolateColor(
                    STYLE_CONFIG.COLORS.SNAKE_BODY_START,
                    STYLE_CONFIG.COLORS.SNAKE_BODY_MID,
                    t * 2
                );
            } else {
                color = this._interpolateColor(
                    STYLE_CONFIG.COLORS.SNAKE_BODY_MID,
                    STYLE_CONFIG.COLORS.SNAKE_BODY_END,
                    (t - 0.5) * 2
                );
            }

            // 節點本體 (微縮放營造圓潤流線感)
            const margin = Math.min(2.5, 1 + index * 0.1);
            const size = tileSize - margin * 2;
            const radius = Math.max(4, 7 - index * 0.15);

            ctx.fillStyle = color;
            ctx.shadowBlur = 4;
            ctx.shadowColor = color;
            this._drawRoundRect(ctx, px + margin, py + margin, size, size, radius);
            ctx.shadowBlur = 0;

            // 蛇身節點上方高光（立體感）
            ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
            ctx.beginPath();
            ctx.arc(px + margin + size * 0.35, py + margin + size * 0.35, size * 0.18, 0, Math.PI * 2);
            ctx.fill();
        }

        // 2. 繪製蛇頭 (index === 0)
        const head = this.segments[0];
        const hx = head.x * tileSize;
        const hy = head.y * tileSize;

        // 動態蛇信 (吐舌動畫)
        this._drawTongue(ctx, hx, hy, this.currentDir);

        // 蛇頭本體與霓虹外光暈
        ctx.fillStyle = STYLE_CONFIG.COLORS.SNAKE_HEAD;
        ctx.shadowBlur = STYLE_CONFIG.GLOW.HEAD_BLUR;
        ctx.shadowColor = STYLE_CONFIG.COLORS.SNAKE_HEAD_GLOW;
        this._drawRoundRect(ctx, hx + 1, hy + 1, tileSize - 2, tileSize - 2, 6);
        ctx.shadowBlur = 0;

        // 蛇頭高光
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(hx + tileSize * 0.35, hy + tileSize * 0.35, 3, 0, Math.PI * 2);
        ctx.fill();

        // 靈動雙眼 (眼白 + 黑眼球 + 轉向注視)
        this._drawEyes(ctx, hx, hy, this.currentDir);
    }

    /**
     * 雙色 RGB 線性插值輔助
     * @private
     */
    _interpolateColor(color1, color2, factor) {
        const c1 = parseInt(color1.slice(1), 16);
        const c2 = parseInt(color2.slice(1), 16);
        const r1 = (c1 >> 16) & 255, g1 = (c1 >> 8) & 255, b1 = c1 & 255;
        const r2 = (c2 >> 16) & 255, g2 = (c2 >> 8) & 255, b2 = c2 & 255;
        const r = Math.round(r1 + factor * (r2 - r1));
        const g = Math.round(g1 + factor * (g2 - g1));
        const b = Math.round(b1 + factor * (b2 - b1));
        return `rgb(${r}, ${g}, ${b})`;
    }

    /**
     * 動態吐舌動畫 (蛇信)
     * @private
     */
    _drawTongue(ctx, x, y, dir) {
        // 週期性吐出舌頭 (呼吸頻率)
        const isFlicking = Math.sin(Date.now() / 140) > 0.3;
        if (!isFlicking) return;

        const ts = GRID_CONFIG.TILE_SIZE;
        const tongueLen = 6;
        let startX = x + ts / 2;
        let startY = y + ts / 2;
        let endX = startX + dir.x * (ts / 2 + tongueLen);
        let endY = startY + dir.y * (ts / 2 + tongueLen);

        ctx.strokeStyle = STYLE_CONFIG.COLORS.SNAKE_TONGUE;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';

        // 舌幹
        ctx.beginPath();
        ctx.moveTo(startX + dir.x * (ts / 2), startY + dir.y * (ts / 2));
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // 舌尖分叉 (小 V 字)
        ctx.beginPath();
        if (dir.x !== 0) {
            ctx.moveTo(endX, endY);
            ctx.lineTo(endX + dir.x * 2, endY - 2);
            ctx.moveTo(endX, endY);
            ctx.lineTo(endX + dir.x * 2, endY + 2);
        } else {
            ctx.moveTo(endX, endY);
            ctx.lineTo(endX - 2, endY + dir.y * 2);
            ctx.moveTo(endX, endY);
            ctx.lineTo(endX + 2, endY + dir.y * 2);
        }
        ctx.stroke();
    }

    /**
     * 圓角矩形繪製輔助
     * @private
     */
    _drawRoundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, r);
        ctx.fill();
    }

    /**
     * 靈動雙眼繪製 (具有眼白、瞳孔與高光注視)
     * @private
     */
    _drawEyes(ctx, x, y, dir) {
        let e1x, e1y, e2x, e2y;
        const ts = GRID_CONFIG.TILE_SIZE;

        if (dir.x === 1) { // 向右
            e1x = x + ts - 6; e1y = y + 5;
            e2x = x + ts - 6; e2y = y + ts - 5;
        } else if (dir.x === -1) { // 向左
            e1x = x + 6; e1y = y + 5;
            e2x = x + 6; e2y = y + ts - 5;
        } else if (dir.y === -1) { // 向上
            e1x = x + 5; e1y = y + 6;
            e2x = x + ts - 5; e2y = y + 6;
        } else { // 向下
            e1x = x + 5; e1y = y + ts - 6;
            e2x = x + ts - 5; e2y = y + ts - 6;
        }

        const eyeRadius = 3;
        const pupilRadius = 1.5;

        // 眼白
        ctx.fillStyle = STYLE_CONFIG.COLORS.EYE_SCLERA;
        ctx.beginPath();
        ctx.arc(e1x, e1y, eyeRadius, 0, Math.PI * 2);
        ctx.arc(e2x, e2y, eyeRadius, 0, Math.PI * 2);
        ctx.fill();

        // 黑瞳孔 (往移動方向偏移 1px 注視)
        ctx.fillStyle = STYLE_CONFIG.COLORS.EYE_PUPIL;
        ctx.beginPath();
        ctx.arc(e1x + dir.x * 1, e1y + dir.y * 1, pupilRadius, 0, Math.PI * 2);
        ctx.arc(e2x + dir.x * 1, e2y + dir.y * 1, pupilRadius, 0, Math.PI * 2);
        ctx.fill();
    }
}

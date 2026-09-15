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
     * 繪製蛇頭、眼睛與蛇身
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        const tileSize = GRID_CONFIG.TILE_SIZE;

        this.segments.forEach((segment, index) => {
            const px = segment.x * tileSize;
            const py = segment.y * tileSize;

            if (index === 0) {
                // 蛇頭：霓虹光暈與圓角
                ctx.fillStyle = STYLE_CONFIG.COLORS.SNAKE_HEAD;
                ctx.shadowBlur = STYLE_CONFIG.GLOW.HEAD_BLUR;
                ctx.shadowColor = STYLE_CONFIG.COLORS.SNAKE_HEAD_GLOW;
                this._drawRoundRect(ctx, px + 1, py + 1, tileSize - 2, tileSize - 2, 5);
                ctx.shadowBlur = 0; // 重置光暈

                // 蛇頭眼睛 (依面向旋轉)
                this._drawEyes(ctx, px, py, this.currentDir);
            } else {
                // 蛇身：透明度漸變與圓角
                const opacity = Math.max(0.3, 1 - (index / this.segments.length) * 0.6);
                ctx.fillStyle = `rgba(16, 185, 129, ${opacity})`;
                this._drawRoundRect(ctx, px + 1, py + 1, tileSize - 2, tileSize - 2, 3);
            }
        });
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
     * 蛇頭雙眼繪製輔助
     * @private
     */
    _drawEyes(ctx, x, y, dir) {
        ctx.fillStyle = STYLE_CONFIG.COLORS.EYES;
        let eye1X, eye1Y, eye2X, eye2Y;
        const eyeSize = 2;

        if (dir.x === 1) { // 向右
            eye1X = eye2X = x + 14;
            eye1Y = y + 5; eye2Y = y + 13;
        } else if (dir.x === -1) { // 向左
            eye1X = eye2X = x + 4;
            eye1Y = y + 5; eye2Y = y + 13;
        } else if (dir.y === -1) { // 向上
            eye1Y = eye2Y = y + 4;
            eye1X = x + 5; eye2X = x + 13;
        } else { // 向下
            eye1Y = eye2Y = y + 14;
            eye1X = x + 5; eye2X = x + 13;
        }

        ctx.fillRect(eye1X, eye1Y, eyeSize, eyeSize);
        ctx.fillRect(eye2X, eye2Y, eyeSize, eyeSize);
    }
}

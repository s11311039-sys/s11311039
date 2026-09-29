import { CANVAS_CONFIG, GRID_CONFIG, STYLE_CONFIG } from '../config.js';

/**
 * 抬頭顯示與介面渲染系統 (Heads-Up Display System)
 * 負責 DOM 分數面板同步、畫布背景網格、冷卻計量條與狀態覆蓋層 (Start / Game Over)
 */
export class HUD {
    /**
     * @param {HTMLElement} scoreElement
     * @param {HTMLElement} highScoreElement
     * @param {HTMLCanvasElement} canvas
     */
    constructor(scoreElement, highScoreElement, canvas) {
        this.scoreElement = scoreElement;
        this.highScoreElement = highScoreElement;
        this.canvas = canvas;
    }

    /**
     * 更新 DOM 頂部計分面板
     * @param {number} score
     * @param {number} highScore
     */
    updateScore(score, highScore) {
        if (this.scoreElement) {
            this.scoreElement.textContent = String(score);
        }
        if (this.highScoreElement) {
            this.highScoreElement.textContent = String(highScore);
        }
    }

    /**
     * 繪製畫布背景網格線與賽博空間放射微光
     * @param {CanvasRenderingContext2D} ctx
     */
    drawGrid(ctx) {
        const size = CANVAS_CONFIG.WIDTH;
        const tileSize = GRID_CONFIG.TILE_SIZE;

        // 1. 畫布中央向外擴散的賽博放射漸層背景 (深邃科技感)
        const bgGrad = ctx.createRadialGradient(
            size / 2, size / 2, 20,
            size / 2, size / 2, size * 0.75
        );
        bgGrad.addColorStop(0, STYLE_CONFIG.COLORS.CANVAS_BG_CENTER);
        bgGrad.addColorStop(1, STYLE_CONFIG.COLORS.CANVAS_BG);
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, size, size);

        // 2. 繪製細膩網格線
        ctx.strokeStyle = STYLE_CONFIG.COLORS.GRID_LINE;
        ctx.lineWidth = 1;

        for (let i = 0; i <= size; i += tileSize) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, size);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(size, i);
            ctx.stroke();
        }

        // 3. 繪製網格交會節點微光 (每隔 2 格產生科技微光點)
        ctx.fillStyle = STYLE_CONFIG.COLORS.GRID_DOT;
        for (let x = 0; x <= size; x += tileSize * 2) {
            for (let y = 0; y <= size; y += tileSize * 2) {
                ctx.beginPath();
                ctx.arc(x, y, 1.2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    /**
     * 繪製指令冷卻/步頻進度計量條 (Cooldown Meter)
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} progress 0.0 ~ 1.0 的進度比率
     */
    drawCooldownMeter(ctx, progress) {
        const clampedProgress = Math.max(0, Math.min(1, progress));
        const barHeight = 3;
        const width = this.canvas.width * clampedProgress;

        ctx.fillStyle = '#00f5d4';
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#00f5d4';
        ctx.fillRect(0, this.canvas.height - barHeight, width, barHeight);
        ctx.shadowBlur = 0;
    }

    /**
     * 繪製開始遊戲提示覆蓋層
     * @param {CanvasRenderingContext2D} ctx
     */
    drawStartScreen(ctx) {
        this._drawOverlay(ctx, '⚡ 復古霓虹貪食蛇 ⚡', '按下 [ SPACE 空白鍵 ] 開始遊戲\n使用 WASD 或 方向鍵 控制移動');
    }

    /**
     * 繪製 Game Over 結算覆蓋層
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} score
     */
    drawGameOver(ctx, score) {
        this._drawOverlay(ctx, '💥 GAME OVER 💥', `最終得分：${score}\n按下 [ SPACE 空白鍵 ] 重新挑戰`);
    }

    /**
     * 半透明 Overlay 基礎繪製 (霓虹街機風格)
     * @private
     */
    _drawOverlay(ctx, title, subtitle) {
        ctx.fillStyle = STYLE_CONFIG.COLORS.OVERLAY_BG;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.textAlign = 'center';
        ctx.fillStyle = STYLE_CONFIG.COLORS.OVERLAY_TITLE;
        ctx.font = 'bold 24px "Segoe UI", sans-serif';
        ctx.shadowBlur = 10;
        ctx.shadowColor = STYLE_CONFIG.COLORS.OVERLAY_TITLE;
        ctx.fillText(title, this.canvas.width / 2, this.canvas.height / 2 - 24);
        ctx.shadowBlur = 0;

        ctx.fillStyle = STYLE_CONFIG.COLORS.OVERLAY_SUBTITLE;
        ctx.font = '14px "Segoe UI", sans-serif';
        const lines = subtitle.split('\n');
        lines.forEach((line, index) => {
            ctx.fillText(line, this.canvas.width / 2, this.canvas.height / 2 + 18 + (index * 24));
        });
    }
}

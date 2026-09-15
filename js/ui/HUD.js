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
     * 繪製畫布背景網格線 (復古高質感)
     * @param {CanvasRenderingContext2D} ctx
     */
    drawGrid(ctx) {
        ctx.strokeStyle = STYLE_CONFIG.COLORS.GRID_LINE;
        ctx.lineWidth = 1;
        const size = CANVAS_CONFIG.WIDTH;
        const tileSize = GRID_CONFIG.TILE_SIZE;

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
    }

    /**
     * 繪製指令冷卻/步頻進度計量條 (Cooldown Meter)
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} progress 0.0 ~ 1.0 的進度比率
     */
    drawCooldownMeter(ctx, progress) {
        const clampedProgress = Math.max(0, Math.min(1, progress));
        const barHeight = 2;
        const width = this.canvas.width * clampedProgress;

        ctx.fillStyle = 'rgba(16, 185, 129, 0.4)';
        ctx.fillRect(0, this.canvas.height - barHeight, width, barHeight);
    }

    /**
     * 繪製開始遊戲提示覆蓋層
     * @param {CanvasRenderingContext2D} ctx
     */
    drawStartScreen(ctx) {
        this._drawOverlay(ctx, '【 經典貪食蛇 】', '按下 [ SPACE 空白鍵 ] 開始遊戲');
    }

    /**
     * 繪製 Game Over 結算覆蓋層
     * @param {CanvasRenderingContext2D} ctx
     * @param {number} score
     */
    drawGameOver(ctx, score) {
        this._drawOverlay(ctx, 'GAME OVER', `得分：${score}\n按下 [ SPACE 空白鍵 ] 重新開始`);
    }

    /**
     * 半透明 Overlay 基礎繪製
     * @private
     */
    _drawOverlay(ctx, title, subtitle) {
        ctx.fillStyle = STYLE_CONFIG.COLORS.OVERLAY_BG;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.textAlign = 'center';
        ctx.fillStyle = STYLE_CONFIG.COLORS.OVERLAY_TITLE;
        ctx.font = 'bold 24px "Segoe UI", sans-serif';
        ctx.fillText(title, this.canvas.width / 2, this.canvas.height / 2 - 20);

        ctx.fillStyle = STYLE_CONFIG.COLORS.OVERLAY_SUBTITLE;
        ctx.font = '14px "Segoe UI", sans-serif';
        const lines = subtitle.split('\n');
        lines.forEach((line, index) => {
            ctx.fillText(line, this.canvas.width / 2, this.canvas.height / 2 + 20 + (index * 22));
        });
    }
}

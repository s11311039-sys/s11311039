import { Entity } from './Entity.js';
import { GRID_CONFIG, STYLE_CONFIG } from '../config.js';

/**
 * 食物實體 (Food Entity)
 * 負責在棋盤內隨機生成（避開蛇身）、維護座標並進行霓虹發光渲染
 */
export class Food extends Entity {
    constructor() {
        super(0, 0, GRID_CONFIG.TILE_SIZE, GRID_CONFIG.TILE_SIZE);
    }

    /**
     * 在網格中隨機生成食物座標，確保不與禁用座標（如蛇身）重疊
     * @param {Array<{x: number, y: number}>} forbiddenPositions 排除座標清單
     * @param {number} gridCount 棋盤單邊網格數
     */
    spawn(forbiddenPositions = [], gridCount = GRID_CONFIG.COUNT) {
        let valid = false;
        while (!valid) {
            this.x = Math.floor(Math.random() * gridCount);
            this.y = Math.floor(Math.random() * gridCount);
            valid = !forbiddenPositions.some(pos => pos.x === this.x && pos.y === this.y);
        }
    }

    /**
     * 繪製霓虹食物
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        const tileSize = GRID_CONFIG.TILE_SIZE;
        const foodX = this.x * tileSize + tileSize / 2;
        const foodY = this.y * tileSize + tileSize / 2;

        ctx.shadowBlur = STYLE_CONFIG.GLOW.FOOD_BLUR;
        ctx.shadowColor = STYLE_CONFIG.COLORS.FOOD_GLOW;
        ctx.fillStyle = STYLE_CONFIG.COLORS.FOOD;
        ctx.beginPath();
        ctx.arc(foodX, foodY, tileSize / 2 - 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // 重置陰影模糊
    }
}

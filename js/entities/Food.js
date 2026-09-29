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
     * 繪製霓虹蘋果食物（帶有小綠葉與晶瑩高光）
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        const tileSize = GRID_CONFIG.TILE_SIZE;
        const foodX = this.x * tileSize + tileSize / 2;
        const foodY = this.y * tileSize + tileSize / 2 + 1;
        const radius = tileSize / 2 - 3;

        // 蘋果葉柄 / 小綠葉
        ctx.fillStyle = '#00f5d4';
        ctx.beginPath();
        ctx.ellipse(foodX + 2, foodY - radius - 1, 3, 1.5, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();

        // 霓虹蘋果本體與發光
        ctx.shadowBlur = STYLE_CONFIG.GLOW.FOOD_BLUR;
        ctx.shadowColor = STYLE_CONFIG.COLORS.FOOD_GLOW;
        ctx.fillStyle = STYLE_CONFIG.COLORS.FOOD;
        ctx.beginPath();
        ctx.arc(foodX, foodY, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // 重置陰影模糊

        // 晶瑩反光高光
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.beginPath();
        ctx.arc(foodX - radius * 0.35, foodY - radius * 0.35, 1.8, 0, Math.PI * 2);
        ctx.fill();
    }
}

/**
 * 基礎實體類別 (Base Entity Class)
 * 所有遊戲角色、物件、障礙物之通用基類
 */

export class Entity {
    /**
     * @param {number} x 網格或世界 X 座標
     * @param {number} y 網格或世界 Y 座標
     * @param {number} width 實體寬度
     * @param {number} height 實體高度
     */
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.active = true;
    }

    /**
     * 狀態更新鉤子
     * @param {number} deltaTime 距上一幀的時間間隔 (ms)
     */
    update(deltaTime) {}

    /**
     * 渲染繪製鉤子
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {}
}

import { GRID_CONFIG } from '../config.js';

/**
 * 物理與碰撞判定系統 (Physics System)
 * 負責處理邊界、自體與物件間的空間幾何與網格碰撞檢測
 */
export class Physics {
    /**
     * 檢測是否撞擊邊界牆壁
     * @param {{x: number, y: number}} position 待檢測座標
     * @param {number} gridCount 網格單邊大小
     * @returns {boolean}
     */
    static checkWallCollision(position, gridCount = GRID_CONFIG.COUNT) {
        return (
            position.x < 0 ||
            position.x >= gridCount ||
            position.y < 0 ||
            position.y >= gridCount
        );
    }

    /**
     * 檢測是否撞擊自身身體
     * @param {{x: number, y: number}} head 蛇頭座標
     * @param {Array<{x: number, y: number}>} bodySegments 身體節點座標清單
     * @returns {boolean}
     */
    static checkSelfCollision(head, bodySegments) {
        return bodySegments.some(segment => segment.x === head.x && segment.y === head.y);
    }

    /**
     * 檢測兩個實體或座標是否重疊 (AABB/網格重疊)
     * @param {{x: number, y: number}} posA
     * @param {{x: number, y: number}} posB
     * @returns {boolean}
     */
    static checkIntersection(posA, posB) {
        return posA.x === posB.x && posA.y === posB.y;
    }
}

import { KEYS } from '../config.js';

/**
 * 集中輸入監聽器 (Input Handler)
 * 負責監控鍵盤操作與滑鼠/觸控點擊、攔截視窗捲動，並發送意圖指令
 */
export class InputHandler {
    /**
     * @param {Object} callbacks
     * @param {Function} callbacks.onDirection
     * @param {Function} callbacks.onAction
     */
    constructor({ onDirection, onAction }) {
        this.onDirection = onDirection;
        this.onAction = onAction;

        this._handleKeyDown = this._handleKeyDown.bind(this);
        this._handlePointerDown = this._handlePointerDown.bind(this);

        this._init();
    }

    /**
     * 綁定全域監聽器
     * @private
     */
    _init() {
        window.addEventListener('keydown', this._handleKeyDown);
        window.addEventListener('pointerdown', this._handlePointerDown);
    }

    /**
     * 註銷監聽器以防記憶體洩漏
     */
    destroy() {
        window.removeEventListener('keydown', this._handleKeyDown);
        window.removeEventListener('pointerdown', this._handlePointerDown);
    }

    /**
     * 處理鍵盤按鍵事件
     * @private
     * @param {KeyboardEvent} e
     */
    _handleKeyDown(e) {
        const key = e.key.toLowerCase();
        const preventKeys = ['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' ', 'w', 'a', 's', 'd'];

        if (preventKeys.includes(key)) {
            e.preventDefault();
        }

        // 空白鍵動作 (開始/重試)
        if (KEYS.ACTION.includes(e.key) || KEYS.ACTION.includes(e.code)) {
            if (this.onAction) this.onAction();
            return;
        }

        // 移動方向判定
        if (this.onDirection) {
            if (KEYS.UP.some(k => k.toLowerCase() === key)) {
                this.onDirection({ x: 0, y: -1 });
            } else if (KEYS.DOWN.some(k => k.toLowerCase() === key)) {
                this.onDirection({ x: 0, y: 1 });
            } else if (KEYS.LEFT.some(k => k.toLowerCase() === key)) {
                this.onDirection({ x: -1, y: 0 });
            } else if (KEYS.RIGHT.some(k => k.toLowerCase() === key)) {
                this.onDirection({ x: 1, y: 0 });
            }
        }
    }

    /**
     * 處理點擊事件 (滑鼠/觸控亦可觸發開始與重試)
     * @private
     * @param {PointerEvent} e
     */
    _handlePointerDown(e) {
        // 若點擊畫布且有動作處理器，觸發 Action
        if (e.target && e.target.id === 'gameCanvas') {
            if (this.onAction) this.onAction();
        }
    }
}

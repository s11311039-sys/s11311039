/**
 * 遊戲主循環管理類別 (GameLoop)
 * 負責以 requestAnimationFrame 驅動循環、精確計算 Delta Time 並調度邏輯更新與渲染
 */
export class GameLoop {
    /**
     * @param {Function} updateFn 邏輯更新回呼函式
     * @param {Function} renderFn 畫面渲染回呼函式
     * @param {number} tickRate 固定步長邏輯間隔 (ms, 預設 100)
     */
    constructor(updateFn, renderFn, tickRate = 100) {
        this.updateFn = updateFn;
        this.renderFn = renderFn;
        this.tickRate = tickRate;

        this.isRunning = false;
        this.lastTime = 0;
        this.lastTickTime = 0;
        this.animationFrameId = null;

        this._loop = this._loop.bind(this);
    }

    /**
     * 啟動遊戲循環
     */
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        this.lastTickTime = this.lastTime;
        this.animationFrameId = requestAnimationFrame(this._loop);
    }

    /**
     * 暫停/停止遊戲循環
     */
    stop() {
        this.isRunning = false;
        if (this.animationFrameId !== null) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * 主幀循環執行邏輯
     * @private
     * @param {DOMHighResTimeStamp} currentTime
     */
    _loop(currentTime) {
        if (!this.isRunning) return;

        // 計算自上一幀經過的 Delta Time
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        // 固定步長 Tick 邏輯判定
        const timeSinceTick = currentTime - this.lastTickTime;
        if (timeSinceTick >= this.tickRate) {
            this.lastTickTime = currentTime;
            this.updateFn(deltaTime);
        }

        // 計算當前步長進度 (0.0 ~ 1.0)，可用於平滑插值與冷卻計量條
        const tickProgress = Math.min(1, timeSinceTick / this.tickRate);
        this.renderFn(tickProgress);

        this.animationFrameId = requestAnimationFrame(this._loop);
    }
}

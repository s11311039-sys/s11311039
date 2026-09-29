import {
    GRID_CONFIG,
    CANVAS_CONFIG,
    PHYSICS_CONFIG,
    GAMEPLAY_CONFIG,
    STYLE_CONFIG
} from '../config.js';
import { Player } from '../entities/Player.js';
import { Food } from '../entities/Food.js';
import { Physics } from '../systems/Physics.js';
import { ParticleSystem } from '../systems/ParticleSystem.js';
import { SoundSystem } from '../systems/SoundSystem.js';
import { HUD } from '../ui/HUD.js';
import { GameLoop } from './GameLoop.js';
import { InputHandler } from './InputHandler.js';

/**
 * 遊戲主引擎類別 (Game Engine Orchestrator)
 * 統一協調實體、物理系統、渲染層與循環控制
 */
export class Game {
    /**
     * @param {Object} elements
     * @param {HTMLCanvasElement} elements.canvas
     * @param {HTMLElement} elements.scoreEl
     * @param {HTMLElement} elements.highScoreEl
     */
    constructor({ canvas, scoreEl, highScoreEl }) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // 設定畫布尺寸
        this.canvas.width = CANVAS_CONFIG.WIDTH;
        this.canvas.height = CANVAS_CONFIG.HEIGHT;

        // 遊戲狀態
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem(GAMEPLAY_CONFIG.STORAGE_KEY_HIGHSCORE), 10) || 0;
        this.gameStarted = false;
        this.gameOver = false;

        // 核心子系統實例化
        this.player = new Player();
        this.food = new Food();
        this.particleSystem = new ParticleSystem();
        this.soundSystem = new SoundSystem();
        this.hud = new HUD(scoreEl, highScoreEl, this.canvas);

        // 輸入監聽初始化
        this.inputHandler = new InputHandler({
            onDirection: (dir) => this.handleDirection(dir),
            onAction: () => this.handleAction()
        });

        // 遊戲循環初始化 (以 fixed tick rate 驅動邏輯更新)
        this.loop = new GameLoop(
            (dt) => this.update(dt),
            (progress) => this.render(progress),
            PHYSICS_CONFIG.GAME_SPEED
        );

        // 同步初始分數至介面
        this.hud.updateScore(this.score, this.highScore);
    }

    /**
     * 啟動遊戲引擎
     */
    start() {
        this.loop.start();
    }

    /**
     * 開始新一輪遊戲
     */
    startNewGame() {
        this.player.reset();
        this.score = 0;
        this.gameOver = false;
        this.gameStarted = true;
        this.particleSystem.clear();

        this.food.spawn(this.player.segments);
        this.hud.updateScore(this.score, this.highScore);
    }

    /**
     * 處理轉向意圖
     * @param {{x: number, y: number}} dir
     */
    handleDirection(dir) {
        if (!this.gameStarted || this.gameOver) return;
        this.soundSystem.initContext();

        const prevX = this.player.nextDir.x;
        const prevY = this.player.nextDir.y;
        this.player.setDirection(dir);

        // 若轉向被成功接受，播放微音量轉彎反饋音
        if (this.player.nextDir.x !== prevX || this.player.nextDir.y !== prevY) {
            this.soundSystem.playTurn();
        }
    }

    /**
     * 處理空白鍵或點擊動作
     */
    handleAction() {
        this.soundSystem.initContext();
        if (!this.gameStarted || this.gameOver) {
            this.startNewGame();
        }
    }

    /**
     * 觸發 Game Over 結算
     */
    triggerGameOver() {
        this.gameOver = true;
        this.soundSystem.playDie();
    }

    /**
     * 遊戲邏輯更新 (由 GameLoop 固定頻率調用)
     * @param {number} deltaTime
     */
    update(deltaTime) {
        if (!this.gameStarted || this.gameOver) return;

        // 1. 預判下一個蛇頭座標
        const nextHead = this.player.getNextHeadPosition();

        // 2. 邊界牆壁碰撞判定
        if (Physics.checkWallCollision(nextHead, GRID_CONFIG.COUNT)) {
            this.triggerGameOver();
            return;
        }

        // 3. 蛇身自身碰撞判定
        if (Physics.checkSelfCollision(nextHead, this.player.segments)) {
            this.triggerGameOver();
            return;
        }

        // 4. 食物碰撞與吞食判定
        const isEating = Physics.checkIntersection(nextHead, this.food);

        if (isEating) {
            this.player.move(nextHead, true);
            this.score += GAMEPLAY_CONFIG.SCORE_PER_FOOD;
            this.soundSystem.playEat();

            // 最高分記錄更新
            if (this.score > this.highScore) {
                this.highScore = this.score;
                localStorage.setItem(GAMEPLAY_CONFIG.STORAGE_KEY_HIGHSCORE, String(this.highScore));
            }

            // 發射吞食爆炸粒子特效
            const tileSize = GRID_CONFIG.TILE_SIZE;
            const particleX = this.food.x * tileSize + tileSize / 2;
            const particleY = this.food.y * tileSize + tileSize / 2;
            this.particleSystem.emit(particleX, particleY);

            // 重新生成新食物
            this.food.spawn(this.player.segments);

            // 更新 HUD
            this.hud.updateScore(this.score, this.highScore);
        } else {
            this.player.move(nextHead, false);
        }

        // 5. 更新粒子系統
        this.particleSystem.update(deltaTime);
    }

    /**
     * 畫面繪製渲染
     * @param {number} tickProgress
     */
    render(tickProgress) {
        const { ctx, canvas } = this;

        // 1. 清空畫布背景
        ctx.fillStyle = STYLE_CONFIG.COLORS.CANVAS_BG;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. 繪製復古網格線
        this.hud.drawGrid(ctx);

        // 3. 繪製動態粒子
        this.particleSystem.draw(ctx);

        // 4. 繪製食物 (僅遊戲進行中繪製)
        if (this.gameStarted) {
            this.food.draw(ctx);
        }

        // 5. 繪製玩家 (貪食蛇)
        this.player.draw(ctx);

        // 6. 繪製步頻冷卻計量條 (僅進行中)
        if (this.gameStarted && !this.gameOver) {
            this.hud.drawCooldownMeter(ctx, tickProgress);
        }

        // 7. 繪製介面覆蓋層 (未開始 / 死亡結算)
        if (!this.gameStarted) {
            this.hud.drawStartScreen(ctx);
        } else if (this.gameOver) {
            this.hud.drawGameOver(ctx, this.score);
        }
    }
}

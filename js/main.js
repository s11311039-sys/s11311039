import { Game } from './core/Game.js';

/**
 * 應用程式進入點 (Application Entry Point)
 * 負責 DOM 元件掛載、遊戲引擎實例化與主循環啟動
 */
window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const scoreEl = document.getElementById('score');
    const highScoreEl = document.getElementById('highScore');

    if (!canvas) {
        console.error('找不到遊戲 Canvas 元件 (#gameCanvas)');
        return;
    }

    // 實例化遊戲引擎
    const game = new Game({
        canvas,
        scoreEl,
        highScoreEl
    });

    // 啟動引擎
    game.start();

    // 方便於主控台偵錯
    window.__GAME_INSTANCE__ = game;
});

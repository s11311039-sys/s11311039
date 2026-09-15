/**
 * 遊戲全域設定檔 (Game Configuration)
 * 集中管理所有常數、速度、物理參數與畫布規格
 */

export const GRID_CONFIG = {
    COUNT: 20,              // 20x20 網格
    TILE_SIZE: 20           // 每一格像素尺寸 (20px)
};

export const CANVAS_CONFIG = {
    WIDTH: GRID_CONFIG.COUNT * GRID_CONFIG.TILE_SIZE,   // 400px
    HEIGHT: GRID_CONFIG.COUNT * GRID_CONFIG.TILE_SIZE  // 400px
};

export const PHYSICS_CONFIG = {
    GAME_SPEED: 100,        // 邏輯 Tick 間隔 (ms)
    GRAVITY: 0              // 2D 俯視網格遊戲重力常數為 0
};

export const GAMEPLAY_CONFIG = {
    INITIAL_SNAKE: [
        { x: 5, y: 10 },
        { x: 4, y: 10 },
        { x: 3, y: 10 }
    ],
    INITIAL_DIRECTION: { x: 1, y: 0 },
    SCORE_PER_FOOD: 10,
    STORAGE_KEY_HIGHSCORE: 'snake_highscore'
};

export const PARTICLE_CONFIG = {
    COUNT: 12,              // 每次吞食產生的粒子數
    MIN_SPEED: 1,
    MAX_SPEED: 4,
    LIFE_DECAY: 0.05,
    RADIUS: 2,
    COLOR: '#ef4444'
};

export const STYLE_CONFIG = {
    COLORS: {
        CANVAS_BG: '#020617',
        GRID_LINE: '#0f172a',
        SNAKE_HEAD: '#10b981',
        SNAKE_HEAD_GLOW: '#10b981',
        FOOD: '#ef4444',
        FOOD_GLOW: '#ef4444',
        EYES: '#ffffff',
        OVERLAY_BG: 'rgba(2, 6, 23, 0.85)',
        OVERLAY_TITLE: '#f8fafc',
        OVERLAY_SUBTITLE: '#94a3b8'
    },
    GLOW: {
        HEAD_BLUR: 8,
        FOOD_BLUR: 10
    }
};

export const KEYS = {
    UP: ['ArrowUp', 'w', 'W'],
    DOWN: ['ArrowDown', 's', 'S'],
    LEFT: ['ArrowLeft', 'a', 'A'],
    RIGHT: ['ArrowRight', 'd', 'D'],
    ACTION: [' ', 'Space']
};

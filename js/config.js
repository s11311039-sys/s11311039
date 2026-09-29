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
        CANVAS_BG: '#050814',
        CANVAS_BG_CENTER: '#0e172c',
        GRID_LINE: 'rgba(30, 45, 75, 0.4)',
        GRID_DOT: 'rgba(56, 189, 248, 0.3)',
        SNAKE_HEAD: '#00f5d4',
        SNAKE_HEAD_GLOW: '#00f5d4',
        SNAKE_BODY_START: '#00bbf9',
        SNAKE_BODY_MID: '#4361ee',
        SNAKE_BODY_END: '#7209b7',
        SNAKE_TONGUE: '#ff0054',
        EYE_SCLERA: '#ffffff',
        EYE_PUPIL: '#090d16',
        FOOD: '#ff0054',
        FOOD_GLOW: '#ff0054',
        OVERLAY_BG: 'rgba(5, 8, 20, 0.88)',
        OVERLAY_TITLE: '#00f5d4',
        OVERLAY_SUBTITLE: '#94a3b8'
    },
    GLOW: {
        HEAD_BLUR: 12,
        FOOD_BLUR: 14
    }
};

export const KEYS = {
    UP: ['ArrowUp', 'w', 'W'],
    DOWN: ['ArrowDown', 's', 'S'],
    LEFT: ['ArrowLeft', 'a', 'A'],
    RIGHT: ['ArrowRight', 'd', 'D'],
    ACTION: [' ', 'Space']
};

import { PARTICLE_CONFIG } from '../config.js';

/**
 * 粒子特效系統 (Particle System)
 * 負責視覺爆炸與火花粒子的生命週期管理、運動模擬與渲染
 */
export class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    /**
     * 重置並清空所有粒子
     */
    clear() {
        this.particles = [];
    }

    /**
     * 在指定像素座標發射爆破粒子
     * @param {number} x 像素 X
     * @param {number} y 像素 Y
     * @param {number} count 粒子數量
     * @param {string} color 粒子顏色
     */
    emit(x, y, count = PARTICLE_CONFIG.COUNT, color = PARTICLE_CONFIG.COLOR) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * (PARTICLE_CONFIG.MAX_SPEED - PARTICLE_CONFIG.MIN_SPEED) + PARTICLE_CONFIG.MIN_SPEED;
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                color
            });
        }
    }

    /**
     * 更新粒子物理位置與生命衰減
     * @param {number} [deltaTime]
     */
    update(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= PARTICLE_CONFIG.LIFE_DECAY;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    /**
     * 繪製所有活動粒子
     * @param {CanvasRenderingContext2D} ctx
     */
    draw(ctx) {
        this.particles.forEach(p => {
            ctx.fillStyle = `rgba(239, 68, 68, ${p.life})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, PARTICLE_CONFIG.RADIUS, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}

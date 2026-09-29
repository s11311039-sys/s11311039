/**
 * 遊戲音效合成系統 (Web Audio API Synthesizer)
 * 純原生無任何外部音檔依賴，即時合成發聲，保證零載入延遲與 100% 穩定度
 */
export class SoundSystem {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    /**
     * 惰性初始化 / 喚醒 AudioContext（遵循瀏覽器自動播放安全策略）
     */
    initContext() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    /**
     * 播放吃到蘋果音效 (歡快清脆的雙音階爬升音)
     */
    playEat() {
        if (!this.enabled) return;
        this.initContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const notes = [587.33, 880.00]; // D5 -> A5 (亮麗和弦爬升)

        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle'; // 柔和具穿透力的復古晶片音
            osc.frequency.setValueAtTime(freq, now + idx * 0.07);

            // 音量包絡線 (快速 Attack + 柔和 Decay)
            gain.gain.setValueAtTime(0, now + idx * 0.07);
            gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.07 + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.16);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + idx * 0.07);
            osc.stop(now + idx * 0.07 + 0.17);
        });
    }

    /**
     * 播放死亡/Game Over 音效 (低沉失真下墜音)
     */
    playDie() {
        if (!this.enabled) return;
        this.initContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const duration = 0.45;

        // 1. 下墜主音
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth'; // 鋸齒波產生電玩挫敗感
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + duration);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        // 2. 噪聲爆炸低通濾波
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.exponentialRampToValueAtTime(80, now + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + duration);
    }

    /**
     * 播放轉彎音效 (輕巧、柔和短促的點擊回饋音，絕不刺耳)
     */
    playTurn() {
        if (!this.enabled) return;
        this.initContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine'; // 正弦波極度柔順
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(330, now + 0.04);

        // 微音量，避免頻繁轉向造成聽覺疲勞
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.045);
    }
}

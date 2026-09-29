/**
 * 遊戲音效與背景音樂合成系統 (Web Audio API Synthesizer & Procedural BGM)
 * 純原生無任何外部音檔依賴，即時合成發聲，保證零載入延遲與 100% 穩定度
 */
export class SoundSystem {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.bgmEnabled = true;
        this.bgmPlaying = false;
        this.bgmTimer = null;
        this.currentStep = 0;
        this.nextStepTime = 0;

        // 音符頻率常數 (Hz)
        this.NOTES = {
            C4: 261.63, D4: 293.66, E4: 329.63, G4: 392.00, A4: 440.00, B4: 493.88,
            C5: 523.25, D5: 587.33, E5: 659.25,
            A2: 110.00, B2: 123.47, C3: 130.81, D3: 146.83, E3: 164.81, F2: 87.31, G2: 98.00
        };

        // 32 步復古賽博龐克合成旋律 (主旋律 & 重低音節奏)
        const N = this.NOTES;
        this.MELODY = [
            N.E4, 0, N.G4, 0, N.A4, 0, N.C5, 0, N.B4, 0, N.A4, N.G4, N.E4, 0, N.D4, 0,
            N.E4, 0, N.G4, 0, N.A4, 0, N.D5, 0, N.C5, 0, N.A4, 0, N.G4, N.E4, N.D4, N.C4
        ];
        this.BASS = [
            N.A2, 0, N.A2, N.A2, N.C3, 0, N.A2, 0, N.F2, 0, N.F2, N.F2, N.C3, 0, N.F2, 0,
            N.G2, 0, N.G2, N.G2, N.D3, 0, N.G2, 0, N.E2, 0, N.E2, N.E2, N.B2, 0, N.E2, 0
        ];
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
     * 啟動背景音樂 (BGM)
     */
    startBGM() {
        if (!this.bgmEnabled || this.bgmPlaying) return;
        this.initContext();
        if (!this.ctx) return;

        this.bgmPlaying = true;
        this.currentStep = 0;
        this.nextStepTime = this.ctx.currentTime + 0.05;

        // 排程器 (Lookahead Scheduler 預排音符，杜絕卡頓延遲)
        this.bgmTimer = setInterval(() => this._scheduleBGM(), 40);
    }

    /**
     * 停止背景音樂
     */
    stopBGM() {
        this.bgmPlaying = false;
        if (this.bgmTimer) {
            clearInterval(this.bgmTimer);
            this.bgmTimer = null;
        }
    }

    /**
     * 切換 BGM 開關
     * @returns {boolean} 目前音樂開關狀態
     */
    toggleBGM() {
        this.bgmEnabled = !this.bgmEnabled;
        if (!this.bgmEnabled) {
            this.stopBGM();
        } else {
            this.startBGM();
        }
        return this.bgmEnabled;
    }

    /**
     * 背景音樂排程器
     * @private
     */
    _scheduleBGM() {
        if (!this.ctx || !this.bgmPlaying) return;

        const tempo = 126; // BPM
        const stepTime = 60 / tempo / 4; // 16分音符長度 (~0.119s)
        const lookahead = 0.15; // 預排窗口 150ms

        while (this.nextStepTime < this.ctx.currentTime + lookahead) {
            this._playBGMStep(this.currentStep, this.nextStepTime, stepTime);
            this.currentStep = (this.currentStep + 1) % 32;
            this.nextStepTime += stepTime;
        }
    }

    /**
     * 合成單步音樂節點 (主旋律、低音、電子踏鈸)
     * @private
     */
    _playBGMStep(step, time, stepTime) {
        const melodyFreq = this.MELODY[step];
        const bassFreq = this.BASS[step];

        // 1. 主旋律 (柔和方形波 + 低通濾波)
        if (melodyFreq > 0) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = 'square';
            osc.frequency.setValueAtTime(melodyFreq, time);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1400, time);

            gain.gain.setValueAtTime(0.0001, time);
            gain.gain.linearRampToValueAtTime(0.045, time + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.0001, time + stepTime * 1.6);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(time);
            osc.stop(time + stepTime * 1.7);
        }

        // 2. 賽博低音 (三角波 + 彈性包絡線)
        if (bassFreq > 0) {
            const bassOsc = this.ctx.createOscillator();
            const bassGain = this.ctx.createGain();

            bassOsc.type = 'triangle';
            bassOsc.frequency.setValueAtTime(bassFreq, time);

            bassGain.gain.setValueAtTime(0.0001, time);
            bassGain.gain.linearRampToValueAtTime(0.065, time + 0.01);
            bassGain.gain.exponentialRampToValueAtTime(0.0001, time + stepTime * 1.2);

            bassOsc.connect(bassGain);
            bassGain.connect(this.ctx.destination);

            bassOsc.start(time);
            bassOsc.stop(time + stepTime * 1.3);
        }

        // 3. 節奏輕踏鈸 (每偶數拍微弱高頻粉紅噪聲)
        if (step % 2 === 1) {
            this._playHiHat(time);
        }
    }

    /**
     * 輕量電子踏鈸合成
     * @private
     */
    _playHiHat(time) {
        const bufferSize = this.ctx.sampleRate * 0.02; // 20ms
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(7000, time);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.018, time);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.02);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(time);
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

# 復古霓虹貪食蛇 (Retro Snake Game)

> 具備現代 ES6 模組化遊戲引擎架構的 HTML5 經典貪食蛇。

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-brightgreen?logo=github)](https://s11311039-sys.github.io/s11311039/)
[![JavaScript](https://img.shields.io/badge/ES6-Modules-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Guide/Modules)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 🎮 線上直接遊玩 (Live Demo)

點擊直接遊玩：👉 **[https://s11311039-sys.github.io/s11311039/](https://s11311039-sys.github.io/s11311039/)**

---

## 🕹️ 遊戲操作說明

| 按鍵 | 功能說明 |
| :--- | :--- |
| `W` / `↑` | 向上移動 |
| `S` / `↓` | 向下移動 |
| `A` / `←` | 向左移動 |
| `D` / `→` | 向右移動 |
| `SPACE` (空白鍵) 或 點擊畫布 | 開始遊戲 / 死亡後重新開始 |

---

## 🛠️ 專案架構特色

本專案採用高內聚、低耦合的物件導向遊戲引擎架構設計，百分之百使用**純原生 ES6 Modules**，無須任何繁瑣的建置工具即可原生運行：

- **核心調度 (`js/core/`)**：
  - `Game.js`：狀態機管理、實體與系統協調
  - `GameLoop.js`：計算 Delta Time、固定步長邏輯更新
  - `InputHandler.js`：集中監聽鍵盤與點擊事件，內建防視窗滾動
- **實體層 (`js/entities/`)**：
  - `Entity.js`：所有遊戲實體的基類
  - `Player.js`：貪食蛇身體節點、轉向緩衝防自殺判定、動態雙眼轉向繪製
  - `Food.js`：防重疊生成演算法、霓虹光暈渲染
- **系統層 (`js/systems/`)**：
  - `Physics.js`：網格邊界碰撞、自體碰撞與重疊檢測
  - `ParticleSystem.js`：食物吞食時的霓虹爆炸火花粒子運算與漸層淡出
- **介面層 (`js/ui/HUD.js`)**：
  - DOM 頂部計分板同步、歷史最高分快取 (`localStorage`)
  - 步長冷卻計量條 (Cooldown Meter)
  - 開始與 Game Over 覆蓋提示層
- **集中配置 (`js/config.js`)**：
  - 網格尺寸、刷新頻率、重力參數、按鍵與視覺主題常數

---

## 🚀 本機預覽執行

由於採用 ES6 原生模組，請透過簡易 HTTP 伺服器啟動：

```bash
# 使用 VS Code Live Server 延伸模組，或任一靜態伺服器：
npx serve .
# 或
python -m http.server 8000
```
瀏覽器開啟 `http://localhost:8000` 即可進行遊玩。

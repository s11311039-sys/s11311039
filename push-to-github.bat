@echo off
chcp 65001 >nul
title GitHub 專案一鍵推送工具 (retro-game-project)
cd /d "%~dp0"
set "PATH=C:\Program Files\Git\cmd;C:\Program Files\Git\bin;C:\Program Files\Git\mingw64\bin;%PATH%"

echo =======================================================
echo   正在推送復古貪食蛇專案到 GitHub...
echo   目標帳號：s11311039-sys
echo   目標儲存庫：retro-game-project
echo =======================================================
echo.

"C:\Program Files\Git\cmd\git.exe" push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo =======================================================
    echo  [成功] 專案代碼已順利推送至 GitHub！
    echo.
    echo  下一步：啟用 GitHub Pages 線上遊玩
    echo  請前往開啟：
    echo  https://github.com/s11311039-sys/retro-game-project/settings/pages
    echo.
    echo  在「Build and deployment」選取 main 分支並儲存即可！
    echo =======================================================
) else (
    echo =======================================================
    echo  [提示] 若有跳出 GitHub 網頁授權視窗，請點擊 Authorize 完成授權。
    echo =======================================================
)

echo.
pause

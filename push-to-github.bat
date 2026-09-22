@echo off
cd /d "%~dp0"
set "PATH=C:\Program Files\Git\cmd;C:\Program Files\Git\bin;C:\Program Files\Git\mingw64\bin;%PATH%"

echo ========================================================
echo   Pushing Retro Snake Game to GitHub...
echo   Target: s11311039-sys / s11311039
echo ========================================================
echo.

git remote set-url origin https://github.com/s11311039-sys/s11311039.git
git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo   SUCCESS! Pushed to GitHub successfully.
    echo   Next step: Enable GitHub Pages in your browser:
    echo   https://github.com/s11311039-sys/s11311039/settings/pages
    echo.
    echo   Live Game URL:
    echo   https://s11311039-sys.github.io/s11311039/
    echo ========================================================
) else (
    echo ========================================================
    echo   Push encountered an error or needs authorization.
    echo ========================================================
)

echo.
pause

@echo off
cd /d C:\MissionControl\LionRMS-Website

REM Remove stale lock if present
if exist ".git\index.lock" del /f ".git\index.lock"

git config user.email "admin@lionrms.uk"
git config user.name "Batir Turakulov"

git add -A

git commit -m "Design: full light-theme conversion across all pages"

git push origin main

echo.
echo ========================================
echo Push complete. Vercel will auto-deploy.
echo ========================================
pause

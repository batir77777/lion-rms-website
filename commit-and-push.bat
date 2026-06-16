@echo off
cd /d C:\MissionControl\LionRMS-Website

REM Remove stale lock if present
if exist ".git\index.lock" del /f ".git\index.lock"

git config user.email "admin@lionrms.uk"
git config user.name "Batir Turakulov"

git add -A

git commit -m "Content: Lion RMS way branding, coverage areas rebuild, training portal cleanup"
git push origin main

echo.
echo ========================================
echo Push complete. Vercel will auto-deploy.
echo ========================================
pause

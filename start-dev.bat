@echo off
cd /d "%~dp0"
echo ==== CRM dev server ishga tushmoqda... ====
call npm run dev
echo.
echo ==== Server toxtadi. Yopish uchun tugma bosing. ====
pause

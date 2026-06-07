@echo off
cd /d "%~dp0"
echo Checking TypeScript...
call npx tsc --noEmit > typecheck.txt 2>&1
echo EXITCODE %ERRORLEVEL% >> typecheck.txt
echo DONE > check-done.txt

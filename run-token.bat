@echo off
cd /d "%~dp0"
node set-token.cjs
echo DONE > token-done.txt

@echo off
cd /d "%~dp0"
echo Migrating DB (payments)...
node migrate4.cjs
echo Generating Prisma client...
call npx prisma generate > prisma-gen4.txt 2>&1
echo DONE > migrate4-done.txt
echo Tugadi. migrate4-result.txt faylini oching.
pause

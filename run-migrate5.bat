@echo off
cd /d "%~dp0"
echo Migrating DB (attendance)...
node migrate5.cjs
echo Generating Prisma client...
call npx prisma generate > prisma-gen5.txt 2>&1
echo DONE > migrate5-done.txt
echo Tugadi. migrate5-result.txt faylini oching.
pause

@echo off
cd /d "%~dp0"
echo Migrating DB (student telegram)...
node migrate7.cjs
echo Generating Prisma client...
call npx prisma generate > prisma-gen7.txt 2>&1
echo DONE > migrate7-done.txt
echo Tugadi.
pause

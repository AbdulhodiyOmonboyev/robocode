@echo off
cd /d "%~dp0"
echo Migrating DB (parent fields)...
node migrate6.cjs
echo Generating Prisma client...
call npx prisma generate > prisma-gen6.txt 2>&1
echo DONE > migrate6-done.txt
echo Tugadi.
pause

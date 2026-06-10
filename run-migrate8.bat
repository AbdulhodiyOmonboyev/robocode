@echo off
cd /d "%~dp0"
echo Migrating DB (teachers + rooms)...
node migrate8.cjs
echo Generating Prisma client...
call npx prisma generate > prisma-gen8.txt 2>&1
echo DONE > migrate8-done.txt
echo Tugadi.
pause

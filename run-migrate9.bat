@echo off
cd /d "%~dp0"
echo Migrating DB (expenses + incomes + salary)...
node migrate9.cjs
echo Generating Prisma client...
call npx prisma generate > prisma-gen9.txt 2>&1
echo DONE > migrate9-done.txt
echo Tugadi.
pause

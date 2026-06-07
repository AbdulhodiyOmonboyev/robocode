@echo off
cd /d "%~dp0"
echo Migrating DB (groups)...
node migrate3.cjs
echo Generating Prisma client...
call npx prisma generate > prisma-gen3.txt 2>&1
echo DONE > migrate3-done.txt

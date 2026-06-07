@echo off
cd /d "%~dp0"
echo Migrating DB (stages)...
node migrate2.cjs
echo Generating Prisma client...
call npx prisma generate > prisma-gen2.txt 2>&1
echo DONE > migrate2-done.txt

@echo off
cd /d "%~dp0"
echo Migrating DB...
node migrate.cjs
echo Generating Prisma client...
call npx prisma generate > prisma-gen.txt 2>&1
echo DONE > migrate-done.txt

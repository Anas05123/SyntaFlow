@echo off
set CD_INTERACTIVE=1
set CD_ROUTE=#/home
set CD_ELECTRON_MODE=built
start "" "%~dp0..\..\node_modules\electron\dist\electron.exe" "%~dp0..\..\apps\desktop\electron\main.cjs"

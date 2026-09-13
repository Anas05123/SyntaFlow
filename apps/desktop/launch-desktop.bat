@echo off
set CD_INTERACTIVE=1
set CD_ROUTE=#/home
set CD_ELECTRON_MODE=built
start "" "C:\Users\Anas\Desktop\CoreDesk\node_modules\electron\dist\electron.exe" "%~dp0electron\main.cjs"

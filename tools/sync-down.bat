@echo off
chcp 65001 >nul
title Nuke Lab - 从线上更新
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0sync.ps1" down %*
echo.
pause

@echo off
chcp 65001 >nul
title Nuke Lab - 同步到线上
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0sync.ps1" up %*
echo.
pause

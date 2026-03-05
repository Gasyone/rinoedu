@echo off
echo Starting Local Server for Rinoapp...
PowerShell -NoProfile -ExecutionPolicy Bypass -Command "& '%~dp0RunServer.ps1'"
pause

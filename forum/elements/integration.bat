@echo off
echo Integration des elements dans le forum Trinity
echo ============================================
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0integration.ps1"

echo.
echo Appuyez sur une touche pour fermer cette fenetre...
pause > nul

@echo off
echo Mise a jour de toutes les pages de securite avec le background anime
echo ================================================================
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0update-all-pages.ps1"

echo.
echo Appuyez sur une touche pour fermer cette fenetre...
pause > nul

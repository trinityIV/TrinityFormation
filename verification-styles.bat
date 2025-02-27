@echo off
echo Verification des styles du site Trinity
echo ======================================
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0verification-styles.ps1"

echo.
echo Appuyez sur une touche pour fermer cette fenetre...
pause > nul

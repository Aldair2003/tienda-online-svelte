@echo off
echo ========================================
echo   Iniciando Tienda Online
echo ========================================
echo.
echo Iniciando Backend en http://localhost:3000
start cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > nul

echo.
echo Iniciando Frontend en http://localhost:5173
start cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Servidores Iniciados
echo ========================================
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:5173
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause > nul


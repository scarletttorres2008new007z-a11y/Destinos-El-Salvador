@echo off
chcp 65001 >nul
title Destinos El Salvador - servidor
cd /d "%~dp0backend"

where java >nul 2>nul
if errorlevel 1 (
    echo.
    echo No encontramos Java en esta computadora.
    echo Instala Java 21 desde https://adoptium.net/es/temurin/releases/?version=21
    echo y luego vuelve a abrir este archivo.
    echo.
    pause
    exit /b 1
)

echo.
echo Iniciando Destinos El Salvador. La primera vez tarda unos minutos porque descarga lo necesario.
echo Cuando aparezca "Started DestinosApplication", abre http://localhost:8080 en tu navegador.
echo Para apagarlo, cierra esta ventana.
echo.
call mvnw.cmd -q spring-boot:run -Dspring-boot.run.profiles=local
pause

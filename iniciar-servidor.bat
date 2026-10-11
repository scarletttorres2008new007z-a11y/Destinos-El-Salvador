@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion
title Destinos El Salvador - servidor
cd /d "%~dp0backend"

rem Busca un Java 17 o más nuevo con compilador: JAVA_HOME, las carpetas de instalación
rem habituales y los JDK que descarga IntelliJ en .jdks
set "JDK="
if defined JAVA_HOME call :probar "%JAVA_HOME%"
for /d %%d in ("%ProgramFiles%\Eclipse Adoptium\jdk-*" "%ProgramFiles%\Java\jdk*" "%ProgramFiles%\Microsoft\jdk-*" "%ProgramFiles%\Zulu\zulu-*" "%ProgramFiles%\Amazon Corretto\jdk*" "%USERPROFILE%\.jdks\*") do (
    if not defined JDK call :probar "%%~d"
)
if not defined JDK (
    for /f "delims=" %%j in ('where javac 2^>nul') do (
        if not defined JDK call :probar "%%~dpj.."
    )
)
if not defined JDK goto :sinjava

set "JAVA_HOME=%JDK%"
set "PATH=%JDK%\bin;%PATH%"

rem Si MySQL de XAMPP está encendido (puerto 3306) se usa ese; si no, la base de datos local en backend\datos
set "PERFIL=local"
netstat -an | findstr /c:"0.0.0.0:3306" /c:"127.0.0.1:3306" /c:"[::]:3306" >nul && set "PERFIL=xampp"

echo.
echo Usando Java !VERSION_JDK! en %JDK%
if "%PERFIL%"=="xampp" (
    echo Base de datos: MySQL de XAMPP. Mira los datos en http://localhost/phpmyadmin, base «destinos».
) else (
    echo Base de datos: archivo local en backend\datos. Para usar XAMPP, enciende MySQL en el panel de XAMPP y vuelve a abrir este archivo.
)
echo Iniciando Destinos El Salvador. La primera vez tarda unos minutos porque descarga lo necesario.
echo Cuando aparezca "Started DestinosApplication", abre http://localhost:8080 en tu navegador.
echo Para apagarlo, cierra esta ventana.
echo.
call mvnw.cmd -q spring-boot:run -Dspring-boot.run.profiles=%PERFIL%
pause
exit /b 0

:sinjava
echo.
echo No encontramos Java 17 o más nuevo en esta computadora.
echo Instala Java 21 desde https://adoptium.net/es/temurin/releases/?version=21
echo Elige el instalador .msi para Windows y dale Siguiente hasta terminar.
echo Luego vuelve a abrir este archivo.
echo.
pause
exit /b 1

rem Revisa si la carpeta %1 tiene un JDK 17 o más nuevo; si sirve, la guarda en JDK
:probar
if defined JDK goto :eof
if not exist "%~1\bin\javac.exe" goto :eof
"%~1\bin\java.exe" -version 2> "%TEMP%\destinos-java.txt"
set "VER="
for /f "usebackq tokens=3" %%v in (`findstr /i "version" "%TEMP%\destinos-java.txt"`) do set "VER=%%~v"
if not defined VER goto :eof
set "MAJ="
for /f "delims=.-_" %%a in ("!VER!") do set "MAJ=%%a"
if "!MAJ!"=="1" goto :eof
if !MAJ! GEQ 17 (
    set "JDK=%~f1"
    set "VERSION_JDK=!VER!"
)
goto :eof

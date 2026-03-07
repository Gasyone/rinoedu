@echo off
:: ============================================================
:: RinoEdu AI Factory - Run Script
:: Cách dùng: run.bat "Yêu cầu tính năng của bạn"
:: ============================================================

if "%~1"=="" (
    echo.
    echo  Cach dung: run.bat "Mo ta tinh nang"
    echo  Vi du: run.bat "Tao man hinh danh sach hoc sinh module education"
    echo.
    pause
    exit /b 1
)

:: Kiểm tra venv
if not exist ".venv\Scripts\python.exe" (
    echo.
    echo  [LOI] Chua cai dat! Hay chay setup.bat truoc.
    echo.
    pause
    exit /b 1
)

:: Kiểm tra file .env
if not exist ".env" (
    echo.
    echo  [LOI] Chua co file .env!
    echo  Hay copy .env.example thanh .env va dien API Key.
    echo.
    pause
    exit /b 1
)

echo.
echo  Dang khoi dong RinoEdu AI Factory...
echo  Yeu cau: %~1
echo.

.venv\Scripts\python.exe main.py %*

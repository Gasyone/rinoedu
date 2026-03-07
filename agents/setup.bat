@echo off
:: ============================================================
:: RinoEdu AI Factory - Setup Script
:: Tự động cài uv, Python 3.12, và toàn bộ dependencies
:: ============================================================
echo.
echo  ============================================
echo   RinoEdu AI Factory - Setup
echo  ============================================
echo.

:: Kiểm tra uv đã cài chưa
where uv >nul 2>&1
if %ERRORLEVEL% == 0 (
    echo [OK] uv da duoc cai dat
    goto :install_deps
)

echo [1/3] Dang cai uv (Python package manager)...
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
if %ERRORLEVEL% neq 0 (
    echo [LOI] Cai uv that bai. Kiem tra ket noi internet.
    pause
    exit /b 1
)

:: Refresh PATH để uv có thể dùng được ngay
set "PATH=%USERPROFILE%\.local\bin;%PATH%"

:install_deps
echo.
echo [2/3] Dang cai Python 3.12 va tao virtual environment...
uv venv --python 3.12 .venv
if %ERRORLEVEL% neq 0 (
    echo [LOI] Khong the tao venv voi Python 3.12
    pause
    exit /b 1
)

echo.
echo [3/3] Dang cai CrewAI va cac dependencies...
uv pip install --python .venv\Scripts\python.exe ^
    "crewai>=1.0.0" ^
    "crewai-tools>=0.20.0" ^
    "python-dotenv>=1.0.0" ^
    "pyyaml>=6.0" ^
    "gitpython>=3.1.0"

if %ERRORLEVEL% neq 0 (
    echo [LOI] Cai dependencies that bai
    pause
    exit /b 1
)

echo.
echo  ============================================
echo   Setup HOAN TAT!
echo  ============================================
echo.
echo  Buoc tiep theo:
echo  1. Copy file .env.example thanh .env
echo  2. Mo .env va dien GEMINI_API_KEY
echo  3. Chay: run.bat "Yeu cau cua ban"
echo.
pause

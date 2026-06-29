@echo off
echo.
echo  Local Preview — http://localhost:8080
echo  Close this window to stop.
echo.
cd /d "%~dp0"
start "" "http://localhost:8080/output/index.html"
python -m http.server 8080
pause

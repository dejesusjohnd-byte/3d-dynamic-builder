@echo off
echo.
echo  TrailBound — Local Dev Server
echo  ==============================
echo  Starting on http://localhost:8080
echo  Close this window to stop the server.
echo.
cd /d "%~dp0"
start "" "http://localhost:8080/output/index-v3.html"
python -m http.server 8080
pause

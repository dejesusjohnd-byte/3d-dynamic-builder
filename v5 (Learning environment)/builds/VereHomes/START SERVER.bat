@echo off
echo Starting local server...
echo Open: http://localhost:8080/output/index.html
cd /d "%~dp0"
python -m http.server 8080
pause

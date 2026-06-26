@echo off
echo.
echo  Asset Setup — Downloads from Google Drive
echo.
set /p DRIVE_LINK="Paste your Google Drive folder link: "
echo.
python -m ensurepip --upgrade
python -m pip install gdown opencv-python -q
python "..\..\setup.py" "%DRIVE_LINK%" "%~dp0"
pause

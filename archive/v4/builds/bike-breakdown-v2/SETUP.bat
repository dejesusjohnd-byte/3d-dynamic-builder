@echo off
echo.
echo  Asset Setup — Bike Breakdown v2
echo.
set DRIVE_LINK=https://drive.google.com/drive/folders/1EjZPsRarQRa-PenwEMzvM11pwikRZAFV?usp=sharing
echo Drive link set. Downloading assets...
echo.
python -m ensurepip --upgrade
python -m pip install gdown opencv-python -q
python "..\..\setup.py" "%DRIVE_LINK%" "%~dp0"
pause

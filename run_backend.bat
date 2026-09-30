@echo off
title Backend Server
cd /d "C:\Users\AKHILA\Desktop\langchain\Youtube chatbot"
echo Starting backend server...
"C:\Users\AKHILA\Desktop\langchain\Youtube chatbot\venv\Scripts\python.exe" "C:\Users\AKHILA\Desktop\langchain\Youtube chatbot\start_backend.py" > "C:\Users\AKHILA\Desktop\langchain\Youtube chatbot\backend_output.log" 2>&1
echo Backend stopped with error code %ERRORLEVEL% >> "C:\Users\AKHILA\Desktop\langchain\Youtube chatbot\backend_output.log"
pause

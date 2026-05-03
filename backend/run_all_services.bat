@echo off
echo Starting VisualSearch AI Polyglot Backend...

:: Set the path to your virtual environment
set PYTHON_EXE=..\venv\Scripts\python.exe

:: Start the 4 Microservices in separate windows using the VENV
start "Caption Service (5001)" cmd /k "%PYTHON_EXE% python_microservices/caption_service.py"
start "Query Service (5002)" cmd /k "%PYTHON_EXE% python_microservices/query_service.py"
start "Search Service (5003)" cmd /k "%PYTHON_EXE% python_microservices/search_service.py"
start "Summary Service (5004)" cmd /k "%PYTHON_EXE% python_microservices/summary_service.py"

:: Start Django in this window using the VENV
echo.
echo Starting Django Orchestrator on port 8080...
%PYTHON_EXE% manage.py runserver 8080

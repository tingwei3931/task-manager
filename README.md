# Task Management Application

This is a basic task management application built with FastAPI as the backend and React.js as the frontend.

## Features
- Add, view, update, and delete tasks
- Mark tasks as completed
- Sort tasks list by title, description or done status in ascending or descending order

## Setup
1. Clone the repository
2. Install backend dependencies:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```
3. Run FastAPI backend:
```bash
uvicorn app.main:app --reload
```
4. Install frontend dependencies: 
```bash
cd frontend
npm install
```
5. Run the frontend application: 
```bash
npm start
```

## API Endpoints
- `POST /tasks/`: Create a new task
- `GET /tasks/`: List tasks
- `GET /tasks/{task_id}`: Get task details
- `PUT /tasks/{task_id}`: Update a task
- `DELETE /tasks/{task_id}`: Delete a task
- `PUT /tasks/{task_id}/complete`: Mark a task as completed
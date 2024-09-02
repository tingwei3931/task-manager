from fastapi import FastAPI, Depends, HTTPException
from . import models, schema, crud
from .database import engine, SessionLocal
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

# Create all the tables defined in SQLAlchemy models
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# TODO: Add production frontend
origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/tasks/", response_model=schema.Task)
def create_task(task: schema.TaskCreate, db: Session = Depends(get_db)) -> schema.Task:
    return crud.create_task(db, task)


@app.get("/tasks/", response_model=list[schema.Task])
def get_tasks(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
) -> list[models.Task]:
    return crud.get_tasks(db, skip=skip, limit=limit)


@app.get("/tasks/{task_id}", response_model=schema.Task)
def get_task(task_id: int, db: Session = Depends(get_db)) -> schema.Task:
    if db_task := crud.get_task(db, task_id):
        return db_task
    raise HTTPException(status_code=404, detail="Task not found")


@app.put("/tasks/{task_id}", response_model=schema.Task)
def update_task(
    task_id: int, task: schema.TaskCreate, db: Session = Depends(get_db)
) -> schema.Task:
    if db_task := crud.update_task(db, task_id, task):
        return db_task
    raise HTTPException(status_code=404, detail="Task to update not found")


@app.delete("/tasks/{task_id}", response_model=schema.Task)
def delete_task(task_id: int, db: Session = Depends(get_db)) -> schema.Task:
    if db_task := crud.delete_task(db, task_id):
        return db_task
    raise HTTPException(status_code=404, detail="Task to delete not found")


@app.put("/tasks/{task_id}/complete", response_model=schema.Task)
def mark_task_done(
    task_id: int, task_status: schema.TaskCompleteStatus, db: Session = Depends(get_db)
) -> schema.Task:
    if db_task := crud.mark_task_completed(db, task_id, task_status.done):
        return db_task
    raise HTTPException(status_code=404, detail="Task to complete not found")

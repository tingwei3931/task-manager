from sqlalchemy.orm import Session
from . import models, schema


def get_tasks(db: Session, skip: int = 0, limit: int = 100) -> list[models.Task]:
    return db.query(models.Task).offset(skip).limit(limit).all()


def get_task(db: Session, task_id: int) -> models.Task:
    return db.query(models.Task).filter(models.Task.id == task_id).first()


def create_task(db: Session, task: schema.TaskCreate) -> models.Task:
    db_task = models.Task(**task.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


def update_task(db: Session, task_id: int, task: schema.TaskCreate) -> models.Task:
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if db_task:
        db_task.title = task.title
        db_task.description = task.description
        db.commit()
        db.refresh(db_task)
    return db_task


def delete_task(db: Session, task_id: int):
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()

    if db_task:
        db.delete(db_task)
        db.commit()
    return db_task


def mark_task_completed(db: Session, task_id: int, done: bool) -> models.Task:
    db_task = db.query(models.Task).filter(models.Task.id == task_id).first()

    if db_task:
        db_task.done = done
        db.commit()
        db.refresh(db_task)
    return db_task

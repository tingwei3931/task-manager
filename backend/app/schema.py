from pydantic import BaseModel


class TaskBase(BaseModel):
    title: str
    description: str


class TaskCreate(TaskBase):
    pass


class Task(TaskBase):
    id: int
    done: bool

    class Config:
        orm_mode = True


class TaskCompleteStatus(BaseModel):
    done: bool

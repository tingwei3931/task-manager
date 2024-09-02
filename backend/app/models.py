from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True)
    title = Column(String)
    description = Column(String)
    done = Column(Boolean)

    def __init__(self, title, description):
        self.title = title
        self.description = description
        self.done = False

    def __repr__(self):
        return f"<Task {self.title}>"

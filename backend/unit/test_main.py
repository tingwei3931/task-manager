"""Tests for API endpoints."""

from fastapi.testclient import TestClient
from app.main import app
from app.database import engine, Base

# Create mock database and tables
Base.metadata.create_all(bind=engine)

client = TestClient(app)


def test_create_task():
    response = client.post(
        "/tasks/", json={"title": "Test Task", "description": "Test Description"}
    )
    assert response.status_code == 200
    assert response.json()["title"] == "Test Task"
    assert response.json()["description"] == "Test Description"


def test_delete_task():
    # First, create a task to delete
    response = client.post(
        "/tasks/", json={"title": "Test Task", "description": "Test Description"}
    )
    task_id = response.json()["id"]

    # Now, delete the task
    response = client.delete(f"/tasks/{task_id}")
    assert response.status_code == 200
    assert response.json()["id"] == task_id

    # Verify the task is deleted
    response = client.get(f"/tasks/{task_id}")
    assert response.status_code == 404


def test_mark_task_done():
    # First, create a task to mark as done
    response = client.post(
        "/tasks/", json={"title": "Test Task", "description": "Test Description"}
    )
    task_id = response.json()["id"]

    # Now, mark the task as done
    response = client.put(f"/tasks/{task_id}/complete", json={"done": True})
    assert response.status_code == 200
    assert response.json()["done"] is True

    # Verify the task is marked as done
    response = client.get(f"/tasks/{task_id}")
    assert response.status_code == 200
    assert response.json()["done"] is True


def test_update_task():
    # First, create a task to update
    response = client.post(
        "/tasks/", json={"title": "Test Task", "description": "Test Description"}
    )
    task_id = response.json()["id"]

    # Update the task
    updated_task = {"title": "Updated Task", "description": "Updated Description"}
    response = client.put(f"/tasks/{task_id}", json=updated_task)
    assert response.status_code == 200
    assert response.json()["title"] == updated_task["title"]
    assert response.json()["description"] == updated_task["description"]

    # Verify the task is updated
    response = client.get(f"/tasks/{task_id}")
    assert response.status_code == 200
    assert response.json()["title"] == updated_task["title"]
    assert response.json()["description"] == updated_task["description"]

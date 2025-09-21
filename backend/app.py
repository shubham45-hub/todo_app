import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from database import db, TaskOperations

load_dotenv()

app = Flask(__name__)
CORS(app)

# Database config
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# ✅ Create tables when the app starts (Flask 3.x compatible)
TaskOperations.initialize_database(app)

# Get all tasks
@app.route("/tasks", methods=["GET"])
def get_tasks():
    tasks = TaskOperations.get_all_tasks()
    return jsonify([task.to_dict() for task in tasks])

# Add a task
@app.route("/tasks", methods=["POST"])
def add_task():
    data = request.get_json()
    new_task = TaskOperations.create_task(title=data.get("title"))
    return jsonify(new_task.to_dict()), 201

# Mark complete
@app.route("/tasks/<int:task_id>/complete", methods=["PUT"])
def complete_task(task_id):
    task = TaskOperations.complete_task(task_id)
    if not task:
        return jsonify({"error": "Task not found"}), 404
    return jsonify(task.to_dict())

# Delete task
@app.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    success = TaskOperations.delete_task(task_id)
    if not success:
        return jsonify({"error": "Task not found"}), 404
    return jsonify({"message": "Task deleted"})

# Update a task
@app.route("/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    data = request.get_json()
    task = TaskOperations.update_task(task_id, title=data.get("title"))
    if not task:
        return jsonify({"error": "Task not found"}), 404
    return jsonify(task.to_dict())

if __name__ == "__main__":
    app.run(port=5000, debug=True)

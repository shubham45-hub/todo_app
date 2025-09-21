from .db import db
from .models import Task

class TaskOperations:
    """Database operations for Task model"""
    
    @staticmethod
    def get_all_tasks():
        """Get all tasks from the database"""
        return Task.query.all()
    
    @staticmethod
    def get_task_by_id(task_id):
        """Get a specific task by ID"""
        return Task.query.get(task_id)
    
    @staticmethod
    def create_task(title):
        """Create a new task"""
        new_task = Task(title=title)
        db.session.add(new_task)
        db.session.commit()
        return new_task
    
    @staticmethod
    def update_task(task_id, title=None, completed=None):
        """Update a task's title and/or completion status"""
        task = Task.query.get(task_id)
        if not task:
            return None
        
        if title is not None:
            task.title = title
        if completed is not None:
            task.completed = completed
        
        db.session.commit()
        return task
    
    @staticmethod
    def complete_task(task_id):
        """Mark a task as completed"""
        task = Task.query.get(task_id)
        if not task:
            return None
        
        task.completed = True
        db.session.commit()
        return task
    
    @staticmethod
    def delete_task(task_id):
        """Delete a task by ID"""
        task = Task.query.get(task_id)
        if not task:
            return False
        
        db.session.delete(task)
        db.session.commit()
        return True
    
    @staticmethod
    def initialize_database(app):
        """Initialize database tables"""
        with app.app_context():
            db.create_all()

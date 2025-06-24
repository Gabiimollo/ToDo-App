import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TaskItem from '../component/TaskItem.jsx';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Error al cargar las tareas. Intenta de nuevo más tarde.');
    }
  };

  const handleToggleCompletion = async (id, completed) => {
    try {
      let changeCompleted = !completed
      console.log(!changeCompleted);

      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: (!changeCompleted) }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedTask = await response.json();
      setTasks(tasks.map(task =>
        task.id === id ? updatedTask : task
      ));
      setError(null);
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Error al actualizar la tarea. Intenta de nuevo.');
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      return;
    }
    try {
      // **¡Revisa esta línea! Asegúrate de que sea un template literal.**
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setTasks(tasks.filter(task => task.id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Error al eliminar la tarea. Intenta de nuevo.');
    }
  };

  return (
    <div className="container">
      <h1>Lista de Tareas</h1>
      <Link to="/create" className="button">Añadir Nueva Tarea</Link>

      {error && <p className="error-message">{error}</p>}

      {tasks.length === 0 && !error ? (
        <p>No hay tareas aún. ¡Añade una!</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleCompletion={handleToggleCompletion}
              onDelete={handleDeleteTask}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskList;
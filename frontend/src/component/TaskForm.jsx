import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function TaskForm() {
  const [taskText, setTaskText] = useState("");
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchTask = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/tasks/${id}`, );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setTaskText(data.text);
          setError(null);
        } catch (err) {
          console.error("Error fetching task for edit:", err);
          setError("Error al cargar la tarea para editar.");
        }
      };
      fetchTask();
    }
  }, [id, API_BASE_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskText.trim()) {
      setError("El texto de la tarea no puede estar vacío.");
      return;
    }

    const method = id ? "PUT" : "POST";
    const url = id ? `${API_BASE_URL}/tasks/${id}` : `${API_BASE_URL}/tasks`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: taskText.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      navigate("/");
      setError(null);
    } catch (err) {
      console.error("Error saving task:", err);
      setError(`Error al guardar la tarea: ${err.message}.`);
    }
  };

  return (
    <div className="container">
      <h1>{id ? "Editar Tarea" : "Crear Nueva Tarea"}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Introduce la tarea..."
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
        />
        <button type="submit" className="button primary-button">
          {id ? "Actualizar Tarea" : "Añadir Tarea"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="button secondary-button"
        >
          Cancelar
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default TaskForm;

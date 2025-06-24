import React from "react";
import { Link } from "react-router-dom";

function TaskItem({ task, onToggleCompletion, onDelete }) {
  return (
    <li className={`task-item${task.completed ? " completed" : ""}`}>
      <span
        onClick={() => onToggleCompletion(task.id, !task.completed)}
        className="task-text"
        style={{ cursor: "pointer" }}
      >
        {task.text}
      </span>
      <div className="task-actions">
        <Link to={`/edit/${task.id}`} className="button edit-button">
          Editar
        </Link>
        <button
          onClick={() => onDelete(task.id)}
          className="button delete-button"
          type="button"
        >
          Eliminar
        </button>
      </div>
    </li>
  );
}

export default TaskItem;

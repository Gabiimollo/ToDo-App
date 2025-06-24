// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import TaskList from './pages/TaskList.jsx';
import TaskForm from './component/TaskForm.jsx';
import './index.css'; // Estilos globales

const router = createBrowserRouter([
  {
    path: '/',
    element: <TaskList />,
  },
  {
    path: '/create',
    element: <TaskForm />,
  },
  {
    path: '/edit/:id',
    element: <TaskForm />, // Reutilizamos TaskForm para editar
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
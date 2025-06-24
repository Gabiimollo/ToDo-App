// backend/server.js
require('dotenv').config(); // Cargar variables de entorno al principio
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000; // Usar la variable de entorno o 5000 por defecto

// Middleware
app.use(cors());
app.use(express.json()); // Permite a la aplicación entender JSON en las solicitudes

// Base de datos "en memoria" simple
let tasks = [
    { id: 1, text: 'Aprender React con Vite', completed: false },
    { id: 2, text: 'Configurar variables de entorno', completed: true },
    { id: 3, text: 'Implementar el router', completed: false }
];
let nextId = 4;

// Rutas de la API

// GET /api/tasks - Obtener todas las tareas
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

// GET /api/tasks/:id - Obtener una tarea por ID
app.get('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const taskId = parseInt(id);
    if (isNaN(taskId)) {
        return res.status(400).json({ message: 'ID de tarea inválido.' });
    }
    const task = tasks.find(task => task.id === taskId);
    if (!task) {
        return res.status(404).json({ message: 'Tarea no encontrada.' });
    }
    res.json(task);
});

// POST /api/tasks - Crear una nueva tarea
app.post('/api/tasks', (req, res) => {
    const { text } = req.body;
    if (!text || typeof text !== 'string' || text.trim() === '') {
        return res.status(400).json({ message: 'El texto de la tarea es requerido y debe ser una cadena no vacía.' });
    }
    const newTask = { id: nextId++, text: text.trim(), completed: false };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// Ruta PUT /api/tasks/:id - Actualizar una tarea existente
app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { text, completed } = req.body; // <-- Aquí se desestructura 'completed' del cuerpo

    const taskId = parseInt(id);
    if (isNaN(taskId)) {
        return res.status(400).json({ message: 'ID de tarea inválido.' });
    }

    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Tarea no encontrada.' });
    }

    // APLICA LA ACTUALIZACIÓN
    // Asegúrate de que estás actualizando las propiedades correctas de la tarea.
    if (text !== undefined) {
        if (typeof text !== 'string' || text.trim() === '') {
            return res.status(400).json({ message: 'El texto de la tarea debe ser una cadena no vacía.' });
        }
        tasks[taskIndex].text = text.trim();
    }
    // ¡ESTA ES LA LÍNEA CLAVE PARA 'completed'!
    if (completed !== undefined) { // Solo actualiza si 'completed' se envió en el body
        if (typeof completed !== 'boolean') {
            return res.status(400).json({ message: 'El estado de completado debe ser un booleano.' });
        }
        tasks[taskIndex].completed = completed; // Asigna directamente el valor del body
    }

    // Si no se proporcionó ni texto ni completed, es una solicitud malformada.
    if (text === undefined && completed === undefined) {
        return res.status(400).json({ message: 'Se requiere al menos el campo "text" o "completed" para actualizar.' });
    }

    res.json(tasks[taskIndex]); // Devuelve la tarea YA ACTUALIZADA
});

// DELETE /api/tasks/:id - Eliminar una tarea
app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const taskId = parseInt(id);
    if (isNaN(taskId)) {
        return res.status(400).json({ message: 'ID de tarea inválido.' });
    }

    const initialLength = tasks.length;
    tasks = tasks.filter(task => task.id !== taskId);

    if (tasks.length === initialLength) {
        return res.status(404).json({ message: 'Tarea no encontrada.' });
    }
    res.status(204).send(); // No Content
});

// Manejo de errores 404 (ruta no encontrada)
app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada.' });
});

// Manejo de errores general
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Algo salió mal en el servidor.' });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
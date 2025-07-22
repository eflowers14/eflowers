const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let tareas = [];

app.get('/tareas', (req, res) => {
    res.json(tareas);
});

app.post('/tareas', (req, res) => {
    // Espera que el body tenga { tarea: "texto" }
    if (req.body.tarea) {
        tareas.push(req.body.tarea);
        res.status(201).send('Tarea guardada');
    } else {
        res.status(400).send('Falta el campo "tarea"');
    }
});

app.delete('/tareas/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (id >= 0 && id < tareas.length) {
        tareas.splice(id, 1);
        res.status(200).send('Tarea eliminada');
    } else {
        res.status(404).send('Tarea no encontrada');
    }
});
<<<<<<< HEAD
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
=======
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
>>>>>>> 16147b695b57bafa86cb34fdb7af64dc6328c317

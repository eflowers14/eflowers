import express from 'express';
const app = express();
app.use(express.json());

let = tareas[];

app.get('/tareas', (req, res) => {
    res.json(tareas);
});

app.post('/tareas', (req, res) => {
    tareas.push(req.body.tareas);
    res.status(201).send('Tarea guardada');
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/gestion_de_taches', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion à MongoDB', err));

// Modèle de tâche
const Task = mongoose.model('Task', new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
}));

// Routes
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.send(tasks);
});

app.get('/tasks/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).send('Tâche non trouvée');
  res.send(task);
});

app.post('/tasks', async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.status(201).send(task);
});

app.put('/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!task) return res.status(404).send('Tâche non trouvée');
  res.send(task);
});

app.delete('/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndRemove(req.params.id);
  if (!task) return res.status(404).send('Tâche non trouvée');
  res.send(task);
});

// Documentation de l'API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});
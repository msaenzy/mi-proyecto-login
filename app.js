const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Conectar a MongoDB Atlas ( 'URL_MongoDB_Atlas'  URL real1)
mongoose.connect('mongodb+srv://mafer:mafer@cluster0.dod6tl5.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('Error de conexión a MongoDB:', error);
});

db.once('open', () => {
  console.log('Conexión exitosa a MongoDB Atlas');
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Definir el modelo de datos para la colección "usuarios"
const UsuarioSchema = new mongoose.Schema({
  nombreUsuario: String,
  contrasena: String,
});

const UsuarioModel = mongoose.model('Usuario', UsuarioSchema);

// Ruta para mostrar el formulario de inicio de sesión
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Ruta para manejar el envío del formulario de inicio de sesión
app.post('/login', async (req, res) => {
  const { nombreUsuario, contrasena } = req.body;

  try {
    // Crear un nuevo documento de usuario y guardarlo en la colección "usuarios"
    const nuevoUsuario = new UsuarioModel({ nombreUsuario, contrasena });
    await nuevoUsuario.save();

    res.send('Datos de inicio de sesión guardados en la base de datos.');
  } catch (error) {
    console.error('Error al guardar datos:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

//Este archivo contiene las diferentes rutas generales de la aplicacion
// En Routes estan las rutas para la funcionalidadaes
require('dotenv').config();

const express = require('express'); //Llamamos a express
const cors = require('cors');//Llamamos a cors

const app = express(); //Creamos la aplicacion con express

app.use(cors()); 
app.use(express.json());  // Para la manipulacion de archivos JSON

const PORT = process.env.PORT || 3000;


app.get('/', (req, res) => {
    res.send('Pagina principal');
});

app.get('/info', (req, res) => {
    res.send('Pagina de informacion');
});

app.use('/summoner', require('./Routes/summoner.js'));

app.use('/matches', require('./Routes/match.js'));

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

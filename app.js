require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors()); 
app.use(express.json()); 

const PORT = process.env.PORT || 3000;
const RIOT_API_KEY = process.env.RIOT_API_KEY;

app.get('/', (req, res) => {
    res.send('asd 🚀');
});

app.get('/info', (req, res) => {
    res.send('info aqui');
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const { obtenerNombreInvocador } = require('../Services/riotApi'); //Importamos la funcion para obtener nombre de invocador
require('dotenv').config(); //Importamos la confid dotenv



const probarFuncion = async () => {
    const nombreInvocador = "I Wanna Be Yours"; // Aqui va el nombre de invocador
    const tag = "ALEXT"; // El tag del juego

    const datos = await obtenerNombreInvocador(nombreInvocador, tag);
    console.log("Datos del invocador:", datos);
};

probarFuncion ();
module.exports = { probarFuncion };
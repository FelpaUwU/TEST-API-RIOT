require('dotenv').config();
const axios = require('axios');


const RIOT_API_KEY = 'RGAPI-28fdfcc9-45b4-416d-840e-3ceee423a5d4';
const region = 'americas';


// funcion para obtener el nombre del invocador
const obtenerNombreInvocador = async (nombreInvocador,tag)=>{
    try {
        const url = `https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${nombreInvocador}/${tag}`;
        const respuesta = await axios.get(url,{
            headers: { "X-Riot-Token": RIOT_API_KEY }
        });
        return respuesta.data;
    } catch (error) {
        console.error("Error al obtener invocador:", error.message);
        return null;
    }

};
module.exports = { obtenerNombreInvocador };
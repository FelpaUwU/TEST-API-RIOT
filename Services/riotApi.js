require('dotenv').config();
const axios = require('axios');


const RIOT_API_KEY = 'RGAPI-8edf49bb-5f6e-45f4-b95f-0f6bec983f0c';
const region = 'americas';
const regionEspecifica = 'la1';


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

const obtenerMaestriaCampeones = async (puuid)=>{
    try {
        const url = `https://${regionEspecifica}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top`;
        const respuesta = await axios.get(url,{
            headers: {"X-Riot-Token": RIOT_API_KEY}
        });
        return respuesta.data;
    } catch (error) {
        console.error("Error al obtener invocador:", error.message);
        return null;
    }
}


module.exports = { obtenerNombreInvocador, obtenerMaestriaCampeones };
const { obtenerPartidasInvocador } = require('../Services/riotApi');
const { obtenerPartidaEspecifica } = require('../Services/riotApi')
require('dotenv').config(); //Importamos la confid dotenv

const getSummonerMatchs = async(req,res)=>{
    try {
        const puuid = req.params.puuid
        const datos = await obtenerPartidasInvocador(puuid);
        if (!datos) {
            return res.status(404).json({ error: "No se encontraron partidas." });
        }
        res.json(datos);
    } catch (error) {
        console.error("No fue posible mostrar la lista:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

const getSpecifiedMatch = async(req,res)=>{
    try {
        const matchId = req.params.matchId
        const datos = await obtenerPartidaEspecifica (matchId);
        if (!datos) {
            return res.status(404).json({ error: "No se encontro informacion sobre esta partida." });
        }
        res.json(datos);
    } catch (error) {
        console.error("No fue posible mostrar informacion de la partida:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

module.exports = { getSummonerMatchs, getSpecifiedMatch };
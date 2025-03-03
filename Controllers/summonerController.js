const { obtenerNombreInvocador } = require('../Services/riotApi'); //Importamos la funcion para obtener nombre de invocador
const { obtenerMaestriaCampeones} = require('../Services/riotApi');
require('dotenv').config(); //Importamos la confid dotenv

const getSummonerByNameAndTag = async (req, res) => {
    try {
        const { name, tag } = req.params;
        const datos = await obtenerNombreInvocador(name, tag);

        if (!datos) {
            return res.status(404).json({ error: "Invocador no encontrado" });
        }
        res.json(datos);
    } catch (error) {
        console.error("Error al obtener el invocador:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};


const getChampionsMastery= async(req, res) => {
    try {
        const puuid = req.params.puuid
        const datos = await obtenerMaestriaCampeones(puuid);
        if (!datos || datos.length === 0) {
            return res.status(404).json({ error: "No hay campeones con maestria" });
        }
        res.json(datos);
    } catch (error) {
        console.error("No fue posible mostrar la lista:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

module.exports = { getSummonerByNameAndTag, getChampionsMastery};
const { obtenerNombreInvocador } = require('../Services/riotApi'); //Importamos la funcion para obtener nombre de invocador
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
module.exports = { getSummonerByNameAndTag };
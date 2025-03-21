async function obtenerNombreDeCampeon(championId) {
    try {
        // Obtener los datos del JSON
        const response = await fetch("https://ddragon.leagueoflegends.com/cdn/12.6.1/data/en_US/champion.json");
        if (!response.ok) {
            throw new Error("Error al obtener los datos");
        }

        const data = await response.json();

        // Buscar el campeón por su ID
        const campeon = Object.values(data.data).find(champ => champ.key === String(championId));

        if (!campeon) {
            throw new Error("Campeón no encontrado");
        }
        return campeon.name; // Retornar el nombre del campeón
    } catch (error) {
        console.error("Error:", error);
        return null; // Retornar null en caso de error
    }
}

// Buscar invocador
async function buscarInvocador() {
    const name = document.getElementById("summonerName").value.trim();
    const tag = document.getElementById("tag").value.trim();
    const resultadoDiv = document.getElementById("resultado");
    const maestriaDiv = document.getElementById("maestria");

    resultadoDiv.innerHTML = "";
    maestriaDiv.innerHTML = "";

    if (!name || !tag) {
        resultadoDiv.innerHTML = "<p style='color: red;'>Por favor ingresa ambos valores.</p>";
        return;
    }

    try {
        // Hacer solicitud para obtener información del invocador
        const response = await fetch(`http://localhost:3000/summoner/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`);
        if (!response.ok) {
            throw new Error("Invocador no encontrado");
        }
        const data = await response.json();

        resultadoDiv.innerHTML = `
            <p><strong>Nombre:</strong> ${data.gameName}</p>
            <p><strong>Gametag:</strong> ${data.tagLine}</p>
            <p><strong>PUUID:</strong> ${data.puuid}</p>
        `;

        // Ahora que tenemos el PUUID, hacemos la segunda solicitud para obtener la maestría
        obtenerMaestria(data.puuid);
        obtenerPartidas(data.puuid);

    } catch (error) {
        resultadoDiv.innerHTML = `<p style='color: red;'>Error: ${error.message}</p>`;
    }
}

async function obtenerMaestria(puuid) {

    const name = document.getElementById("summonerName").value.trim();
    const tag = document.getElementById("tag").value.trim();
    const maestriaDiv = document.getElementById("maestria");

    try {
        const response = await fetch(`http://localhost:3000/summoner/${encodeURIComponent(name)}/${encodeURIComponent(tag)}/${puuid}`);
        if (!response.ok) {
            throw new Error("No se encontraron campeones con maestría.");
        }
        const data = await response.json();

        if (!data.length) {
            maestriaDiv.innerHTML = "<p>No se encontraron campeones con maestría.</p>";
            return;
        }

        // Obtener los nombres de los campeones de forma asíncrona
        const listaMaestria = await Promise.all(data.slice(0, 3).map(async (champion) => {
            return `<li><strong>${await obtenerNombreDeCampeon(champion.championId)|| "Desconocido ASD"}:</strong> ${champion.championPoints} puntos</li>`;
        }));

        maestriaDiv.innerHTML = `<ul>${listaMaestria.join("")}</ul>`;

    } catch (error) {
        maestriaDiv.innerHTML = `<p style='color: red;'>Error: ${error.message}</p>`;
    }
}



// obtener informacion de partidas
async function obtenerPartidas(puuid) {
    const name = document.getElementById("summonerName").value.trim();
    const tag = document.getElementById("tag").value.trim();
    const partidasDiv = document.getElementById("partidas");

    try {
        const response = await fetch(`http://localhost:3000/matches/${encodeURIComponent(name)}/${encodeURIComponent(tag)}/${puuid}`);
        if (!response.ok) {
            throw new Error("No se encontraron partidas.");
        }
        const data = await response.json();
        if (!data.length) {
            partidasDiv.innerHTML = "<p>No se encontraron partidas.</p>";
            return;
        }
        let lista = "<ul>";
        data.slice(0, 3).forEach(partida => {
            lista += `<li><a href="#" onclick="obtenerDetallesPartida('${partida}')">${partida}</a></li>`;
        });
        lista += "</ul>";
        partidasDiv.innerHTML = lista;
    } catch (error) {
        partidasDiv.innerHTML = `<p style='color: red;'>Error: ${error.message}</p>`;
    }
}

//

async function obtenerDetallesPartida(matchId) {
    const name = document.getElementById("summonerName").value.trim();
    const tag = document.getElementById("tag").value.trim();
    const detallesDiv = document.getElementById("detallesPartida");

    try {
        const response = await fetch(`http://localhost:3000/matches/${encodeURIComponent(name)}/${encodeURIComponent(tag)}/${matchId}/details`);
        if (!response.ok) {
            throw new Error("No se pudo obtener la información de la partida.");
        }
        const data = await response.json();

        detallesDiv.innerHTML = `
            <p><strong>ID:</strong> ${data.metadata.matchId}</p>
            <p><strong>Duración:</strong> ${data.info.gameDuration} segundos</p>
            <p><strong>Modo de Juego:</strong> ${data.info.gameMode}</p>
            <p style='color: red;'><strong>Equipo Enemigo</strong></p>
        `;
        data.info.participants.slice(0, 5).forEach((participant, index) => {
            detallesDiv.innerHTML += `
                <p><strong>Nombre Invocador ${index + 1}:</strong> ${participant.riotIdGameName}</p>
                <p><strong>Muertes ${index + 1}:</strong> ${participant.deaths}</p>
                <p><strong>Kills ${index + 1}:</strong> ${participant.kills}</p>
                <p><strong>Oro Ganado ${index + 1}:</strong> ${participant.goldEarned}</p>
                <p><strong>Oro Gastado ${index + 1}:</strong> ${participant.goldSpent}</p>
                <p><strong>Posicion ${index + 1}:</strong> ${participant.teamPosition}</p>
                <p><strong>Campeon ${index + 1}:</strong> ${participant.championName}</p>
                <p><strong>Item 0 ${index + 1}:</strong> ${participant.item0}</p>
                <p><strong>Item 1 ${index + 1}:</strong> ${participant.item1}</p>
                <p><strong>Item 2 ${index + 1}:</strong> ${participant.item2}</p>
                <p><strong>Daño hecho${index + 1}:</strong> ${participant.totalDamageDealtToChampions}</p>
                <p>-----------------------------------------------------------------</p>

            `;
        });
        detallesDiv.innerHTML += `
            <p style='color: blue;'><strong>Equipo Aliado</strong></p>
        `;

        data.info.participants.slice(5, 10).forEach((participant, index) => {
            detallesDiv.innerHTML += `
                <p><strong>Nombre Invocador ${index + 1}:</strong> ${participant.riotIdGameName}</p>
                <p><strong>Muertes ${index + 1}:</strong> ${participant.deaths}</p>
                <p><strong>Kills ${index + 1}:</strong> ${participant.kills}</p>
                <p><strong>Oro Ganado ${index + 1}:</strong> ${participant.goldEarned}</p>
                <p><strong>Oro Gastado ${index + 1}:</strong> ${participant.goldSpent}</p>
                <p><strong>Posicion ${index + 1}:</strong> ${participant.teamPosition}</p>
                <p><strong>Campeon ${index + 1}:</strong> ${participant.championName}</p>
                <p><strong>Item 0 ${index + 1}:</strong> ${participant.item0}</p>
                <p><strong>Item 1 ${index + 1}:</strong> ${participant.item1}</p>
                <p><strong>Item 2 ${index + 1}:</strong> ${participant.item2}</p>
                <p><strong>Daño hecho ${index + 1}:</strong> ${participant.totalDamageDealtToChampions}</p>
                <p>-----------------------------------------------------------------</p>
            `;
        });
    } catch (error) {
        detallesDiv.innerHTML = `<p style='color: red;'>Error: ${error.message}</p>`;
    }
}

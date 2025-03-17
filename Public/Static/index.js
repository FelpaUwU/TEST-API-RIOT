let championJson = {};
//Api para consultar informaicion de campeones 
async function getLatestDDragon() {
   if(Object.keys(championJson).length > 0) {return champinoJson;}
   const versions = await fetch("https://ddragon.leagueoflegends.com/api/versions.json");
   const latest = await versions.json()[0];

   const ddragon = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latest}/data/en_US/champion.json`);

   const champions = await ddragon.json()["data"];
   championJson = champions;
   return champions;
}

async function getChampionByKey(key) {

   const champions = await getLatestDDragon();

   for (var championName in champions) {
      if (!champions.hasOwnProperty(championName)) {continue;}

      if(champions[championName]["key"] === key) {
         return champions[championName]
      }
   }

   return false;

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

        let lista = "<ul>";
        data.slice(0, 3).forEach(champion => {
            lista += `<li><strong>${getChampionByKey(champion.championId.championName)}:</strong> ${champion.championPoints} puntos</li>`;
        });
        lista += "</ul>";

        maestriaDiv.innerHTML = lista;

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
        `;
    } catch (error) {
        detallesDiv.innerHTML = `<p style='color: red;'>Error: ${error.message}</p>`;
    }
}

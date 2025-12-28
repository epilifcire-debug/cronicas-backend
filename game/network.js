import Game from "./game.js";
import "./ui.js";

let socket;
let playerId = localStorage.getItem("playerId");

function connect() {
  socket = new WebSocket("wss://SEU-SERVER.onrender.com");

  socket.onopen = () => {
    socket.send(JSON.stringify({
      type: "join",
      room: "sala1",
      name: "Arthos",
      playerId
    }));
  };

  socket.onmessage = e => {
    const data = JSON.parse(e.data);

    // 🔐 RECEBE ID
    if (data.type === "player_id") {
      playerId = data.playerId;
      localStorage.setItem("playerId", playerId);
    }

    // 🔁 RECONEXÃO
    if (data.type === "reconnected") {
      UI.log("🔁 Reconectado com sucesso");
      Game.restoreCombat(data.state);
    }

    if (data.type === "turn_start") {
      UI.log(`🎯 Turno de ${data.entity.name}`);
      Game.setActivePlayer(data.entity.id);
    }

    if (data.type === "narration") {
      UI.log("🧙 " + data.text);
    }

    if (data.type === "system") {
      UI.log("ℹ️ " + data.message);
    }
  };

  socket.onclose = () => {
    UI.log("⚠️ Conexão perdida. Tentando reconectar...");
    setTimeout(connect, 2000); // 🔁 retry automático
  };
}

connect();

export { socket };

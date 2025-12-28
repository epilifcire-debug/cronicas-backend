import { WebSocketServer } from "ws";
import { Rooms } from "./rooms.js";
import { AI_DM } from "./ai_dm.js";
import { CombatSystem } from "./combat.js";

const PORT = process.env.PORT || 3000;
const wss = new WebSocketServer({ port: PORT });

wss.on("connection", ws => {

  ws.on("message", msg => {
    const data = JSON.parse(msg);

    // 🔑 ENTRAR / RECONECTAR
    if (data.type === "join") {
      let room = Rooms.get(data.room);
      if (!room) room = Rooms.create(data.room);

      // 🔁 RECONEXÃO
      let player = room.players.find(p => p.id === data.playerId);

      if (player) {
        player.ws = ws;
        ws.player = player;
        ws.room = room;

        ws.send(JSON.stringify({
          type: "reconnected",
          state: room.combat
        }));

        room.broadcast({
          type: "system",
          message: `${player.name} reconectou`
        });

        return;
      }

      // 🆕 NOVO JOGADOR
      player = {
        id: crypto.randomUUID(),
        name: data.name,
        ws
      };

      room.players.push(player);
      ws.player = player;
      ws.room = room;

      ws.send(JSON.stringify({
        type: "player_id",
        playerId: player.id
      }));

      room.broadcast({
        type: "system",
        message: `${player.name} entrou na sala`
      });

      if (room.players.length === 1) {
        AI_DM.startScene(room);
        CombatSystem.start(room);
      }
    }

    // 🎮 AÇÃO
    if (data.type === "action") {
      const room = ws.room;
      const player = ws.player;

      if (!CombatSystem.validate(room, player.id)) {
        ws.send(JSON.stringify({
          type: "error",
          message: "Não é seu turno"
        }));
        return;
      }

      AI_DM.onPlayerAction(room, player, data.action);
      CombatSystem.endTurn(room);
    }
  });

  ws.on("close", () => {
    if (ws.player) {
      ws.player.ws = null; // 🔁 mantém jogador vivo
    }
  });
});

console.log("🟢 Servidor com reconexão ativa");

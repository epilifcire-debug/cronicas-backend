import { roll } from "./dice.js";

export const AI_DM = {
  narrate(room, text) {
    room.broadcast({
      type: "narration",
      text
    });
  },

  onPlayerAction(room, player, action) {
    if (action.type === "move") {
      this.narrate(
        room,
        `${player.name avança cautelosamente pelo corredor.`
      );
    }

    if (action.type === "attack") {
      const hit = roll("1d20");
      if (hit >= action.target.ca) {
        const dmg = roll("1d8");
        this.narrate(
          room,
          `${player.name} acerta ${action.target.name} causando ${dmg} de dano!`
        );
      } else {
        this.narrate(
          room,
          `${player.name} erra o ataque.`
        );
      }
    }
  },

  startScene(room) {
    this.narrate(
      room,
      "🧙 A cripta se abre diante de vocês. O ar é pesado e antigo."
    );
  }
};

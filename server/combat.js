import { rollInitiative } from "./initiative.js";

export const CombatSystem = {

  start(room) {
    const entities = [
      ...room.players.map(p => ({
        id: p.id,
        name: p.name,
        type: "player",
        dex: p.dex || 0,
        ws: p.ws
      })),
      ...room.npcs
    ];

    room.combat = {
      turnOrder: rollInitiative(entities),
      currentTurn: 0,
      round: 1,
      phase: "combat"
    };

    room.broadcast({
      type: "combat_start",
      order: room.combat.turnOrder.map(e => ({
        id: e.id,
        name: e.name,
        initiative: e.initiative
      }))
    });

    this.startTurn(room);
  },

  startTurn(room) {
    const combat = room.combat;
    const entity = combat.turnOrder[combat.currentTurn];

    room.broadcast({
      type: "turn_start",
      entity: {
        id: entity.id,
        name: entity.name,
        type: entity.type
      },
      round: combat.round
    });

    // Se for NPC, a IA joga
    if (entity.type === "npc") {
      setTimeout(() => {
        this.npcAction(room, entity);
        this.endTurn(room);
      }, 1000);
    }
  },

  endTurn(room) {
    const combat = room.combat;
    combat.currentTurn++;

    if (combat.currentTurn >= combat.turnOrder.length) {
      combat.currentTurn = 0;
      combat.round++;
    }

    this.startTurn(room);
  },

  validateAction(room, playerId) {
    const current = room.combat.turnOrder[room.combat.currentTurn];
    return current.id === playerId;
  },

  npcAction(room, npc) {
    room.broadcast({
      type: "narration",
      text: `${npc.name} se move e ataca!`
    });
  }
};

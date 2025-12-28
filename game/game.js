const Game = {
  activePlayerId: null,

  restoreCombat(combatState) {
    if (!combatState) return;

    UI.log("⚔️ Combate restaurado");
    this.activePlayerId =
      combatState.turnOrder[combatState.currentTurn].id;
  },

  setActivePlayer(playerId) {
    this.activePlayerId = playerId;
    UI.enableActions(playerId === this.myPlayerId);
  }
};

export default Game;

export const Rooms = {
  list: {},

  create(roomId) {
    this.list[roomId] = {
      id: roomId,
      players: [],
      combat: null,

      broadcast(data) {
        this.players.forEach(p => {
          if (p.ws && p.ws.readyState === 1) {
            p.ws.send(JSON.stringify(data));
          }
        });
      }
    };
    return this.list[roomId];
  },

  get(roomId) {
    return this.list[roomId];
  }
};

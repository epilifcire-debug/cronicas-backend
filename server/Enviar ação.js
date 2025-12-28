function atacar(alvo) {
  socket.send(JSON.stringify({
    type: "action",
    action: {
      type: "attack",
      target: alvo
    }
  }));
}
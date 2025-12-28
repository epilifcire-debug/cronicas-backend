import { socket } from "./network.js";

window.UI = {
  log(text) {
    const el = document.getElementById("log");
    el.innerHTML += `<div>${text}</div>`;
  },

  enableActions(enabled) {
    document
      .querySelectorAll("#combat-controls button")
      .forEach(b => b.disabled = !enabled);
  }
};

window.endTurn = function () {
  socket.send(JSON.stringify({
    type: "action",
    action: { type: "end_turn" }
  }));
};

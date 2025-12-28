const socket = new WebSocket("wss://SEU-SERVER.onrender.com");

socket.onopen = () => {
  socket.send(JSON.stringify({
    type: "join",
    room: "sala1",
    name: "Arthos"
  }));
};

socket.onmessage = e => {
  const data = JSON.parse(e.data);

  if (data.type === "narration") {
    UI.log("🧙 " + data.text);
  }

  if (data.type === "system") {
    UI.log("ℹ️ " + data.message);
  }
};

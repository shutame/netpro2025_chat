const express = require("express");
const expressWs = require("express-ws");

const app = express();
expressWs(app);

const port = process.env.PORT || 3001;
let connects = [];

app.use(express.static("public"));

app.ws("/ws", (ws, req) => {
  connects.push(ws);

  ws.on("message", (message) => {
    console.log("Received:", message);

    connects.forEach((socket) => {
      if (socket.readyState === 1) {
        // Check if the connection is open
        const parsed_message = JSON.parse(message);
        const name = parsed_message.name;
        const content = parsed_message.message;
        const text = `${name}: ${content}`;
        socket.send(text);
      }
    });
  });

  ws.on("close", () => {
    connects = connects.filter((conn) => conn !== ws);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

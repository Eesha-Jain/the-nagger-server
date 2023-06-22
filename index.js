const http = require("http");
const server = http.createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let items = [];

io.on("connection", function (socket) {
  socket.on("add", (value) => {
    console.log("Add socket connection");

    var itemsTwo = [...items, value];
    items = itemsTwo;

    io.emit("add", itemsTwo);
  });

  socket.on("delete", (value) => {
    console.log("Delete socket connection");

    let index = 0;
    for (let i = 0; i < items.length; i++) {
      if (items._id === value._id) {
        index = i;
        break;
      }
    }

    var itemsTwo = [...items.slice(0, index), ...items.slice(index + 1)];
    items = itemsTwo;

    io.emit("delete", itemsTwo);
  });

  socket.on("changeCheck", (value) => {
    console.log("Change check socket connection");

    let index = 0;
    for (let i = 0; i < items.length; i++) {
      if (items._id === value._id) {
        index = i;
        break;
      }
    }
    value.done = !value.done;

    var itemsTwo = [...items.slice(0, index), value, ...items.slice(index + 1)];
    items = itemsTwo;

    io.emit("changeCheck", itemsTwo);
  });
});

const port = 3000; // Replace with your desired port number
server.listen(port, () => {
  console.log(`Socket.io server running on port ${port}`);
});

const express = require("express")
var app = express();
var server = app.listen(4000);
var io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
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

    var itemsTwo = [...items.slice(0, value), ...items.slice(value + 1)];
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

  socket.on("sendNotif", (item) => {
    console.log("Send notification connection");

    io.emit("sendNotif", item);
  });
});

const port = 4000; // Replace with your desired port number
server.listen(port, () => {
  console.log(`Socket.io server running on port ${port}`);
});

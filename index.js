const express = require('express')
const app = express()
const server = require('http').createServer(app);
const io = require('socket.io')(server)

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

// Magic Lines
server.prependListener("request", (req, res) => {
   res.setHeader("Access-Control-Allow-Origin", "*");
});
// instead of "*" your can also add the other domain/servername
server.listen(7000, () => {
   console.log("This is the socket server running");
});
const express = require("express");
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.PROJECT_ID,
  process.env.PROJECT_API_KEY
)

var app = express();
var server = app.listen(80);
var io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

async function getTasks() {
  const { data, error2 } = await supabase
    .from('tasks')
    .select();
  
  if (error2) console.log(error2);
  
  return data;
}

io.on("connection", function (socket) {
  socket.on("get", async () => {
    console.log("Get socket connection");

    const data = await getTasks();
    io.emit("get", data);
  });

  socket.on("add", async (value) => {
    console.log("Add socket connection");

    const { error } = await supabase
      .from('tasks')
      .insert(value)
      .select();
    
    if (error) console.log(error);

    const data = await getTasks();
    io.emit("add", data);
  });

  socket.on("delete", async (value) => {
    console.log("Delete socket connection");

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('uuid', value.uuid);
    
    if (error) console.log(error);
    
    const data = await getTasks();
    io.emit("delete", data);
  });

  socket.on("changeCheck", async (value) => {
    console.log("Change check socket connection");

    const { error } = await supabase
      .from('tasks')
      .update({ done: !value.done })
      .eq('uuid', value.uuid);

    if (error) console.log(error);

    const data = await getTasks();
    io.emit("changeCheck", data);
  });

  socket.on("sendNotif", (item) => {
    console.log("Send notification connection");

    io.emit("sendNotif", item);
  });
});
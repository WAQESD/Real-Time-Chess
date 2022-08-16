const e = require("express");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const rooms = [];

io.on("connection", (socket) => {
    console.log(`${socket.id} connected`);
});

server.listen(3001, () => {
    console.log("listening on *:3001");
});

const openNewRoom = (hostID) => {
    const idx = rooms.findIndex((room) => hostID === room.hostID);
    if (idx > -1) return false;
    rooms.push({ hostID, guestID: null });
    return true;
};

const closeRoom = (hostID) => {
    const idx = rooms.findIndex((room) => hostID === room.hostID);
    if (idx < 0) return;
    rooms.splice(idx, 1);
};

const enterRoom = (hostID, guestID) => {
    const idx = rooms.findIndex((room) => hostID === room.hostID);
    if (idx < 0) return false;
    rooms[idx].guestID = guestID;
    return true;
};

io.on("connection", (socket) => {
    socket.on("makeNewGame", (hostID, callback) => {
        if (openNewRoom(hostID)) callback(`${hostID}'s room opened`);
        else callback("already room opened");
    });
});

io.on("connection", (socket) => {
    socket.on("enterGame", (hostID, guestID, callback) => {
        if (enterRoom(hostID, guestID))
            callback(`${guestID} enter ${hostID}'s room`);
        else callback("There is no room for that ID");
    });
});

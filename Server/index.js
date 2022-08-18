const e = require("express");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const rooms = [];
const enemy = {};
const socketById = {};

server.listen(3001, () => {
    console.log("listening on *:3001");
});

const openNewRoom = (hostID) => {
    const idx = rooms.findIndex((room) => hostID === room.hostID);
    if (idx > -1) return false;
    rooms.push({ hostID, guestID: null });
    console.log(`${hostID} open new room.`);
    return true;
};

const closeGame = (hostID) => {
    const idx = rooms.findIndex((room) => hostID === room.hostID);
    if (idx < 0) return false;
    rooms.splice(idx, 1);
    console.log(`${hostID} close the room`);
    return true;
};

const enterRoom = (hostID, guestID) => {
    const idx = rooms.findIndex((room) => hostID === room.hostID);
    if (idx < 0) return false;
    rooms[idx].guestID = guestID;
    enemy[guestID] = hostID;
    enemy[hostID] = guestID;
    console.log(`${guestID} enter ${hostID}'s room.`);
    return true;
};

io.on("connection", (socket) => {
    console.log(`${socket.id} connected`);
    socketById[socket.id] = socket;

    socket.on("makeNewGame", (hostID, callback) => {
        if (openNewRoom(hostID)) callback(true);
        else callback(false);
    });
    socket.on("enterGame", (hostID, guestID, callback) => {
        if (enterRoom(hostID, guestID)) callback(true);
        else callback(false);
    });
    socket.on("closeGame", (hostID, callback) => {
        if (closeGame(hostID)) callback(false);
    });
    socket.on("pieceMove", (playerID, { column, row }, callback) => {
        socketById[enemy[playerID]].emit("pieceMove", { column, row });
        callback();
    });
});

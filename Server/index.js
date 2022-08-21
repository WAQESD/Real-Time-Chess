const e = require("express");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    transports: ["websocket"],
    maxHttpBufferSize: 1e8,
});

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

const quitGame = (playerID) => {
    enemy[playerID] = null;
    closeGame(quitGame);
};

io.on("connection", (socket) => {
    console.log(`${socket.id} connected`);
    socketById[socket.id] = socket;
    socket.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });

    socket.on("disconnect", () => {
        closeGame(socket.id);
        if (enemy[socket.id]) socketById[enemy[socket.id]]?.emit("enemyExit");
        console.log(`${socket.id} disconnected`);
    });

    socket.on("makeNewGame", (hostID) => {
        openNewRoom(hostID);
    });
    socket.on("enterGame", (hostID, guestID, callback) => {
        if (enterRoom(hostID, guestID)) {
            socketById[enemy[guestID]]?.emit("enemyEnter", guestID);
            callback(true);
        } else callback(false);
    });
    socket.on("closeGame", (hostID) => {
        closeGame(hostID);
    });
    socket.on("pieceMove", (playerID, { from, to, isWhite }, callback) => {
        socketById[enemy[playerID]]?.emit("pieceMove", { from, to, isWhite });
        callback();
    });
    socket.on("waitMyTurn", ({ playerID, turnLimit }, callback) => {
        setTimeout(() => {
            callback();
            socketById[enemy[playerID]]?.emit("waitEnemyTurn");
        }, turnLimit);
    });
    socket.on("ready", (playerID, callback) => {
        callback();
        socketById[enemy[playerID]]?.emit("enemyReady");
    });
    socket.on("cancelReady", (playerID, callback) => {
        callback();
        socketById[enemy[playerID]]?.emit("enemyCancelReady");
    });
    socket.on("enemyExit", () => {
        quitGame(socket.id);
    });
});

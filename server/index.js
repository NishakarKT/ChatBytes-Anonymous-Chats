import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let users = [];

io.on("connect", socket => {
    socket.on("onJoin", name => {
        users.push({ name, id: socket.id, activeStatus: true });
    });

    socket.on("search", () => {
        const user = users.find(user => user.id === socket.id && user.activeStatus);
        const foundUser = users.find(user => user.id !== socket.id && user.activeStatus);
        if (foundUser) {
            socket.emit("searchResult", { friendName: foundUser.name, friendId: foundUser.id });
            io.to(foundUser.id).emit("searchResult", { friendName: user.name, friendId: user.id });
            user.activeStatus = false;
            foundUser.activeStatus = false;
        }
    });

    socket.on("checkParams", (userName) => {
        const user = users.find(user => user.name === userName && user.id === socket.id)
        socket.emit("checkedParams", user);
    });

    socket.on("sendMessage", ({ message, friendId }) => {
        io.to(friendId).emit("sentMessage", message);
    });

    socket.on("end", friendId => {
        io.to(friendId).emit("end");
    });

    socket.on("disconnect", () => {
        users = users.filter(user => user.id !== socket.id);
    });

});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log("Listening to PORT : " + PORT));
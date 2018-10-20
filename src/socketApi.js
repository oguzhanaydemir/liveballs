const socketIO = require("socket.io");
const io = socketIO();

const socketApi = {};
socketApi.io = io;
const users = {};

//Random Color Assignment
const color = require("../helpers/randomColor");

io.on("connection", socket => {
    console.log("a user connected");

    socket.on("newUser", data => {
        const defaultData = {
            id: socket.id,
            position: {
                x: 0,
                y: 0
            },
            color: color()
        };

        const userData = Object.assign(data, defaultData);
        users[socket.id] = userData;

        console.log(JSON.stringify(users, "", 2));

        socket.broadcast.emit("newUser", users[socket.id]);
        socket.emit("initPlayers", users);
    });

    socket.on("animate", position => {
        users[socket.id].position.x = position.x;
        users[socket.id].position.y = position.y;

        socket.broadcast.emit("animate", {
            socketId: socket.id,
            x: position.x,
            y: position.y
        });
    });

    socket.on("disconnect", () => {
        socket.broadcast.emit("disUser", users[socket.id]);
        delete users[socket.id];
        console.log(JSON.stringify(users, "", 2));
    });

    socket.on("newMessage", data => {
        const messageData = Object.assign({ socketId: socket.id }, data)
        socket.broadcast.emit("newMessage", messageData);
    });
});

module.exports = socketApi;

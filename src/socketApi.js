const socketIO = require('socket.io');
const io = socketIO();

const socketApi = {};
socketApi.io = io;

const users = {};

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('newUser', (data) => {
        const defaultData = {
            id: socket.id,
            position: {
                x: 0,
                y: 0
            }
        };

        const userData = Object.assign(data, defaultData);
        users[socket.id] = userData;

        console.log(JSON.stringify(users, "", 2));

        socket.broadcast.emit('newUser', users[socket.id]);
        socket.emit('initPlayers', users);
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('disUser', (users[socket.id]));
        delete users[socket.id];
        console.log(JSON.stringify(users, "", 2));
    });

});

module.exports = socketApi;
const socketIO = require('socket.io');

const io = socketIO();

const socketApi = {

};

socketApi.io = io;

io.on('connection', (socket) => {
    console.log('a user connected');
});

module.exports = socketApi;
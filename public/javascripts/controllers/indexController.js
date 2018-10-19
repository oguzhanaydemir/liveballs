app.controller("indexController", [
  "$scope",
  "indexFactory",
  ($scope, indexFactory) => {
    $scope.messages = [];
    $scope.players = {};
    $scope.init = () => {
      const username = prompt("Please enter a username");

      if (username) initSocket(username);
      else return false;
    };

    function initSocket(username) {
      const connectionOptions = {
        reconnectionAttempts: 3,
        reconnectionDelay: 600
      };

      indexFactory
        .connectSocket("http://localhost:3000", connectionOptions)
        .then(socket => {

          socket.emit("newUser", { username });

          socket.on("newUser", user => {
            $scope.messages.push({
              type: {
                code: 0, //server or user? (server:0, user:1)
                message: 1 // connect
              },
              username: user.username
            });
            $scope.players[user.id] = user;
            $scope.$apply();
          });

          socket.on("initPlayers", players => {
            $scope.players = players;
            $scope.$apply();
          });

          socket.on("disUser", user => {
            const messageData = {
              type: {
                code: 0, // server
                message: 0 // disconnect
              },
              username: user.username
            };
            $scope.messages.push(messageData);
            delete $scope.players[user.id];
            $scope.$apply();
          });

          $scope.OnClickPlayer = $event => {
            let x = $event.offsetX;
            let y = $event.offsetY;

            $("#" + socket.id).animate({ left: x, top: y });

            socket.emit("animate", { x, y });
          };

          socket.on("animate", data => {
            $("#" + data.socketId).animate({ left: data.x, top: data.y });
          });

          $scope.newMessage = () => {
            let message = $scope.message;

            const messageData = {
              type:{
                  code:1,
              },
              username,
              text : message,
            }
            $scope.messages.push(messageData);
            $scope.message = "";
            //socket.emit('newMessage', messageData);
          }

        })
        .catch(err => {
          console.log(err);
        });
    }
  }
]);

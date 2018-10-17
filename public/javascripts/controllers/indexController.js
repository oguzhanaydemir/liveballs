app.controller("indexController", [
  "$scope", "indexFactory",
  ($scope, indexFactory) => {
    $scope.messages = [];
    $scope.players = {};
    $scope.init = () => {
      const username = prompt('Please enter a username');

      if (username)
        initSocket(username);
      else
        return false;


    }


    function initSocket(username) {

      const connectionOptions = {
        reconnectionAttempts: 3,
        reconnectionDelay: 600
      };

      indexFactory.connectSocket('http://localhost:3000', connectionOptions)
        .then((socket) => {
          socket.emit('newUser', { username });
          socket.on('newUser', (user) => {
            $scope.messages.push({
              type: {
                code: 0, //server or user? (server:0, user:1)
                message: 1 // connect
              },
              username: user.username
            });
            $scope.$apply();
          });

          socket.on('initPlayers', players => {
            $scope.players = players;
            $scope.$apply();
          });

          socket.on('disUser', user => {
            $scope.messages.push({
              type: {
                code: 0,   // server
                message: 0 // disconnect
              },
              username: user.username
            });
            $scope.$apply();
          });

          $scope.OnClickPlayer = ($event) => {
            $('#' + socket.id).animate({ left: $event.offsetX, top: $event.offsetY });
          }

        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
]);

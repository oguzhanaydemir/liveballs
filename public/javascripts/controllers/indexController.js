app.controller("indexController", [
  "$scope", "indexFactory",
  ($scope, indexFactory) => {
    $scope.messages = [];
    $scope.init = () => {
      let username;
      let usernameControl = false;
      while (!usernameControl) {
        username = prompt('Please enter a username');
        if (username)
          usernameControl = true;
      }

      initSocket(username);
    }


    function initSocket(username) {

      const connectionOptions = {
        reconnectionAttempts: 3,
        reconnectionDelay: 600
      };

      indexFactory.connectSocket('http://localhost:3000', connectionOptions)
        .then((socket) => {
          socket.emit('newUser', { username });
          socket.on('newUser', (data) => {
            $scope.messages.push({
              type: 0, // return to info by server
              username: data.username
            });
            $scope.$apply();
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
]);

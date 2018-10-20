app.factory('configFactory', ['$http', ($http) => {
    const getConfig = (url, options) => {
        return new Promise((resolve, reject) => {
            $http
                .get('/get-env')
                .then(data => {
                    resolve(data);
                })
                .catch(err => {
                    console.log(err);
                });
        });
    };

    return {
        getConfig
    }

}]);
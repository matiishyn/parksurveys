angular.module('parksurveys').factory('AuthService', ['$resource', ($resource) => {
    "use strict";
    // TODO set server address to config file and inject it here
    return $resource('http://localhost:8080/user/', {}, {
        sendPhoneNumber: {
            method: 'POST',
            url: 'http://localhost:8080/user/'
        },
        verifyCode: {
            method: 'POST',
            url: 'http://localhost:8080/user/verify'
        }
    });
}]);
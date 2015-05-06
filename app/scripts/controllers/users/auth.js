'use strict';

angular.module('parksurveys').controller('AuthCtrl', function($http, $rootScope, $firebaseObject) {
  const ref = $rootScope.dataRef.child('users');
  this.user = {};

  if($rootScope.authData) {
    this.user.uid = $rootScope.authData.uid;
  }

  const send = () => {
    const url = this.user.code ? 'http://api.park.tatar/user/verify' : 'http://api.park.tatar/user';

    $http.post(url, this.user).success((data) => {
      this.status = 'queued';

      if(data.token) {
        $rootScope.authRef.$authWithCustomToken(data.token).then((authData) => {
          const id = authData.uid;
          const phone = parseInt(this.user.phone);

          this.user.uid = id;

          if(!($firebaseObject(ref.child(id)).phone)) {
            ref.child(id).set({
              phone: phone,
              role: 'user'
            });
          }
        });
      }
    }).error((data, status) => {
      this.status = 'error';
      this.code = status;
    });
  };

  const logout = () => {
    $rootScope.authRef.$unauth();

    this.user.uid = null;
    this.user.phone = null;
  };

  this.send = send;
  this.logout = logout;
});
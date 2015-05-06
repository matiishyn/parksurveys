'use strict';

angular.module('parksurveys').controller('AuthCtrl', function($http, $rootScope, $firebaseObject, $firebaseArray) {
  const usersRef = $rootScope.dataRef.child('users');
  const surveysRef = $rootScope.dataRef.child('surveys');
  const parksRef = $rootScope.dataRef.child('parks');
  const formsRef = $rootScope.dataRef.child('forms');

  this.user = {};
  this.surveys = $firebaseObject(surveysRef);
  this.parks = $firebaseObject(parksRef);
  this.forms = $firebaseObject(formsRef);

  if($rootScope.authData) {
    this.user.uid = $rootScope.authData.uid;
    this.userData = $firebaseObject(usersRef.child(this.user.uid));
  }

  const getCount = (obj) => {
    return Object.keys(obj).length;
  };

  const send = () => {
    const url = this.user.code ? 'http://api.park.tatar/user/verify' : 'http://api.park.tatar/user';

    $http.post(url, this.user).success((data) => {
      this.status = 'queued';

      if(data.token) {
        $rootScope.authRef.$authWithCustomToken(data.token).then((authData) => {
          const id = authData.uid;
          const phone = parseInt(this.user.phone);

          this.user.uid = id;

          if(!($firebaseObject(usersRef.child(id)).phone)) {
            usersRef.child(id).set({
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

  this.getCount = getCount;
  this.send = send;
  this.logout = logout;
});
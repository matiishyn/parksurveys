'use strict';

angular.module('parksurveys').controller('ParkIdCtrl', function($rootScope, $state, $firebaseObject) {
  const ref = $rootScope.dataRef.child('parks');
  const id = $state.params.id;
  const parkRef = ref.child(id);

  this.fbLoading = true;
  this.details = $firebaseObject(parkRef);

  this.details.$loaded(() => {
    this.fbLoading = false;
  });
});
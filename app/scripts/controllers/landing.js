'use strict';

angular.module('parksurveys').controller('LandingCtrl', function($rootScope, $state, $firebaseArray, gMapsStyle) {
  const ref = $rootScope.dataRef.child('parks');

  this.fbLoading = true;
  this.parks = $firebaseArray(ref);

  this.gMapsStyle = gMapsStyle;

  this.parks.$loaded(() => {
    this.fbLoading = false;
  });

  const goToPark = (ev, index) => {
    const id = this.parks[index].$id;

    $state.go('parks.id', { id: id });
  };

  this.goToPark = goToPark;
});
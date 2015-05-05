'use strict';

angular.module('parksurveys').controller('AdminParksListCtrl', function($rootScope, $state, $firebaseArray) {
  const ref = $rootScope.dataRef.child('parks');
  const parkSchema = {
    name: null,
    description: null,
    image: null,
    position: {
      lat: null,
      lon: null
    },
    formId: null
  };

  this.fbLoading = true;
  this.list = $firebaseArray(ref);

  this.list.$loaded(() => {
    this.fbLoading = false;
  });

  const create = () => {
    const newPark = ref.push(parkSchema);
    const id = newPark.key();

    $state.go('admin.parks.id', { id: id });
  };

  this.create = create;
});
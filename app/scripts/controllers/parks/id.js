'use strict';

angular.module('parksurveys').controller('ParkIdCtrl', function($rootScope, $state, $firebaseObject, $firebaseArray) {
  const parksRef = $rootScope.dataRef.child('parks');
  const usersRef = $rootScope.dataRef.child('users');
  const surveysRef = $rootScope.dataRef.child('surveys');
  const formsRef = $rootScope.dataRef.child('forms');

  const parkId = $state.params.id;
  const parkRef = parksRef.child(parkId);

  this.user = {};
  this.fbLoading = true;
  this.details = $firebaseObject(parkRef);
  this.surveys = $firebaseObject(surveysRef);
  this.forms = $firebaseObject(formsRef);

  if($rootScope.authData) {
    this.user.uid = $rootScope.authData.uid;

    const userRef = usersRef.child(this.user.uid);
    this.userData = $firebaseObject(usersRef.child(this.user.uid));
    this.userSurveys = $firebaseArray(userRef.child('surveys'));

    this.userSurveys.$loaded(() => {
      let filtered = this.userSurveys.filter((item) => {
        return item.parkId === parkId;
      });

      if(filtered.length > 0) {
        this.surveyId = filtered[0].surveyId;
      }
    });

    this.progress = (this.getCount(this.surveys[this.surveyId].answers) / (this.getCount(this.forms[this.surveys[this.surveyId].formId].questions)) * 100);
  };

  const getCount = (obj) => {
    if(obj) {
      return Object.keys(obj).length;
    }
  };

  this.details.$loaded(() => {
    this.fbLoading = false;
  });

  this.getCount = getCount;
});
'use strict';

angular.module('parksurveys').controller('ParkIdSurveyCtrl', function($rootScope, $state, $firebaseArray, $firebaseObject) {
  // Globals
  const formsRef = $rootScope.dataRef.child('forms');
  const questionsRef = $rootScope.dataRef.child('questions');

  const id = $state.params.formId;
  const detailsRef = formsRef.child(id);

  this.fbLoading = true;
  this.details = $firebaseObject(detailsRef);
  this.questions = $firebaseArray(questionsRef);

  this.questions.$loaded(() => {
    this.fbLoading = false;
  });

  const submit = (question) => {
    console.log(question)
  };

  this.submit = submit;
});
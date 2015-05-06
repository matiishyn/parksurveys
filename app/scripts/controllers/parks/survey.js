'use strict';

angular.module('parksurveys').controller('ParkIdSurveyCtrl', function($rootScope, $state, $firebaseArray, $firebaseObject) {
  // Globals
  const formsRef = $rootScope.dataRef.child('forms');
  const usersRef = $rootScope.dataRef.child('users');
  const questionsRef = $rootScope.dataRef.child('questions');
  const surveysRef = $rootScope.dataRef.child('surveys');

  const parkId = $state.params.id;
  const formId = $state.params.formId;
  const userId = $rootScope.authData.uid;
  const detailsRef = formsRef.child(formId);
  const userRef = usersRef.child(userId);

  this.fbLoading = true;
  this.details = $firebaseObject(detailsRef);
  this.questions = $firebaseArray(questionsRef);
  this.userAnswers = $firebaseObject(userRef.child('answers'));

  this.userAnswers.$loaded(() => {
    this.fbLoading = false;
    this.selected = this.userAnswers;
  });

  const submit = () => {
    // save to answers
    this.selected.$save();

    // push survey
    let selected = angular.copy(this.selected);
    delete selected.$$conf;
    delete selected.$id;
    delete selected.$priority;

    const newSurvey = surveysRef.push({
      formId: formId,
      parkId: parkId,
      userId: userId,
      answers: selected
    });

    userRef.child('surveys').push(newSurvey.key());
  };

  this.submit = submit;
});
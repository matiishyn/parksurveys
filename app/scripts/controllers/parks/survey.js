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
  this.userSurveys = $firebaseArray(userRef.child('surveys'));

  this.userAnswers.$loaded(() => {
    this.fbLoading = false;
    this.selected = this.userAnswers;
  });

  this.userSurveys.$loaded(() => {
    let filtered = this.userSurveys.filter((item) => {
      return item.parkId === parkId;
    });

    if(filtered.length != 0) {
      this.surveyId = filtered[0].surveyId;
      console.log(this.surveyId)
    }
  });

  const submit = () => {
    // save to answers
    this.selected.$save();

    // push survey
    let selected = angular.copy(this.selected);
    delete selected.$$conf;
    delete selected.$id;
    delete selected.$priority;
    delete selected.$value;

    if(this.surveyId) {
      surveysRef.child(this.surveyId).set({
        formId: formId,
        answers: selected
      });

      // userRef.child('surveys').child().set();
    } else {
      const newSurvey = surveysRef.push({
        formId: formId,
        answers: selected
      });

      userRef.child('surveys').push({
        parkId: parkId,
        surveyId: newSurvey.key()
      });
    }
  };

  this.submit = submit;
});
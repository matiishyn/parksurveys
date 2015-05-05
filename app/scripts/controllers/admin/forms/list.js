'use strict';

angular.module('parksurveys').controller('AdminFormsListCtrl', function($rootScope, $state, $firebaseArray) {
  const ref = $rootScope.dataRef.child('forms');
  const formSchema = {
    questions: [],
    parks: []
  };

  this.fbLoading = true;
  this.list = $firebaseArray(ref);

  this.list.$loaded(() => {
    this.fbLoading = false;
  });

  const getLength = (item, index) => {
    const entry = this.list[index];

    if(entry && entry[item]) {
      return Object.keys(entry[item]).length;
    } else {
      return 0;
    }
  };

  const create = () => {
    const newForm = ref.push(formSchema);
    const id = newForm.key();

    $state.go('admin.forms.id', { id: id });
  };

  this.getLength = getLength;
  this.create = create;
});
'use strict';

angular.module('parksurveys').controller('AdminParksEditCtrl', function($rootScope, $state, $firebaseArray, $firebaseObject, toastr) {
  const parksRef = $rootScope.dataRef.child('parks');
  const formsRef = $rootScope.dataRef.child('forms');
  const id = $state.params.id;
  const detailsRef = parksRef.child(id);

  this.fbLoading = true;
  this.parks = $firebaseArray(parksRef);
  this.forms = $firebaseArray(formsRef);
  this.details = $firebaseObject(detailsRef);

  this.selectize = {
    valueField: '$id',
    labelField: 'name',
    searchField: ['$id', 'name'],
    plugins: ['remove_button'],
    render: {
      'option': (data) => {
        return `
          <div class="option">
            ${data.name || data.$id}
          </div>
        `;
      }
    }
  };

  this.details.$loaded(() => {
    this.fbLoading = false;
  });

  const save = () => {
    this.details.$save().then(() => {
      toastr.success('Описание парка сохранено');
    }, () => {
      alert('Произошла какая-то ошибка, напишите на parksurveys@theaqua.im');
    });
  };

  const remove = () => {
    let parkId = this.parks.$getRecord(id);

    this.parks.$remove(parkId).then(() => {
      $state.go('admin.parks');
    });
  };

  const onImageUploadComplete = (info) => {
    this.details.image = info.cdnUrl;
    this.details.$save();
  };

  this.save = save;
  this.remove = remove;
  this.onImageUploadComplete = onImageUploadComplete;
}); 
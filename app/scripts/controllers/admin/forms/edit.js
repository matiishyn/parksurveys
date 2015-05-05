'use strict';

angular.module('parksurveys').controller('AdminFormsEditCtrl', function($rootScope, $state, $firebaseArray, $firebaseObject, toastr) {
  // Globals
  const formsRef = $rootScope.dataRef.child('forms');
  const questionsRef = $rootScope.dataRef.child('questions');

  const id = $state.params.id;
  const detailsRef = formsRef.child(id);

  const questionSchema = {
    title: 'Заголовок вопроса',
    type: 'input',
    placeholder: true
  };

  // Controller
  this.fbLoading = true;
  this.details = $firebaseObject(detailsRef);
  this.forms = $firebaseArray(formsRef);
  this.detailsQuestions = $firebaseArray(detailsRef.child('questions'));
  this.questions = $firebaseArray(questionsRef);

  this.selectize = {
    options: {
      valueField: '$id',
      labelField: 'title',
      searchField: ['$id', 'title']
    },
    selected: null
  };

  this.questions.$loaded(() => {
    this.fbLoading = false;
  });

  // Form methods
  const save = () => {
    this.details.name = this.details.name || this.details.$id;
    this.details.$save();

    toastr.success('Описание анкеты сохранено');
  };

  const remove = () => {
    let formId = this.forms.$getRecord(id);

    this.forms.$remove(formId).then(() => {
      $state.go('admin.forms');
    });
  };

  // Question methods
  const changeQuestion = (question) => {
    let ref = this.detailsQuestions.$getRecord(question.localId);
    let oldQuestion = this.questions.$getRecord(question.$id);

    ref.$value = this.selectize.selected;

    this.detailsQuestions.$save(ref).then(() => {
      if(oldQuestion.placeholder) {
        this.questions.$remove(question);
      }

      this.selectize.selected = null;
    });
  };

  const addNewQuestion = () => {
    const newQuestion = questionsRef.push(questionSchema);

    detailsRef.child('questions').push(newQuestion.key());
  };

  const saveQuestion = (question, dontNotify) => {
    delete question.placeholder;

    this.questions.$save(question).then(() => {
      dontNotify ? null : toastr.success('Вопрос сохранен');
    }, () => {
      toastr.error('Произошла ошибка, напишите на parksurveys@theaqua.im');
    });
  };

  const deleteQuestion = (type, question, localId) => {
    if(confirm('Точно удалить вопрос?')) {
      if(type === 'everywhere') {
        this.questions.$remove(question).then(() => {
          toastr.info('Вопрос удален из всех анкет');
        }, () => {
          toastr.error('Произошла ошибка, напишите на parksurveys@theaqua.im');
        });
      }

      let ref = this.detailsQuestions.$getRecord(localId);

      this.detailsQuestions.$remove(ref).then(() => {
        toastr.info('Вопрос удален из анкеты');
      }, () => {
        toastr.error('Произошла ошибка, напишите на parksurveys@theaqua.im');
      });
    }
  };

  // Answers methods
  const addNewAnswer = (question) => {
    let questionRef = questionsRef.child(question.$id);
    let answers = $firebaseArray(questionRef.child('answers'));

    saveQuestion(question, true);

    answers.$loaded(() => {
      answers.$add({ title: this.newAnswer });
      this.newAnswer = '';
    });
  };

  const deleteAnswer = (question, index) => {
    let questionRef = questionsRef.child(question.$id);
    let answers = $firebaseArray(questionRef.child('answers'));

    saveQuestion(question, true);

    answers.$loaded(() => {
      answers.$remove(index);
    });
  };

  this.save = save;
  this.remove = remove;

  this.changeQuestion = changeQuestion;

  this.addNewQuestion = addNewQuestion;
  this.saveQuestion = saveQuestion;
  this.deleteQuestion = deleteQuestion;

  this.addNewAnswer = addNewAnswer;
  this.deleteAnswer = deleteAnswer;
});
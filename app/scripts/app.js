'use strict';

const app = angular.module('parksurveys', ['ui.router', 'QuickList', 'firebase', 'toastr', 'ngMap', 'ng-selectize', 'ng-uploadcare']);

app.config(($locationProvider, $urlRouterProvider, $stateProvider) => {
  $urlRouterProvider.otherwise('/');

  $stateProvider.state('landing', {
    url: '/',
    templateUrl: '/views/landing.html'
  })

  .state('parks', {
    url: '/parks',
    templateUrl: '/views/empty.html'
  })
  .state('parks.id', {
    url: '/:id',
    templateUrl: '/views/parks/id.html'
  })
  .state('parks.id.survey', {
    url: '/survey/:formId',
    templateUrl: '/views/parks/survey.html'
  })

  // users
  .state('users', {
    templateUrl: '/views/empty.html'
  })
  .state('users.id', {
    url: '/users/:id',
    templateUrl: '/views/users/id.html'
  })
  .state('users.id.edit', {
    url: '/edit',
    templateUrl: '/views/users/edit.html'
  })

  // admin
  .state('admin', {
    url: '/admin',
    templateUrl: '/views/admin/index.html'
  })

  // admin parks
  .state('admin.parks', {
    url: '/parks',
    templateUrl: '/views/admin/parks/list.html'
  })
  .state('admin.parks.id', {
    url: '/:id',
    templateUrl: '/views/admin/parks/id.html'
  })

  // admin forms
  .state('admin.forms', {
    url: '/forms',
    templateUrl: '/views/admin/forms/list.html'
  })
  .state('admin.forms.id', {
    url: '/:id',
    templateUrl: '/views/admin/forms/id.html'
  })

  // admin users
  .state('admin.users', {
    url: '/users',
    templateUrl: '/views/admin/users/list.html'
  })
  .state('admin.users.id', {
    url: '/:id',
    templateUrl: '/views/admin/users/id.html'
  });
});

app.run(($rootScope, $firebaseAuth) => {
  $rootScope.dataRef = new Firebase('https://parksurveys.firebaseio.com/');
  $rootScope.authRef = $firebaseAuth($rootScope.dataRef);
  $rootScope.authData = $rootScope.authRef.$getAuth();
});
angular.module('parksurveys').directive('authorisation', () => {
    "use strict";
    return {
        restrict: 'E',
        //transclude: true,
        templateUrl: '/scripts/directives/authorisation/authorisation.html',
        scope: true,
        controller: ($scope) => {
            var ctrl = this;


            $scope.state = 'authorisation';
        },
        controllerAs: 'authCtrl',
        bindToController: true
    };
});
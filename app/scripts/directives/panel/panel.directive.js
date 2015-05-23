angular.module('parksurveys').directive('panel', () => {
    "use strict";
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: '/scripts/directives/panel/panel.html'

    };
});
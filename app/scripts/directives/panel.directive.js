angular.module('parksurveys').directive('panel', () => {
    return {
        restrict: 'E',
        transclude: true,
        templateUrl: '/scripts/directives/panel.html'

    };
});
'use strict';

angular.module('parksurveys').filter('floor', () => {
  return (input) => {
    return Math.floor(input);
  }
});
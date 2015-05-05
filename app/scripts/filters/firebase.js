'use strict';

angular.module('parksurveys').filter('firebaseFilter', () => {
  return (allValues, localValues, reverse) => {
    if(allValues && localValues) {
      let values = [];
      let filtered = [];
      let localKeys = Object.keys(localValues);

      localKeys.forEach((item) => {
        values.push(localValues[item]);
      });

      allValues.filter((el) => {
        const index = values.indexOf(el.$id);

        if(!reverse) {
          if(index !== -1) {
            for (var i = 0; i < localKeys.length; i++) {
              if(localValues[localKeys[i]] === el.$id) {
                el.localId = localKeys[i];
              }
            }

            filtered.push(el);
          }
        } else {
          if(index === -1) {
            filtered.push(el);
          }
        }
      });

      return filtered;
    }
  };
});
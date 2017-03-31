'use strict';

angular.module('saintApp')
  .filter('unique', function() {
    return function (arr, field) {
      return _.uniq(arr, function(a) { return a[field]; });
    };
  });

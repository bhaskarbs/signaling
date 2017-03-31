'use strict';
angular.module('saintApp')
  .directive('filterDirective', function () {
    return {
      restrict:'AE',
      templateUrl: 'views/private/reports-library/filter-sort-panel/directive/filter-directive.html'
    };
  });

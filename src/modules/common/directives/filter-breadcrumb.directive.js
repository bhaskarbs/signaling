'use strict';
angular.module('saintApp')
  .directive('filterBreadcrumb', [function () {
    return {
      scope: {
        context: '@'
      },
      controller: '@',
      name: 'controllerName',
      templateUrl: 'views/private/reports-library/filter-breadcrumbs/filter-breadcrumbs.html'
    };
  }]);

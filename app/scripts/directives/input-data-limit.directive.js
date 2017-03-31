'use strict';
/**
 * Created by vrevanna on 2/17/2016.
 */
angular.module('saintApp')
  .directive('limitTo', [ function() {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {
        var limit = parseInt(attrs.limitTo);
        angular.element(elem).on('keydown', function() {
          if (this.value.length === limit) {
            return false;
          }
        });
      }
    };
  }]);

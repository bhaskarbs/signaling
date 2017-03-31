/**
 * Created by ankitsrivastava6 on 3/17/2016.
 */
'use strict';
angular.module('saintApp').directive('onFinishRender', function () {
    return {
      restrict: 'A',
      link: function (scope) {
        if (scope.$last === true) {
            scope.$emit('ngRepeatFinished');
        }
      }
    };
  });

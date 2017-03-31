'use strict';
angular.module('saintApp')
  .directive('stickyHeader', ['$window', function ($window) {
    var $windowElement = angular.element($window); // wrap window object as jQuery object
    return {
      restrict: 'A',
      scope: {
        minHeight: '='
      },
      compile: function () {
        return {
          'post': function (scope, element, attributes) {
            var stickyHeaderClass = attributes.stickyHeader; // get CSS class from directive's attribute value
            var stickyOwnClass = 'sticky-header-ui';
            var offsetTop, minHeightToAttachSticky = scope.minHeight;
            $(element).addClass(stickyOwnClass);
            $windowElement.on('scroll', function () {
              offsetTop = element.offset().top;
              if (offsetTop <= minHeightToAttachSticky) {
                offsetTop = minHeightToAttachSticky;
              }
              if ($windowElement.scrollTop() >= offsetTop) {
                if (!$(element).hasClass(stickyHeaderClass)) {
                  $('.' + stickyOwnClass).removeClass(stickyHeaderClass);
                  $(element).addClass(stickyHeaderClass);
                }
              }else if($windowElement.scrollTop()===0){
                $(element).removeClass(stickyHeaderClass);
              }
            });
          }
        };
      }
    };
  }]);

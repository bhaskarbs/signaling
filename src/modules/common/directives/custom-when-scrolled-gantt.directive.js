'use strict';
angular.module('saintApp').directive('customWhenScrolledGantt', function() {
      return {
        link: function(scope, elm) {
          var raw = elm[0];
          elm.bind('scroll', function() {
            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
              scope.$parent.loadNextRows();
            }
            scope.$parent.hidePopover();
          });
    }};
  });

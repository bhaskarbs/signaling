'use strict';
angular.module('saintApp')
  .directive('onReadFile',['$parse',function ($parse) {
  return {
    restrict: 'A',
    scope: false,
    link: function(scope, element, attrs) {
      var fn = $parse(attrs.onReadFile);
      element.on('change', function(onChangeEvent) {
        var reader = new FileReader();
        reader.onload = function(onLoadEvent) {
          scope.$apply(function() {
            fn(scope, {$fileContent:onLoadEvent.target.result,fileName:onChangeEvent.target.files[0].name});
          });
          element.val(null);
        };
        reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0]);
      });
    }
  };
}]);


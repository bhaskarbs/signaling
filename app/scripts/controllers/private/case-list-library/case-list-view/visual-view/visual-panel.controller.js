'use strict';
angular.module('saintApp').controller('VisualPanelController', ['$http', '$scope', function($http, $scope) {
  $scope.isSortedByValue=0;
  $scope.isSortedByAlpha=1;

  $scope.fnTriggerSort = function (query, dimension) {
    var sortedData = $scope.data;
      if(query==='name'){
        $scope.isSortedByValue=0;
        switch($scope.isSortedByAlpha){
          case 0: sortedData = _.sortBy(sortedData, function(d) { return d.name; });
            $scope.isSortedByAlpha++;
            break;
          case 1:	sortedData = _.sortBy(sortedData, function(d) { return d.name; }).reverse();
            $scope.isSortedByAlpha++;
            break;
          case 2: sortedData = _.sortBy(sortedData, function(d) { return d.name; });
            $scope.isSortedByAlpha=1;
            break;

        }
      }
      else if(query==='value'){
        $scope.isSortedByAlpha=0;
        switch($scope.isSortedByValue){
          case 0: sortedData = _.sortBy(sortedData, function(d) { return d.value; });
            $scope.isSortedByValue++;
            break;
          case 1:	sortedData = _.sortBy(sortedData, function(d) { return d.value; }).reverse();
            $scope.isSortedByValue++;
            break;
          case 2: sortedData = _.sortBy(sortedData, function(d) { return d.value; });
            $scope.isSortedByValue=1;
            break;

        }
      }
    $scope.$broadcast('SORT_TRIGGER_EVENT',{sortedData: sortedData, dimension: dimension});
  };
}]);

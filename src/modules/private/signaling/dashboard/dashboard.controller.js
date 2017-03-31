'use strict';

angular.module('saintApp')
  .controller('DashboardSignalingController', ['$scope', '$state', function (scope, $state) {
    scope.statusCount = {
      validation:20,
      assessment:10,
      action:5,
      assigned: 0
    }
    scope.selectedGoto = 1;
    scope.goto = [
      {
        id:1,
        value:'Detection Configuration',
        url:''
      },
      {
        id:2,
        value:'Signal Library',
        url:''
      },
      {
        id:3,
        value:'Report Library',
        url:''
      },
      {
        id:4,
        value:'Anaytic Library',
        url:''
      }
    ];
    scope.gotoPage = function() {
      $state.go('signaling.validation');
    };
    scope.fnFormatCount = function (number) {
      if (number) {
        number = parseInt(number);
        if (isNaN(number)) {
          number = 0;
        }
        if (number > 9 && number < 100) {
          return '&nbsp;'+number+'&nbsp;';
        } else if(number <= 9){
          return '&nbsp;&nbsp;' + number + '&nbsp;&nbsp;';
        }else {
          return number;
        }
      } else {
        return '&nbsp;&nbsp;0&nbsp;&nbsp;';
      }
    };
  }]);

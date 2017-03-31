'use strict';
angular.module('saintApp').directive('selectableDropdown',[ function () {
  return {
    restrict: 'A',
    require: 'i18n',
    scope: {
      'value': '=',
      'values': '=',
      'default': '=',
      'status': '=',
      'indicator': '=',
      'updateStatus': '&',
      'changeColorStatus': '&',
      'disabled':'@'
    },
    template: '<div class="btn-group"> <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-ng-disabled="disabled"><span data-ng-if="preSelectedClass"><span data-ng-class="preSelectedClass && preSelectedClass || \'\'"></span>&nbsp;</span><span data-ng-if="status" data-ng-class="indicator"></span> <div class="dsui-report-status-drop-down pull-left" data-ng-bind="fnGetDisplayValue()" "></div>&nbsp;<div data-ng-class="postSelectedClass && postSelectedClass || \'\'"></div> </button> <ul class="dropdown-menu dsui-status-dropdown"> <li data-ng-repeat="currentValue in values"><a href data-ng-click="fnSetNewValue(currentValue)"><span class="fa fa-circle" data-ng-class="currentValue.colorIndicator"></span><span data-ng-if="currentValue.preIconClass"><span data-ng-class="currentValue.preIconClass && currentValue.preIconClass || \'\'"></span>&nbsp;</span><span class="dsui-status-list" data-ng-bind="currentValue.value"></span><span data-ng-if="currentValue.postIconClass">&nbsp;<span data-ng-class="currentValue.postIconClass && currentValue.postIconClass || \'\'"></span></span></a> </li> </ul> </div>',
    controller: ['$scope', function (scope) {
      scope.selectedValue = angular.copy(scope.default);
      scope.preSelectedClass = '';
      scope.postSelectedClass = 'caret';
      scope.value = null;
      scope.validate = undefined;
      scope.disabled = false;
      scope.fnGetSelectedValue = function () {
        if (scope.value) {
          if (scope.value.value) {
            scope.selectedValue = angular.copy(scope.value.value);
            scope.preSelectedClass = null;
            scope.postSelectedClass = null;
          }
          if (scope.value.hasOwnProperty('preIconClass')) {
            if (scope.value.preIconClass) {
              scope.preSelectedClass = angular.copy(scope.value.preIconClass);
            }
          }
          if (scope.value.hasOwnProperty('postIconClass')) {
            if (scope.value.postIconClass) {
              scope.postSelectedClass = angular.copy(scope.value.postIconClass);
            }
          } else {
            scope.postSelectedClass = 'caret';
          }
        } else {
          scope.selectedValue = angular.copy(scope.default);
          scope.preSelectedClass = '';
          scope.postSelectedClass = 'caret';
        }
      };
      scope.fnGetDisplayValue = function () {
        return scope.selectedValue;
      };
      scope.fnSetNewValue = function (currentValue) {
        scope.value = currentValue;
        scope.validate = scope.updateStatus(scope.value);
      };
      scope.$watch('default', function (newValue) {
       scope.selectedValue=newValue;
      },true);
      scope.$watch('value', function (newValue) {
        if(scope.validate === false){
          return false;
        }
        if (newValue) {
          scope.value = newValue;
          scope.fnGetSelectedValue();
        }
      },true);
    }]
  };
}]);

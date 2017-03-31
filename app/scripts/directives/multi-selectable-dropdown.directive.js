'use strict';
angular.module('saintApp')
  .directive('multiSelect',[ '$timeout', function ($timeout) {
    return {
      restrict: 'A',
      require : ['^ngModel'],
      scope: {
        list: '=',
        search: '=',
        placeholder: '@',
        closeText: '@',
        searchPlaceholder: '@',
        truncateLength: '=',
        truncateString: '@'
      },
      template: '<span class="btn-group" data-ng-class="isDropDownOpen && isDropDownOpen || \'\'"> <button class="btn btn-default" type="button" data-ng-click="fnToggleDropdown()"> <span data-ng-bind="fnGetSelectedValueString()"></span>&nbsp;<span class="caret"></span> </button> <div class="dropdown-menu" style="padding: 0.8em;"> <div data-ng-show="search" class="input-group"> <span class="input-group-addon" id="dsuiGlobalSearch" style="background-color:#fff !important;"> <span class="glyphicon glyphicon-search"></span> </span> <input class="form-control" type="text" data-ng-model="searchBoxText.$" placeholder="{{searchPlaceholder}}" aria-describedby="dsuiGlobalSearch" style="padding-left: 0px; border-left: 0px; box-shadow: none;border-color: #ccc !important;"/> </div> <p class="clearfix"/> <p data-ng-bind="placeholder" style="margin-bottom: 0px; color: #999;"></p> <ul style="height: 100px;overflow-y: auto;list-style: none;padding:0px;"> <li data-ng-repeat="item in list | filter:searchBoxText"> <label class="checkbox"> <input type="checkbox" data-ng-model="item.isSelected"/><span data-ng-bind="item.text"></span> </label> </li> </ul> <div class="text-right"> <button class="btn btn-default" type="button" data-ng-click="fnToggleDropdown()" style="padding: 0.01em 0.4em;" data-ng-bind="closeText"></button> </div> </div> </span>',
      link : function(scope, element, attributes, controllers){
        var ngModelController = controllers[0];
        scope.$watch('list', function (newList) {
          if (newList && newList.length > 0) {
            scope.list=newList;
            scope.fnUpdateNewValues(scope.fnGetKeys(scope.value));
          }else{
            scope.list = [];
          }
        });

        scope.$watch('value',function(modelNewvalue){
          ngModelController.$setViewValue(scope.fnGetKeys(modelNewvalue));
        });

        ngModelController.$formatters.push(function(modelValue){
          scope.fnUpdateNewValues(modelValue);
        });
      },
      controller: ['$scope', 'ConstantService', function (scope, ConstantService) {
        scope.isDropDownOpen = null;
        scope.searchBoxText = null;
        scope.timerPromise=null;
        scope.closeText=null;
        scope.fnGetSelectedObjects = function () {
          var tempList = scope.list.filter(function (item) {
            return item.isSelected && item.isSelected === true;
          });
          return tempList;
        };
        scope.fnGetSelectedValueString = function () {
          var temp = scope.fnGetSelectedObjects();
          if (temp && temp.length > 0) {
            temp = temp.map(function (data) {
              return data.text;
            });
            temp = temp.join(',');
            var stringLength = parseInt(scope.truncateLength);
            stringLength = stringLength>10 ? stringLength : 10;
            temp = temp.substring(0, stringLength) + (scope.truncateString ? scope.truncateString : '');
          } else {
            temp = scope.placeholder;
          }
          return temp;
        };
        scope.fnGetKeys = function (valueData) {
          var temp = [];
          if (valueData) {
            temp = valueData.map(function (data) {
              return data.id;
            });
          }
          return temp;
        };
        scope.fnUpdateNewValues = function (newData) {
          scope.list.forEach(function (data) {
            data.isSelected = false;
            if (newData && newData.indexOf(data.id) > -1) {
              data.isSelected = true;
            }
          });
          scope.value = scope.fnGetSelectedObjects();
        };
        scope.fnSetTimer=function(){
          scope.timerPromise=$timeout(function(){
            scope.fnToggleDropdown();
          },10000);
        };
        scope.fnClearTimer=function(){
          if(scope.timerPromise){
            $timeout.cancel(scope.timerPromise);
            scope.timerPromise=null;
          }
        };
        scope.fnToggleDropdown = function () {
          scope.searchBoxText = null;
          scope.value = scope.fnGetSelectedObjects();
          scope.isDropDownOpen = scope.isDropDownOpen===ConstantService.OPENCLASS? '' : ConstantService.OPENCLASS;
        };
      }]
    };
  }]);

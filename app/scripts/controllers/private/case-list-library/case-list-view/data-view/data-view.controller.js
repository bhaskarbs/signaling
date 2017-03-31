'use strict';
/**
 * @ngdoc function
 * @name saintApp.controller.auth:caselist:DataViewController
 * @description
 * # DataViewController
 * Controller of the saintApp
 */
angular.module('saintApp')
  .controller('DataViewController', ['$scope', 'DataViewFactory', 'LanguageService', 'alertService', '$stateParams', '$filter', function (scope, DataViewFactory, LanguageService, AlertService, stateParams, $filter) {
    scope.fnInit = function () {
      scope.attributeName = 'dimensionName';
      scope.groups = { 'A': [], 'B': [], 'C': [], 'D': [], 'E': [], 'F': [], 'G': [], 'H': [], 'I': [], 'J': [], 'K': [], 'L': [], 'M': [], 'N': [], 'O': [], 'P': [], 'Q': [], 'R': [], 'S': [], 'T': [], 'U': [], 'V': [], 'W': [], 'X': [], 'Y': [], 'Z': [], '#': []};
      scope.dataViewsObject = null;
      scope.selectedDataViewsObj = [];
      scope.dimensionGroupObj = [];
      // string varable to keep the current selected group, Empty string in case of All  and null incase of Selected
      scope.selectedGroup = null;
      // boolean variable to check if its selected group or not
      scope.isSelectedGroup = true;
      scope.selectDataView = false;
      scope.fnGetSelectedList();
      scope.previouslySelectedDataViews = [];
    };
    scope.fnModifyDataForGrouping = function (source, destination) {
      source = $filter('orderBy')(source, scope.attributeName);
      source.forEach(function (tempData) {
        if (tempData[scope.attributeName]) {
          var dimensionName = tempData[scope.attributeName];
          var firstCharacter = dimensionName.substr(0, 1).toUpperCase();
          if (scope.groups.hasOwnProperty(firstCharacter)) {
            destination[firstCharacter].push(tempData);
          } else {
            destination['#'].push(tempData);
          }
        } else {
          destination['#'].push(tempData);
        }
      });
      return destination;
    };
    /**
     * This function is to call another function which is in the parent controller(fnBroadcast)
     */
    scope.fnApplyDataViews = function () {
      var length = scope.selectedDataViewsObj.length;
      if (length > 0 && length <= 20) {
        var previouslySelectedDataViews = _.pluck(scope.previouslySelectedDataViews, 'configKey');
        var afterSelectedDataViews = _.pluck(scope.selectedDataViewsObj, 'configKey');
        if (!(_.isEqual(previouslySelectedDataViews, afterSelectedDataViews))) {
          DataViewFactory.saveSelectedDataViews(scope.selectedDataViewsObj, parseInt(stateParams.id)).then(
            function () {
              scope.fnBroadcastDataViews();
              scope.closeDataViews();
            }
          );
        } else {
          scope.closeDataViews();
          AlertService.warn(LanguageService.MESSAGES.DATA_VIEW_NO_CHANGES);
        }
      } else {
        var messageToDisplay = length === 0 ? LanguageService.MESSAGES.MINIMUM_NUMBER_DATA_VIEWS : LanguageService.MESSAGES.MAXIMUM_NUMBER_DATA_VIEWS;
        AlertService.warn(messageToDisplay);
      }
    };
    scope.fnCancelDataViews = function () {
      var previouslySelectedDataViews = _.pluck(scope.previouslySelectedDataViews, 'configKey');
      var afterSelectedDataViews = _.pluck(scope.selectedDataViewsObj, 'configKey');
      if (!(_.isEqual(previouslySelectedDataViews, afterSelectedDataViews))) {
        angular.element('#data-view-cancel-modal').modal({backdrop: 'static', keyboard: false});
      } else {
        scope.closeDataViews();
      }
    };
    scope.fnGetSelectedList = function () {
      DataViewFactory.fnGetSelectedListData(parseInt(stateParams.id)).then(
        function (result) {
          if (result.data) {
            scope.dataViewsObject = scope.fnModifyDataForGrouping(result.data, angular.copy(scope.groups));
            var dimensionGroupObj = [];
            result.data.forEach(function (object) {
              if (object.isSelected) {
                scope.selectedDataViewsObj.push(object);
              }
              var existingObject = _.findWhere(dimensionGroupObj, {'dimensionGroup': object.dimensionGroup});
              if (existingObject) {
                var index = dimensionGroupObj.findIndex(function (existingObj) {
                  return existingObj.dimensionGroup === object.dimensionGroup;
                });
                if (object.isSelected) {
                  dimensionGroupObj[index].selectedCount = dimensionGroupObj[index].selectedCount + 1;
                }
              } else {
                var tempObj = {};
                tempObj.dimensionGroup = object.dimensionGroup;
                tempObj.selectedCount = object.isSelected ? 1 : 0;
                dimensionGroupObj.push(tempObj);
              }
            });
            scope.dimensionGroupObj = dimensionGroupObj;
            scope.previouslySelectedDataViews = angular.copy(scope.selectedDataViewsObj);
          } else {
            scope.dataViewsObject = null;
            scope.previouslySelectedDataViews = null;
          }
        }
      );
    };
    /**
     *
     * @param groupName groupname of the selected group, empty in case of ALL and SELECTED tab
     * @param isSelectedGroup true only if Selected tab is acive else false always, Bydefault its true
     */
    scope.fnGetGroupDimensions = function (groupName, isSelectedGroup) {
      var divElement = document.getElementById('data-view-list');
      divElement.scrollTop = 0;
      scope.isSelectedGroup = isSelectedGroup;
      scope.selectedGroup = groupName;
    };
    scope.fnSelectDataView = function (object) {
      object.isSelected = object.isSelected ? 0 : 1;
      var index = scope.dimensionGroupObj.findIndex(function (existingObj) {
        return existingObj.dimensionGroup === object.dimensionGroup;
      });
      scope.dimensionGroupObj[index].selectedCount = object.isSelected ? (scope.dimensionGroupObj[index].selectedCount = scope.dimensionGroupObj[index].selectedCount + 1) : (scope.dimensionGroupObj[index].selectedCount = scope.dimensionGroupObj[index].selectedCount - 1);
      if (!object.isSelected) {
        var temp = scope.selectedDataViewsObj.findIndex(function (existingObj) {
          return existingObj.dimensionId === object.dimensionId;
        });
        scope.selectedDataViewsObj.splice(temp, 1);
      } else {
        scope.selectedDataViewsObj.push(object);
      }
    };
    /**
     * This function is used when user clicks clear all selection from UI, All counts are being reset to 0
     */
    scope.fnClearSelection = function () {
      for (var i = 0; i < scope.selectedDataViewsObj.length; i++) {
        scope.selectedDataViewsObj[i].isSelected = 0;
      }
      for (var j = 0; j < scope.dimensionGroupObj.length; j++) {
        scope.dimensionGroupObj[j].selectedCount = 0;
      }
      scope.selectedDataViewsObj = [];
    };
    scope.fnInit();
  }]);

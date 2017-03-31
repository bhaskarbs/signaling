'use strict';
angular.module('saintApp')
  .controller('ListTagController', ['$scope', 'CaseFactory', function (scope, CaseFactory) {
    scope.listTagData = {'allTags': [], 'selected': CaseFactory.data.tagSelected};
    scope.fnIdentifyTagExists = function (tag) {
      var status = false;
      var totalList = angular.copy(scope.listTagData.selected);
      var currentTag = '' + tag.tagKey + tag.tagType;
      totalList = totalList.map(function (tempTag) {
        return '' + tempTag.tagKey + tempTag.tagType;
      });
      totalList = totalList.filter(function (tempTag) {
        return tempTag === currentTag;
      });
      if (totalList.length > 0) {
        status = true;
      }
      return status;
    };
    scope.fnAddSelected = function (tag) {
      if (scope.listTagData.selected.length===0 || !scope.fnIdentifyTagExists(tag)) {
        scope.listTagData.selected.push(tag);
      }
    };
    scope.fnInit = function () {
      CaseFactory.getAllTags().then(function (result) {
        if (result.data) {
          scope.listTagData.allTags = result.data;
          CaseFactory.getSelectedCases(scope.listTagData.selected, scope.listTagData.allTags);
        }
      });
    };
    scope.$on('$destroy', function () {
      CaseFactory.data.tagSelected = [];
    });
    scope.fnInit();
  }]);

'use strict';
angular.module('saintApp')
  .directive('breadcrumbs', [function () {
    return {
      template: '<span data-ng-repeat="tag in list" class="btn btn-default dsui-button-2" data-ng-class="!$first && \'dsui-align-crumbs\'"><span data-ng-bind="fnGetTagName(tag)"></span><span data-ng-click="fnRemoveIndexTag($index)" class="fa fa-times-circle dsui-align-fa-icon"></span></span>',
      scope: {
        list: '=',
        key: '@'
      },
      link: function (scope) {
        scope.fnGetTagName = function (tag) {
          try {
            if (scope.key && tag && typeof tag === 'object') {
              return tag[scope.key];
            } else {
              return tag;
            }
          } catch (e) {
            return tag;
          }
        };
        scope.fnRemoveIndexTag = function (index) {
          scope.list.splice(index, 1);
        };
      }
    };
  }]);

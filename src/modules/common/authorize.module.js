'use strict';
angular.module('saint-authorize', [])
  .provider('AuthorizeService', [function () {
    var _options={
      privileges:[]
    };
    return {
      'setOptions':function(options){
        if (options) {
          if (options.hasOwnProperty('privileges')) {
            _options.privileges = options.privileges||[];
          }
        }
      },
      '$get': function () {
        var authorize = function (data) {
          angular.extend(this, data);
        };
        authorize.data = {
          privileges: _options.privileges
        };
        authorize.decorator = {};
        authorize.hasPrivilege = function (privilege) {
          try{
            return authorize.data.privileges.indexOf(privilege) > -1;
          }catch(e){
            return false;
          }
        };
        authorize.decorator.click = function (privilegeName, handler, parametersAsArray) {
          var status = authorize.hasPrivilege(privilegeName);
          if (status) {
            if(handler instanceof Function){
              return handler.apply(this, parametersAsArray);
            }
          }
        };
        authorize.decorator.show = function (privilegeName, handler, parametersAsArray) {
          var status = authorize.hasPrivilege(privilegeName);
          if (status) {
            if(handler instanceof Function){
              return handler.apply(this, parametersAsArray);
            } else {
              return handler;
            }
          } else {
            return false;
          }
        };
        authorize.decorator.hide = function (privilegeName, handler, parametersAsArray) {
          var status = authorize.hasPrivilege(privilegeName);
          if (status) {
            if(handler instanceof Function){
              return handler.apply(this, parametersAsArray);
            } else {
              return handler;
            }
          } else {
            return true;
          }
        };
        authorize.decorator.disabled = function (privilegeName, handler, parametersAsArray) {
          var status = authorize.hasPrivilege(privilegeName);
          if (status) {
            if(handler instanceof Function){
              return handler.apply(this, parametersAsArray);
            } else {
              return handler;
            }
          } else {
            return true;
          }
        };
        return authorize;
      }
    };
  }])
  .filter('authorize', ['AuthorizeService', function (AuthorizeService) {
    return function (text, privilege) {
      var status = AuthorizeService.hasPrivilege(privilege);
      return status ? text : '';
    };
  }])
  .directive('authorize', [function () {
    return {
      restrict: 'A',
      priority: 2000,
      scope: '=',
      link: function (scope, element, attrs) {
        scope.fnRemoveElement = function () {
          var status = scope.fnEvaluateStatus(attrs.authorize);
          if (status === false) {
            $(element).remove();
          }
        };
        scope.fnRemoveElement();
      },
      controller: ['$scope', 'AuthorizeService', function (scope, AuthorizeService) {
        scope.fnEvaluateStatus = function (privilege) {
          return AuthorizeService.hasPrivilege(privilege);
        };
      }]
    };
  }]);

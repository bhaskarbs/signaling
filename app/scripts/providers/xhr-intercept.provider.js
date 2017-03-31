'use strict';
angular.module('saintApp').provider('XHRIntercept', [function () {
  var _options = {
    'Environment':null
  };
  return {
    'setOptions': function (options) {
      if (options) {
        if (options.hasOwnProperty('Environment')) {
          _options.Environment = options.Environment;
        }
      }
    },
    'isSessionValid': function () {
      return function () {
        return {
          'response': function (response) {
            /* The if logic is to validate the Backend Hana calls from the Saint Portal
               which are using $http service, will not return json and should have status 200
            * */
            if ((response.status === 201 || response.status === 200) && response.config.url.indexOf(_options.Environment.backendHanaContext) > -1 && !angular.isObject(response.data)) {
              window.location.reload(true);
            }
            //FIXME If condition commented due to redirection on http post call.
            return response;
          }
        };
      };
    },
    '$get': function () {
    }
  };
}]);

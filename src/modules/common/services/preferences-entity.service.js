'use strict';
angular.module('saintApp').service('PreferencesEntity', [function () {
  return {
    'userId': null,
    'persistedKey': null,
    'persistedValue': null,
    'userScreenName': null,
    'isSessionBased':null
  };

}]);


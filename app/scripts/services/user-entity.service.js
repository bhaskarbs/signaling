'use strict';
angular.module('saintApp')
  .service('UserEntity', [function () {
  return {
    'name': '',
    'userId': '',
    'userName': '',
    'email': '',
    'firstName': '',
    'lastName': '',
    'roles' : [],
    'boeToken' : null,
    'groupKey': null
  };
}]);


//XXX if any new property is added please update in UserService.createUserObject

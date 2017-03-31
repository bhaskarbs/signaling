'use strict';
angular.module('saintApp').filter('userGroupFormatter', ['ConstantService', function (ConstantService) {
  return function (user) {
    if (user.type === ConstantService.GROUP_ENTITY) {
      return user.name + ' (' + user.count + ' Users) ';
    } else {
      return user.name;
    }
  };
}]);

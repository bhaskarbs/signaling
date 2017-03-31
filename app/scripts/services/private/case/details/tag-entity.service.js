'use strict';
angular.module('saintApp')
  .service('TagEntity', [function () {
    return {
      'tagId': null,
      'tagName': null,
      'tagKey': null,
      'tagType': null
    };
  }]);

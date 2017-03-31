'use strict';
angular.module('saintApp').service('QueryEntity',[ function () {
  return {
    'queryId': null,
    'queryName': null,
    'queryDesc': null,
    'createdBy': null,
    'lastEditedDate': null,
    'isShared': null,
    'filterName': null,
    'configKey': null,
    'searchActive': null,
    'filterType': null,
    'columnName': null,
    'contents': [],
    'active':null,
    'descSearch':null,
    'setQueries':null,
    'secondarySort': null
  };
}]);

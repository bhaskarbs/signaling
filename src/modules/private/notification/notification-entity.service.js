'use strict';
angular.module('saintApp').service('NotificationEntity', [function () {
  return {
    'notificationGroupKey':null,
    'notificationGroupName':null,
    'notificationConfigKey':null,
    'notificationConfigName':null,
    'objectName':null,
    'assignedBy':null,
    'createdOn':null,
    'DOM':null
  };
}]);

'use strict';
describe('NotificationEntity Entity', function () {
  var NotificationEntity;
  beforeEach(function () {
    module('saintApp');
    inject(function ($injector) {
      NotificationEntity = $injector.get('NotificationEntity');
    });
  });
  it('should exists', function () {
    expect(NotificationEntity).toBeDefined();
  });
  it('should have these keys', function () {
    expect(NotificationEntity.hasOwnProperty('notificationGroupKey')).toBeTruthy();
    expect(NotificationEntity.hasOwnProperty('notificationGroupName')).toBeTruthy();
    expect(NotificationEntity.hasOwnProperty('notificationConfigKey')).toBeTruthy();
    expect(NotificationEntity.hasOwnProperty('notificationConfigName')).toBeTruthy();
    expect(NotificationEntity.hasOwnProperty('objectName')).toBeTruthy();
    expect(NotificationEntity.hasOwnProperty('assignedBy')).toBeTruthy();
    expect(NotificationEntity.hasOwnProperty('createdOn')).toBeTruthy();
    expect(NotificationEntity.hasOwnProperty('DOM')).toBeTruthy();
  });
});

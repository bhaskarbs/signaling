'use strict';
describe('UserEntity Entity', function () {
  var UserEntity;
  beforeEach(function () {
    module('saintApp');
    inject(function ($injector) {
      UserEntity = $injector.get('UserEntity');
    });
  });
  it('should exists', function () {
    expect(UserEntity).toBeDefined();
  });
  it('should have these keys', function () {
    expect(UserEntity.hasOwnProperty('name')).toBeTruthy();
    expect(UserEntity.hasOwnProperty('userId')).toBeTruthy();
    expect(UserEntity.hasOwnProperty('userName')).toBeTruthy();
    expect(UserEntity.hasOwnProperty('email')).toBeTruthy();
    expect(UserEntity.hasOwnProperty('firstName')).toBeTruthy();
    expect(UserEntity.hasOwnProperty('lastName')).toBeTruthy();
    expect(UserEntity.hasOwnProperty('boeToken')).toBeTruthy();
    expect(UserEntity.hasOwnProperty('roles')).toBeTruthy();
  });
  it('should have these many keys', function () {
    expect(Object.keys(UserEntity).length).toEqual(9);
  });
});


'use strict';
describe('PreferencesEntity Entity', function () {
  var PreferencesEntity;
  beforeEach(function () {
    module('saintApp');
    inject(function ($injector) {
      PreferencesEntity = $injector.get('PreferencesEntity');
    });
  });
  it('should exists', function () {
    expect(PreferencesEntity).toBeDefined();
  });
  it('should have these keys', function () {
    expect(PreferencesEntity.hasOwnProperty('userId')).toBeTruthy();
    expect(PreferencesEntity.hasOwnProperty('persistedKey')).toBeTruthy();
    expect(PreferencesEntity.hasOwnProperty('persistedValue')).toBeTruthy();
    expect(PreferencesEntity.hasOwnProperty('userScreenName')).toBeTruthy();
    expect(PreferencesEntity.hasOwnProperty('isSessionBased')).toBeTruthy();
  });
  it('should have these many keys', function () {
    expect(Object.keys(PreferencesEntity).length).toEqual(5);
  });
});


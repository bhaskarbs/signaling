'use strict';
describe('LicenseEntity Entity', function () {
  var LicenseEntity;
  beforeEach(function () {
    module('saintApp');
    inject(function ($injector) {
      LicenseEntity = $injector.get('LicenseEntity');
    });
  });
  it('should exists', function () {
    expect(LicenseEntity).toBeDefined();
  });
  it('should have these keys', function () {
    expect(LicenseEntity.hasOwnProperty('licenseId')).toBeTruthy();
    expect(LicenseEntity.hasOwnProperty('licenseName')).toBeTruthy();
  });
  it('should have these many keys', function () {
    expect(Object.keys(LicenseEntity).length).toEqual(2);
  });
});


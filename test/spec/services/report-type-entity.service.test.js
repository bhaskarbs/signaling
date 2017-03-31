'use strict';
describe('ReportTypeEntity Entity', function () {
  var ReportTypeEntity;
  beforeEach(function () {
    module('saintApp');
    inject(function ($injector) {
      ReportTypeEntity = $injector.get('ReportTypeEntity');
    });
  });
  it('should exists', function () {
    expect(ReportTypeEntity).toBeDefined();
  });
  it('should have these keys', function () {
    expect(ReportTypeEntity.hasOwnProperty('reportId')).toBeTruthy();
    expect(ReportTypeEntity.hasOwnProperty('reportKey')).toBeTruthy();
    expect(ReportTypeEntity.hasOwnProperty('reportType')).toBeTruthy();
    expect(ReportTypeEntity.hasOwnProperty('isSignalingEnabled')).toBeTruthy();
    expect(ReportTypeEntity.hasOwnProperty('description')).toBeTruthy();
  });
  it('should have these many keys', function () {
    expect(Object.keys(ReportTypeEntity).length).toEqual(5);
  });
});


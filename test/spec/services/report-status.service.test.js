'use strict';
describe('ReportStatusEntity Entity', function () {
  var ReportStatusEntity;
  beforeEach(function () {
    module('saintApp');
    inject(function ($injector) {
      ReportStatusEntity = $injector.get('ReportStatusEntity');
    });
  });
  it('should exists', function () {
    expect(ReportStatusEntity).toBeDefined();
  });
  it('should have these keys', function () {
    expect(ReportStatusEntity.hasOwnProperty('status')).toBeTruthy();
  });
  
  it('should have these many keys', function () {
    expect(Object.keys(ReportStatusEntity).length).toEqual(1);
  });
});

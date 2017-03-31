'use strict';
describe('SignalEntity Entity', function () {
  var SignalEntity;
  beforeEach(function () {
    module('saintApp');
    inject(function ($injector) {
      SignalEntity = $injector.get('SignalEntity');
    });
  });
  it('should exists', function () {
    expect(SignalEntity).toBeDefined();
  });
  it('should have these keys', function () {
    expect(SignalEntity.hasOwnProperty('comparatorStartDate')).toBeTruthy();
    expect(SignalEntity.hasOwnProperty('comparatorEndDate')).toBeTruthy();
    expect(SignalEntity.hasOwnProperty('cumulativeStartDate')).toBeTruthy();
    expect(SignalEntity.hasOwnProperty('cumulativeEndDate')).toBeTruthy();
    expect(SignalEntity.hasOwnProperty('threshold')).toBeTruthy();
    expect(SignalEntity.hasOwnProperty('denominatorType')).toBeTruthy();
    expect(SignalEntity.hasOwnProperty('denominatorValue')).toBeTruthy();
    expect(SignalEntity.hasOwnProperty('comparatorPeriod')).toBeTruthy();
  });
  it('should have these many keys', function () {
    expect(Object.keys(SignalEntity).length).toEqual(8);
  });
});


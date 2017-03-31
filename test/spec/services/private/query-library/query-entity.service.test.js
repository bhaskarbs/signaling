'use strict';
describe('QueryEntity Entity', function () {
  var QueryEntity;
  beforeEach(function () {
    module('saintApp');
    inject(function ($injector) {
      QueryEntity = $injector.get('QueryEntity');
    });
  });
  it('should exists', function () {
    expect(QueryEntity).toBeDefined();
  });
  it('should have these keys', function () {
    expect(QueryEntity.hasOwnProperty('queryId')).toBeTruthy();
    expect(QueryEntity.hasOwnProperty('queryName')).toBeTruthy();
    expect(QueryEntity.hasOwnProperty('queryDesc')).toBeTruthy();
    expect(QueryEntity.hasOwnProperty('createdBy')).toBeTruthy();
    expect(QueryEntity.hasOwnProperty('lastEditedDate')).toBeTruthy();
    expect(QueryEntity.hasOwnProperty('isShared')).toBeTruthy();
    expect(QueryEntity.hasOwnProperty('filterName')).toBeTruthy();
    expect(QueryEntity.hasOwnProperty('configKey')).toBeTruthy();
    expect(QueryEntity.hasOwnProperty('searchActive')).toBeTruthy();
    expect(QueryEntity.hasOwnProperty('filterType')).toBeTruthy();
    expect(QueryEntity.hasOwnProperty('columnName')).toBeTruthy();
    expect(QueryEntity.hasOwnProperty('contents')).toBeTruthy();
    expect(QueryEntity.hasOwnProperty('active')).toBeTruthy();
    expect(QueryEntity.hasOwnProperty('descSearch')).toBeTruthy();
    expect(QueryEntity.hasOwnProperty('setQueries')).toBeTruthy();
    expect(QueryEntity.hasOwnProperty('secondarySort')).toBeTruthy();
  });
  it('should have these many keys', function () {
    expect(Object.keys(QueryEntity).length).toEqual(16);
  });
});


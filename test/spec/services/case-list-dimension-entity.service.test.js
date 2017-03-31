'use strict';
describe('CaseListDimensionEntity Entity', function () {
  var CaseListDimensionEntity;
  beforeEach(function () {
    module('saintApp');
    inject(function ($injector) {
      CaseListDimensionEntity = $injector.get('CaseListDimensionEntity');
    });
  });
  it('Should exists', function () {
    expect(CaseListDimensionEntity).toBeDefined();
  });
  
  it('Should have these keys', function () {
    expect(CaseListDimensionEntity.hasOwnProperty('dimensionId')).toBeTruthy();
    expect(CaseListDimensionEntity.hasOwnProperty('dimensionValue')).toBeTruthy();
    expect(CaseListDimensionEntity.hasOwnProperty('dimensionKey')).toBeTruthy();
    expect(CaseListDimensionEntity.hasOwnProperty('dimensionValues')).toBeTruthy();
    expect(CaseListDimensionEntity.hasOwnProperty('dimensionContainerLength')).toBeTruthy();
    expect(CaseListDimensionEntity.hasOwnProperty('bclKey')).toBeTruthy();
    expect(CaseListDimensionEntity.hasOwnProperty('dimensionGroup')).toBeTruthy();
    expect(CaseListDimensionEntity.hasOwnProperty('dimensionName')).toBeTruthy();
    expect(CaseListDimensionEntity.hasOwnProperty('configKey')).toBeTruthy();
    expect(CaseListDimensionEntity.hasOwnProperty('isSelected')).toBeTruthy();
  
  });
  
  it('should have these many keys', function () {
    expect(Object.keys(CaseListDimensionEntity).length).toEqual(10);
  });
});

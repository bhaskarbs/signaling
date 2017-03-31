'use strict';
describe('CaseListEntity Entity', function () {
  var CaseListEntity;
  beforeEach(function () {
    module('saintApp');
    inject(function ($injector) {
      CaseListEntity = $injector.get('CaseListEntity');
    });
  });
  it('should exists', function () {
    expect(CaseListEntity).toBeDefined();
  });
  it('should have these keys', function () {
    expect(CaseListEntity.hasOwnProperty('baseCaseListKey')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('caseListId')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('caseListName')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('finalQuery')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('description')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('reportType')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('ingredient')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('products')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('licenses')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('licenseKey')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('isFavorite')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('dataLockPoint')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('asOfDate')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('eventReceiptDate')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('initialReceiptDate')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('followupReceiptDate')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('caseSubmissionDate')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('reportingStartDate')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('reportingEndDate')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('cases')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('sourceFilter')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('analyticalFilter')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('sourceCasesCount')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('analyticalCasesCount')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('taskKey')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('queryCaseCriteria')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('creationDate')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('isLocked')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('caseListFilters')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('contents')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('selectedFilters')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('caseNumber')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('listed')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('added')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('removed')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('annotated')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('source')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('analytical')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('caseListSort')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('lastRun')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('lastSaved')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('saveFlag')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('payloadProduct')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('payloadLicense')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('queryFilterUI')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('sourceQueryUI')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('reportKey')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('caseListMode')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('visualQueryFilterUI')).toBeTruthy();
    expect(CaseListEntity.hasOwnProperty('isShared')).toBeTruthy();
  });
  it('should have these many keys', function () {
   expect(Object.keys(CaseListEntity).length).toEqual(84);
  });
});


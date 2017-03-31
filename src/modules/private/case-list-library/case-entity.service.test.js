'use strict';
describe('CaseEntity Entity', function () {
  var CaseEntity;
  beforeEach(function () {
    module('saintApp');
    inject(function ($injector) {
      CaseEntity = $injector.get('CaseEntity');
    });
  });
  it('should exists', function () {
    expect(CaseEntity).toBeDefined();
  });
  it('should have these keys', function () {
    expect(CaseEntity.hasOwnProperty('caseId')).toBeTruthy();
    expect(CaseEntity.hasOwnProperty('caseKey')).toBeTruthy();
    expect(CaseEntity.hasOwnProperty('initialReceiptDate')).toBeTruthy();
    expect(CaseEntity.hasOwnProperty('followupReceiptDate')).toBeTruthy();
    expect(CaseEntity.hasOwnProperty('eventReceiptDate')).toBeTruthy();
    expect(CaseEntity.hasOwnProperty('reportType')).toBeTruthy();
    expect(CaseEntity.hasOwnProperty('country')).toBeTruthy();
    expect(CaseEntity.hasOwnProperty('product')).toBeTruthy();
    expect(CaseEntity.hasOwnProperty('version')).toBeTruthy();
    expect(CaseEntity.hasOwnProperty('workflow')).toBeTruthy();
    expect(CaseEntity.hasOwnProperty('mfrControlNumber')).toBeTruthy();
    expect(CaseEntity.hasOwnProperty('countryOfOccurrence')).toBeTruthy();
    expect(CaseEntity.hasOwnProperty('studyId')).toBeTruthy();
    expect(CaseEntity.hasOwnProperty('patientId')).toBeTruthy();
    expect(CaseEntity.hasOwnProperty('patientInitials')).toBeTruthy();
    expect(CaseEntity.hasOwnProperty('patientSex')).toBeTruthy();
    expect(CaseEntity.hasOwnProperty('patientDOB')).toBeTruthy();
    expect(CaseEntity.hasOwnProperty('patientAge')).toBeTruthy();
    expect(CaseEntity.hasOwnProperty('caseSerious')).toBeTruthy();
    expect(CaseEntity.hasOwnProperty('caseListedness')).toBeTruthy();
    expect(CaseEntity.hasOwnProperty('caseCasuality')).toBeTruthy();
    expect(CaseEntity.hasOwnProperty('caseOutcome')).toBeTruthy();
    expect(CaseEntity.hasOwnProperty('suspectProducts')).toBeTruthy();
    expect(CaseEntity.hasOwnProperty('events')).toBeTruthy();
    expect(CaseEntity.hasOwnProperty('primaryOnsetDate')).toBeTruthy();
    expect(CaseEntity.hasOwnProperty('annotation')).toBeTruthy();
    expect(CaseEntity.hasOwnProperty('status')).toBeTruthy();
    expect(CaseEntity.hasOwnProperty('statusMessage')).toBeTruthy();
    expect(CaseEntity.hasOwnProperty('caseNarrative')).toBeTruthy();
    expect(CaseEntity.hasOwnProperty('submissionHistory')).toBeTruthy();
    expect(CaseEntity.hasOwnProperty('person')).toBeTruthy();
    expect(CaseEntity.hasOwnProperty('dateModified')).toBeTruthy();
    expect(CaseEntity.hasOwnProperty('reason')).toBeTruthy();
  });
  it('should have these many keys', function () {
    expect(Object.keys(CaseEntity).length).toEqual(33);
  });
});


'use strict';
angular.module('saintApp').service('CaseEntity',[ function () {
  return {
    'caseId': null,
    'caseKey': null,
    'initialReceiptDate': null,
    'followupReceiptDate': null,
    'eventReceiptDate': null,
    'reportType': null,
    'country': null,
    'product': null,
    'version': null,
    'workflow': null,
    'mfrControlNumber': null,
    'countryOfOccurrence': null,
    'studyId': null,
    'patientId': null,
    'patientInitials': null,
    'patientSex': null,
    'patientDOB': null,
    'patientAge': null,
    'caseSerious': null,
    'caseListedness': null,
    'caseCasuality': null,
    'caseOutcome': null,
    'suspectProducts': [],
    'events': [],
    'primaryOnsetDate': null,
    'annotation':null,
    'status': '',
    'statusMessage':'',
    'caseNarrative':'',
    'submissionHistory':[],
    'person':'',
    'dateModified':'',
    'reason':''

  };
}]);

'use strict';
angular.module('saintApp').service('ReportEntity',[ function () {
  return {
    'filterName': null,
    'active': null,
    'configKey': null,
    'filterType': null,
    'searchActive': null,
    'contents': [],
    'reportKey': null,
    'reportType': null,
    'reportPeriod': null,
    'submittedDate': null,
    'ingredient': null,
    'reportAsOfDateDetails': null,
    'licenseNumber': [],
    'licenseName': [],
    'reportMilestones': [],
    'caseList': [],
    'reportLicenses': [],
    'reportProducts': [],
    'reportIngredients': [],
    'reportIngredientsNames': [],
    'reportComparatorPeriod': null,
    'reportCumulativePeriod': null,
    'threshold': null,
    'denominator': null,
    'generateFinalDraftReport': null,
    'columnName': null,
    'reportId': null,
    'reportName': '',
    'reportCustomName': null,
    'reportDesc': '',
    'reportCreationDate': null,
    'reportDueDays': null,
    'reportStartDate': null,
    'reportEndDate': null,
    'reportStatus': '',
    'reportMode':'',
    'submissionDate': null,
    'groups': [],
    'users': [],
    'submissionRunDate': null,
    'submissionRunTime': null,
    'eventReceiptDate': null,
    'initialReceiptDate': null,
    'followReceiptDate': null,
    'iCSRSubmissionDate': null,
    'otherReceiptType': null,
    'nonSeriousListMedWatchReports': null,
    'includeCasesNotPreviouslyReported': null,
    'signal': [],
    'isBlinded': null,
    'baseCaseListName': '',
    'baseCaseListCustomName': '',
    'caseListDesc': '',
    'baseCaseListKey': null,
    'allDatesFlag': null,
    'routedDate': null,
    'caseCompletionDate': null,
    'reportUpdatedDate': null,
    'primarySort': null,
    'secondarySort': null,
    'cuid':null,
    'bclKey':null,
    'setQueryUI': null,
    'selectedUsersGroup': [],
    'reportOwner': null,
    'additionalReports':{},
    'isReportPackage' : null

  };
}]);

//users : collection of UserEntity
//reportType : ReportTypeEntity
// caseList : CaseListEntity
//signal : SignalEntity
//reportMilestones : MileStone Entity
//reportIngredients : IngredientEntity
//reportProducts : ProductEntity


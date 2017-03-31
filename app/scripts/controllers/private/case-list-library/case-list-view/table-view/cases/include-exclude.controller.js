'use strict';

/**
 * @ngdoc function
 * @name saintApp.controller.auth:IncludeExcludeController
 * @description
 * # IncludeExcludeController
 * Controller of the saintApp
 */
angular.module('saintApp')
  .controller('IncludeExcludeController', ['$scope', '$state', 'CaseListFactory', 'ConstantService', 'SaintService', 'CaseFactory', 'alertService', 'LanguageService', '$rootScope', 'loaderService', function ($scope, $state, CaseListFactory, ConstantService, SaintService, CaseFactory, alertService, LanguageService, $rootScope, loaderService) {
    $scope.state = $state;
    var caseListId = $scope.state.params.id;
    var caseToUpload = [];
    $scope.caseListData = CaseFactory.data;
    $scope.casesListData = [];
    $scope.cases = {DESCRIPTION: ''};
    $scope.caseListWithOutNull = [];
    $scope.inValidCases = [];
    $scope.validCases = [];
    $scope.isFileAvailableError = false;
    $scope.caseIds = [];

    //This function is defined to get all the list of case ids and re use this function
    $scope.fnSetCaseIds = function (result) {
      $scope.caseIds = result.data;
    };

    //This function is defined to select the cases from the include page
    $scope.fnSelectCase = function () {
      CaseFactory.getTopCaseIds().then($scope.fnSetCaseIds);
    };
    //This function defined to search any case from include page
    $scope.fnSearchCase = function (caseNumber) {
      if (caseNumber !== undefined && caseNumber.length >= ConstantService.MINIMUM_SEARCH) {
        CaseFactory.getCaseIds(caseNumber).then($scope.fnSetCaseIds);
      }
      else {
        $scope.fnSelectCase();
      }
    };
    //This function is called when the selects any case number from the list available
    $scope.fnChosenCase = function () {
      if (!$scope.cases.selected || !$scope.cases.selected.CASE_NBR) {
        alertService.warn(LanguageService.MESSAGES.INVALID_CASEID);
        return;
      }
      var caseNumber = $scope.cases.selected.CASE_NBR;
      $scope.fnGetCaseValues(caseNumber);
      $scope.cases.selected = [];
    };

    //This watch will tell, whether include or exclude is clicked and pop up should shown
    $scope.$watch('caseListData.casesOperationType', function (value) {
      if (value === ConstantService.EXCLUDE) {
        $scope.caseFlag = ConstantService.ZERO_KEY;
        angular.element('#dsui-exclude-list').modal({backdrop: 'static', keyboard: false});
        $scope.casesListData = $scope.caseListData.selectedCaseList;
        var excludeCases = $scope.casesListData;
        _.each(excludeCases, function (val) {
          $scope.validCases.push(val.caseId);
        });
      } else if (value === ConstantService.INCLUDE) {
        $scope.caseFlag = ConstantService.ONE_KEY;
        $scope.fnSelectCase();
        angular.element('#dsui-include-list').modal({backdrop: 'static', keyboard: false});
      }
      $scope.caseListData.casesOperationType = ConstantService.TWO_KEY;
    });

    /*upload valid cases*/
    $scope.fnGetCaseValues = function (data) {
      $scope.caseListWithOutNull = [];
      var caseList = data.replace(/(\r|\n)/g, ',');
      var caseListValues = caseList.split(',');
      _.each(caseListValues, function (val) {
        if (val !== '') {
          $scope.caseListWithOutNull.push(val);
        }
      });

      for (var i = 0; i < $scope.caseListWithOutNull.length; i++) {
        var listCaseNumbers = {
          'CASE_NUMBER': $scope.caseListWithOutNull[i]
        };
        caseToUpload.push(listCaseNumbers);
      }
      var uploadObj = {
        status: null,
        data: {
          CaseNumbers: caseToUpload,
          IE_FLAG :$scope.caseFlag,
          FK_BCL_KEY: caseListId
        }
      };
      var casesToUpload = function (result) {
        if (result.error) {
          loaderService.stop();
        } else {
          var validCasesTemp = _.uniq(_.pluck(_.where(result.data.data, {'status': ConstantService.ONE}), 'caseId'));
          $scope.validCases = _.uniq($scope.validCases.concat(validCasesTemp));
          var inValidCasesTemp = _.uniq(_.pluck(_.where(result.data.data, {'status': ConstantService.ZERO}), 'caseId'));
          $scope.inValidCases = _.uniq($scope.inValidCases.concat(inValidCasesTemp));
          result.data.data = result.data.data.concat($scope.casesListData);
          $scope.casesListData = _.uniq(result.data.data, false, function (object) {
            return object.caseId;
          });
          if ($scope.inValidCases.length > ConstantService.ZERO_KEY) {
            $scope.isFileAvailableError = true;
          }
        }
      };
      CaseFactory.uploadCases(uploadObj).then(casesToUpload);
    };

    //This function is defined to show the selected cases in the case Ids section in include and exclude pages
    $scope.showContent = function ($fileContent, filename) {
      $scope.fileName = filename;
      var extensionAct = $scope.fileName.split('.');
      var extension = extensionAct[(extensionAct.length) - 1];
      if (extension === 'csv' || extension === 'txt') {
        $scope.content = $fileContent;
        $scope.data = $scope.content;
        $scope.fnGetCaseValues($scope.data);
      } else {
        alertService.warn(LanguageService.MESSAGES.FAILED_UPLOAD_FILE);
      }
    };

    /*upload valid cases*/
    $scope.fnCasesListSave = function () {
      var sendCaseArray = [];
      if($scope.fileName === undefined){
        $scope.fileName = '';
      }
      for (var i = 0; i < $scope.validCases.length; i++) {
        var listPayload = {
          'BCL_IE_KEY': 24,
          'IE_FLAG': $scope.caseFlag,
          'FK_BCL_KEY': caseListId,
          'FK_CASE_NUMBER': $scope.validCases[i],
          'COMMENTS': $scope.cases.DESCRIPTION,
          'FILE_NAME': $scope.fileName
        };
        sendCaseArray.push(listPayload);
      }
      var listSave = {
        status: null,
        data: {'BCL_IE_DETAILS': sendCaseArray}
      };

      if (($scope.validCases.length || $scope.inValidCases.length) === ConstantService.ZERO_KEY) {
        return alertService.error(LanguageService.MESSAGES.CASEIDS_EMPTY);
      }
      if ($scope.inValidCases.length > ConstantService.ZERO_KEY && $scope.validCases.length === ConstantService.ZERO_KEY) {
        return alertService.error(LanguageService.MESSAGES.INVALID_CASEIDS);
      }
      if (listSave.data.BCL_IE_DETAILS[0].IE_FLAG === ConstantService.ZERO_KEY) {
        if (listSave.data.BCL_IE_DETAILS[0].COMMENTS === undefined || listSave.data.BCL_IE_DETAILS[0].COMMENTS.length === ConstantService.ZERO_KEY) {
          return alertService.error(LanguageService.MESSAGES.INVALID_DESC_EXCLUDE);
        }
      } else if (listSave.data.BCL_IE_DETAILS[0].IE_FLAG === ConstantService.ONE_KEY) {
        if (listSave.data.BCL_IE_DETAILS[0].COMMENTS === undefined || listSave.data.BCL_IE_DETAILS[0].COMMENTS.length === ConstantService.ZERO_KEY) {
          return alertService.error(LanguageService.MESSAGES.INVALID_DESC_INCLUDE);
        }
      }
      CaseFactory.includeExcludeCases(listSave).then($scope.fnOnCancel);
    };

    // This function is defined to hide the include and exclude pop ups and clear the data
    $scope.fnOnCancel = function () {
      $scope.isFileAvailableError = false;
      angular.element('#dsui-include-list').modal('hide');
      angular.element('#dsui-exclude-list').modal('hide');
      $rootScope.$emit('ExcludeRefreshTableData');
      $scope.validCases = [];
      $scope.casesListData = [];
      $scope.inValidCases = [];
      $scope.cases = [];
      caseToUpload = [];
    };
  }]);

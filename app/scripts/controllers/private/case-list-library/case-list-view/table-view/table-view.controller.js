'use strict';

/**
 * @ngdoc function
 * @name saintApp.controller.auth:CaseListsController
 * @description
 * # CaseListsController
 * Controller of the saintApp
 */
angular.module('saintApp')
  .controller('TableController', ['$scope', 'CaseFactory', 'loaderService', 'CaseListFactory', 'alertService', 'LanguageService', '$state', '$rootScope', 'DateService', 'ConstantService',
    function ($scope, CaseFactory, loaderService, CaseListFactory, alertService, LanguageService, $state, $rootScope, DateService, ConstantService) {
      var regExpression = /^[0-9]+$/;
      $scope.caseListData = CaseListFactory.data;
      $scope.caseListTableData = CaseFactory.data;
      $scope.displayedCollection = [];
      $scope.datesCheck = null;
      $scope.state = $state;
      $scope.page = {
        top: 50,
        skip: 0,
        loadMore: false
      };
      $scope.caseNumberText = null;
      $scope.isData = true;
      $scope.enableLazyLoading = true;

      //This function is defined to shown the table data in the table view page
      $scope.getTableData = function () {
        CaseListFactory.data.filtersResponseCount = 0;
        var casesObj = {
          baseCaseKey: $scope.state.params.id,
          top: $scope.page.top,
          skip: $scope.page.skip,
          searchText: $scope.caseNumberText
        };
        //This function helps to fetch the distinct cases and show in table view
        CaseFactory.getDistinctCases(casesObj).then(function (items) {
          CaseListFactory.data.filtersResponseCount = 0;
          if (items.data) {
            if ($scope.page.loadMore) {
              for (var i = 0; i < items.data.length; i++) {
                $scope.displayedCollection.push(items.data[i]);
              }
              if (items.data.length < 50) {
                $scope.enableLazyLoading = false;
              }
            } else {
              $scope.displayedCollection = items.data;
              if ($scope.displayedCollection.length >= 0) {
                $scope.isData = false;
              }
              if (items.data.length < 50) {
                $scope.enableLazyLoading = false;
              }
            }

            $scope.page.loadMore = false;
            $scope.page.skip += $scope.page.top;
          } else {
            alertService.error(LanguageService.MESSAGES.FAILED_TO_GET_CASE_LISTS);
          }
          loaderService.stop();
        });
      };
      $scope.$watch('caseListData.updateTableView', function (value) {
        if (value) {
          $scope.caseListData.updateTableView = false;
          $scope.fnInit();
        }
      });
      $scope.$watch('caseListData.caseListObject.caseListMode',function(value){
        if(value !==null && !$scope.caseListData.caseListObject.sourceQueryUI && !$scope.caseListData.caseListObject.visualQueryFilterUI){
          $state.go(ConstantService.STATE.CASE_LIST_QUERY_STATE,{id:$state.params.id, page:$state.params.page});
        }
      }, true);
      //This function is convert the dates in the required format
      $scope.getDatesCheckObj = function () {
        CaseFactory.getCaseListDatesCheck($scope.state.params.id).then(function (datesChkObj) {
          if (datesChkObj.data) {
            $scope.datesCheck = {
              eventRcptDate: datesChkObj.data.eventReceiptDate,
              initialRcptDate: datesChkObj.data.initialReceiptDate,
              followUpRcptDate: datesChkObj.data.followupReceiptDate
            };
          } else {
            alertService.error(LanguageService.MESSAGES.FAILED_TO_GET_CASE_LISTS);
          }
        });
      };
      $scope.fnInit = function () {
        if ($scope.state.params.id) {
          $scope.page = {
            top: 50, skip: 0, loadMore: false
          };
          $scope.getDatesCheckObj();
          $scope.getTableData();
        }
        $scope.caseListTableData.selectedCaseList = [];
      };
      //This function is called when user scrolls to the bottom of page next 50 records will be fetched
      $scope.fnLoadMoreCases = function (scrollFromDiv) {
        $scope.page.loadMore = scrollFromDiv;
        loaderService.start();
        $scope.getTableData();
      };
      //This function is called when the user selects the row from the table view
      $scope.fnSelectedCaseList = function () {
        $scope.caseListTableData.selectedCaseList = $scope.displayedCollection.filter(function (row) {
          return row.checkbox;
        });
        CaseFactory.data.selectedCaseList = $scope.caseListTableData.selectedCaseList;
      };
      //This function is called when include or exclude buttons are clicked
      $scope.fnIncludeExcludeCasesBtn = function (value) {
        if (value === ConstantService.EXCLUDE) {
          CaseFactory.data.casesOperationType = ConstantService.EXCLUDE;
        }
        else if (value === ConstantService.INCLUDE) {
          CaseFactory.data.casesOperationType = ConstantService.INCLUDE;
        }
      };
      //Converts the date format
      $scope.fnGetDateString = function (dateObj) {
        return DateService.getDateStringInDateFormatOne(dateObj);
      };
      $scope.fnInit();
      // There emit and on is happening from includeexclude controller for refresh of table data
      $rootScope.$on('ExcludeRefreshTableData', function () {
        $scope.isData = false;
        $scope.displayedCollection = $scope.displayedCollection.filter(function (row) {
          return !row.checkbox;
        });
        $scope.fnInit();
      });
      //This will navigate to the case details page.
      $scope.fnGetCaseDetails = function (selObj) {
        $state.go(ConstantService.STATE.CASE_LIST_DETAILS_STATE, {
          caseKey: selObj.caseKey,
          id: $scope.state.params.id
        }, {'reload': true});
      };
      //This function will be called when user when the case number is entered to search
      $scope.fnSearch = function () {
        $scope.page = {
          top: 50, skip: 0, loadMore: false
        };
        if ($scope.caseNumberText.match(regExpression)) {
          if ($scope.caseNumberText && $scope.caseNumberText.length > 0) {
            $scope.getTableData();
            $scope.isData = false;
          } else if (!$scope.caseNumberText) {
            $scope.getTableData();
            $scope.isData = false;
          }
        } else if ($scope.caseNumberText.length > 0) {
          alertService.error(LanguageService.MESSAGES.FAILED_TO_GET_SEARCHED_CASE_LISTS);
        } else {
          $scope.getTableData();
          $scope.isData = false;
        }
      };
      $scope.$on('$destroy', function () {
        angular.element('#dsui-exclude-list').modal('hide');
        angular.element('#dsui-include-list').modal('hide');
        angular.element('.modal-backdrop.fade.in').remove();
        angular.element(document.body).removeAttr('class');
        CaseListFactory.data.currentView = 1;
        CaseListFactory.data.dimensions = [];
        CaseListFactory.data.filtersResponseCount = 0;
      });
    }]);

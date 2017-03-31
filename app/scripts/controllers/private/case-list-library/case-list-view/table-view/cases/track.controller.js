'use strict';

/**
 * @ngdoc function
 * @name saintApp.controller.auth:TrackCasesController
 * @description
 * # TrackCasesController
 * Controller of the saintApp
 */
angular.module('saintApp')
  .controller('TrackCasesController', ['$scope', '$state', 'CaseFactory', 'CaseListFactory', 'SaintService', 'ConstantService', '$rootScope', 'alertService', 'LanguageService', 'loaderService', 'DateService', 'UrlService', function ($scope, $state, CaseFactory, CaseListFactory, SaintService, ConstantService, $rootScope, alertService, LanguageService, loaderService, DateService, UrlService) {

        $scope.caseData = CaseFactory.data;
        $scope.columnMetadata = [];
        $scope.caseListPerPage = 100;
        $scope.totalCaseList = 0;
        $scope.caseListData = [];
        $scope.trackType = ConstantService.CASE_LIST_ADDED;
        $scope.startIndex = 0;
        $scope.endIndex = 0;
        $scope.pageCount = 1;
        $scope.doLoadCaselist = true;

        /**
         * Event Handler for Paginator Page Change
         * @param newPage
         */
        $scope.fnLoadCaseList = function () {
            if( $scope.doLoadCaselist ) {
                $scope.fnGetRecordPage($scope.pageCount);
                $scope.pageCount++;
            }
        };

        $scope.$watch('caseData.trackViewType', function (trackType) {
            if (trackType) {
                $scope.fnInit(trackType);
            }
        });

        /**
         * Returns the Modal Head based on track type
         * @returns {*}
         */
        $scope.fnGetModalTitle = function () {
            switch ($scope.trackType) {
                case ConstantService.CASE_LIST_ADDED:
                    return 'private-case-list-library.BUNDLE_CASE_ADDED';
                case ConstantService.CASE_LIST_REMOVED:
                    return 'private-case-list-library.BUNDLE_CASE_REMOVED';
                case ConstantService.CASE_LIST_ANNOTATED:
                    return 'private-case-list-library.BUNDLE_CASE_ANNOTATED';
            }
        };
        /**
         * Reset the header of the table depending on track type clicked
         */
        $scope.fnConfigureColumnMetadata = function() {
            $scope.columnMetadata = [];
            $scope.columnMetadata.push({
                'name': 'private-case-list-library.BUNDLE_CASEID'
            });
            $scope.columnMetadata.push({
                'name': 'private-case-list-library.BUNDLE_PERSON'
            });
            switch ($scope.trackType) {

                case ConstantService.CASE_LIST_ADDED :
                    $scope.columnMetadata.splice(1, 0, {
                        'name': 'private-case-list-library.BUNDLE_REASON'
                    });
                    $scope.columnMetadata.push({
                        'name': 'private-case-list-library.BUNDLE_DATE_ADDED'
                    });
                    break;
                case ConstantService.CASE_LIST_REMOVED :
                    $scope.columnMetadata.splice(1, 0, {
                        'name': 'private-case-list-library.BUNDLE_REASON'
                    });
                    $scope.columnMetadata.push({
                        'name': 'private-case-list-library.BUNDLE_DATE_REMOVED'
                    });
                    break;
                case ConstantService.CASE_LIST_ANNOTATED :

                    $scope.columnMetadata.push({
                        'name': 'private-case-list-library.BUNDLE_DATE_ADDED'
                    });
                    break;
            }
        };

        /**
         * Returns the geenric table data based on track type
         * @param rowObject
         * @param columnNumber
         * @returns {*}
         */
        $scope.fnGetColumnData = function (rowObject, columnNumber) {
            var columnData='';
            switch ($scope.trackType) {
                case ConstantService.CASE_LIST_ADDED :
                case ConstantService.CASE_LIST_REMOVED :
                    switch (columnNumber) {
                        case 1:
                            columnData =  rowObject.caseId;
                            break;
                        case 2:
                            columnData = rowObject.reason;
                            break;
                        case 3:
                            columnData = rowObject.person;
                            break;
                        case 4:
                            columnData = $scope.fnGetDate(rowObject.dateModified);
                            break;
                    }
                    break;
                case ConstantService.CASE_LIST_ANNOTATED :
                    switch (columnNumber) {
                        case 1:
                            columnData = rowObject.caseId;
                            break;
                        case 2:
                            columnData = rowObject.person;
                            break;
                        case 3:
                            columnData = $scope.fnGetDate(rowObject.dateModified);
                            break;
                        case 4:
                            columnData = rowObject.annotatedText;
                            break;
                    }
                    break;
            }
            return columnData;
        };

        /**
         * Called when the close button is clicked
         */
        $scope.fnOnCancel = function () {
            $scope.doLoadCaselist=false;
            CaseFactory.data.trackViewType = null;
            //As same controller for all all modal, hence cleaning up variable before opening
            $scope.totalCaseList = 0;
            $scope.caseListData = [];
            $scope.pageCount = 1;
            angular.element('#dsui-track-list').modal('hide');
        };

        /**
         * Get Date from Odata Milliseconds date
         * @param dateInMilli
         */
        $scope.fnGetDate = function (dateInMilli) {
            return DateService.getDateStringInDateFormatOne(dateInMilli);
        };

        /**
         * Make Odata call to fetch tracked caselist depending on the pagenumber
         * @param pageNumber
         */
        $scope.fnGetRecordPage = function(pageNumber) {
            var i = 0;
            var url = UrlService.getService('CASE_LIST_TRACKING');
            var baseCaseKey = $state.params.id;
            var trackType = $scope.trackType;

            $scope.startIndex = (pageNumber - 1) * $scope.caseListPerPage;
            $scope.endIndex = $scope.startIndex + $scope.caseListPerPage;

            url = url + 'Parameters(IN_BASECASEKEY=' + baseCaseKey + ',IN_TRACK_TYPE=' + trackType + ')/Results?' + CaseFactory.getGenerateOdataQueryParameters($scope.startIndex, $scope.endIndex);
            loaderService.start();
            CaseFactory.getTrackingCaseList(url, $scope.trackType).then(function (result) {
                loaderService.stop();
                if (!result.error) {
                    _.each(result.data, function (element) {
                        _.extend(element, {'annotatedText': 'private-case-list-library.BUNDLE_VIEW_ANNOTATION'});
                    });
                    for (i = 0; i < result.data.length; i++) {
                        $scope.caseListData.push(result.data[i]);
                    }
                    $scope.totalCaseList = parseInt(result.count);
                    if( $scope.caseListData.length === $scope.totalCaseList ){
                        $scope.doLoadCaselist=false;
                    }
                }
            });
        };

        /**
         * Initialize the popup controller
         * @param trackType
         */
        $scope.fnInit = function (trackType) {
            angular.element('#dsui-track-list').modal({backdrop: 'static', keyboard: false});
            $scope.doLoadCaselist=true;
            $scope.trackType = trackType;
            $scope.fnConfigureColumnMetadata();
            $scope.fnLoadCaseList();
        };

    /**
     * This will navigate to the case details page.
     */
    $scope.fnGetCaseDetails = function (selObj) {
      $scope.fnOnCancel();
      $state.go(ConstantService.STATE.CASE_LIST_DETAILS_STATE, {
        caseKey: selObj.caseKey,
        id: $state.params.id
      }, {'reload': true});
    };
    }]);

'use strict';
angular.module('saintApp')
    .controller('CaseListTilePanelController', ['$scope', 'CaseListFactory', 'UrlService', 'DateService', 'ConstantService', '$state', 'loaderService', function ($scope, CaseListFactory, urlService, DateService, ConstantService, $state, loaderService) {
        $scope.myCaseListDataRepo = [];
        $scope.myCaseListData = [];
        $scope.totalCaseList = 0;
        $scope.startPageShown = 0;
        $scope.endPageShown = 0;
        $scope.caseListPerPage = 50; // this should match however many results your API puts on one page
        $scope.caseListServiceData = CaseListFactory.data;
        $scope.sortBy = '';
        $scope.startIndex = 0;
        $scope.endIndex = 0;
        var oldPageNumber = 1;
        $scope.pagination = {
            current: 1
        };
        $scope.fnTileSelected = function (caseList) {
          var pageMode = (caseList.isShared) ? ConstantService.SHARED_MODE : ConstantService.EDIT_MODE;
            $scope.caseListServiceData.selectedCaseListKey = caseList.baseCaseListKey;
            $state.go(ConstantService.STATE.CASE_LIST_VISUALS_STATE, {id: caseList.baseCaseListKey,page : ConstantService.PAGE_NAVIGATION_CASE_LIST_LIBRARY,pageMode: pageMode});
        };

        $scope.fnGenerateRequestPayload = function(pageNumber) {
          var filterArray = $scope.caseListServiceData.selectedFilters;
          var selectedSort = $scope.caseListServiceData.caseListSort;
          var description='';
          var payload = {
            data:{
              'count':'',
              'offset':'',
              'descriptions':'',
              'columnsSelected': ['Audit_CreatedBy','RPT_KEY','BCL_KEY','BCL_NAME','DESCRIPTION','CASES_COUNT','RPT_START_DATE','Audit_CreatedDt','RPT_END_DATE','IS_LOCKED','BCL_DISPLAY_NAME','IS_SHARED','ALL_DATES_FLAG'],
              'filters': {},
              'sort':{},
              'textSearch':'',
              'datesSelected': {}
            }};
          $scope.startIndex = (pageNumber - 1) * $scope.caseListPerPage;
          $scope.endIndex = $scope.startIndex + $scope.caseListPerPage;
          if (filterArray.length > 0) { //some filter parameters have been applied
            for (var i = 0; i < filterArray.length; i++) {
              if (filterArray[i].dbFilterName) { // Make Sure DB_FILTER_NAME is not null
                    /**
                     * Below function is to check if description is the filter category,
                     * making search string as separate wildcard appended values to comply with fuzy search logic
                     */
                if (filterArray[i].dbFilterName.split('_').pop() === ConstantService.FILTER_DATE_TEXT) { // This is a date filter
                  var startDate = filterArray[i].contents[0].split(',')[0];
                  var endDate = filterArray[i].contents[0].split(',')[1];
                  startDate=new Date(startDate).toJSON();
                  var endDateInDateFormat = new Date(endDate);
                  endDate = new Date(endDateInDateFormat.getTime() + 24*60*60000).toJSON();///right now , if user chooses end date as 2nd feb,2016
                  //from datepicker , the date that goes into the system is 2ndFeb,00:00:00 . So if we query to get cases with end date <= 2nd feb
                  // , it actually translates to get end date <= 2ndFeb , 00:00:00 ,ie end date actually becomes 1st feb,23:59:59 effectively .
                  // Hence , even though user wanted  to get cases with end date as 2nd feb , he will get cases till 1st feb only . Therefore ,
                  // adding 24hours while querying
                  if (startDate !== 'null' && endDate !== 'null') { // Both the dates exist
                    payload.data.datesSelected[filterArray[i].dbFilterName]=[startDate,endDate];
                  }
                }
                else if(filterArray[i].dbFilterName === ConstantService.DB_KEY_DUE_DAYS) { // Special case forward navigation to caselist library
                  var start = filterArray[i].contents[0];
                  var end = filterArray[i].contents[1];
                  payload.data.datesSelected[filterArray[i].dbFilterName]=[start,end];
                }
                else{
                  if (filterArray[i].dbFilterName === ConstantService.FILTER_DESCRIPTION_TEXT) { // This is special case for description
                    for(var j=0;j<filterArray[i].contents.length;j++)
                    {
                     description = description + filterArray[i].contents[j]+'*';
                    /**
                     * Append OR if more values are there.
                     */
                    if(j!==filterArray[i].contents.length-1){
                      description = description + ' OR ';
                    }}
                    payload.data.descriptions=description;
                  }
                  else{
                    payload.data.filters[filterArray[i].dbFilterName]=filterArray[i].contents;
                  }
                }

              }
            }
          }
          if (selectedSort.sortedBy && selectedSort.sortOrder) {
            payload.data.sort[selectedSort.sortedBy]=selectedSort.sortOrder;
            if( selectedSort.secondarySort){
              if(selectedSort.secondarySort.indexOf(',')>=0){
                var eachSortField=selectedSort.secondarySort.split(',');
                for (var k = 0; k < eachSortField.length ; k++) {
                  payload.data.sort[eachSortField[k]]=selectedSort.sortOrder;
                }
              }else{
                payload.data.sort[selectedSort.secondarySort]=selectedSort.sortOrder;
              }
            }
          }
          payload.data.count=$scope.endIndex-$scope.startIndex;
          payload.data.offset=$scope.startIndex;
          return payload;
        };
        $scope.$on(ConstantService.MANAGE_CASE_LIST_SCREEN + '_INIT_WATCHERS', function() {
            $scope.$watch('caseListServiceData.selectedFilters', function (newValue, oldValue) {
                if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
                    $scope.fnpageInitialization();
                }
            }, true);
            $scope.$watch('caseListServiceData.caseListSort', function (newValue, oldValue) {
                if (JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
                    if (newValue.sortedBy && newValue.sortOrder) {
                        $scope.fnpageInitialization();
                    }
                }
            }, true);
        });
        $scope.fnGetDate = function (dateInMilli) {
            return DateService.getDateStringInDateFormatOne(dateInMilli);
        };
        $scope.fngetRecordPage = function (pageNumber) {
            var payload = $scope.fnGenerateRequestPayload(pageNumber);
            loaderService.start();
            CaseListFactory.getCaseListData(payload).then(
                function (result) {
                    loaderService.stop();
                    if (!result.error) {
                        $scope.myCaseListData = result.data;
                        $scope.totalCaseList = parseInt(result.count);
                        if ($scope.totalCaseList === 0) {
                            $scope.startPageShown = 0;
                            $scope.endPageShown = 0;
                        } else {
                            $scope.startPageShown = $scope.startIndex + 1;
                            $scope.endPageShown = ($scope.endIndex > $scope.totalCaseList) ? $scope.totalCaseList : $scope.endIndex;
                        }
                    }
                }
            );
        };
        $scope.fnpageChanged = function (newPage) {
            if( oldPageNumber !== newPage ) {
              window.scroll(0,0);
                $scope.myCaseListData = $scope.fngetRecordPage(newPage);
                oldPageNumber = newPage;
            }
        };
        $scope.fnpageInitialization = function () {
            $scope.fngetRecordPage(1);
            $scope.pagination.current = 1;
        };
        $scope.$on('CASE_LIST_TILES_INIT', function () {
            $scope.fnpageInitialization();
        });

    }]);

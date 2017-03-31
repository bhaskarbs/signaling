/**
 * Created by prpoddar on 7/19/2016.
 */
'use strict';
angular.module('saintApp')
  .controller('CaseListTilePanelModalController', ['$scope', 'ReportOutputFactory', 'UrlService', 'DateService', 'ConstantService', '$state', 'loaderService','$document', function (scope, ReportOutputFactory, urlService, DateService, constantService, $state, loaderService,$document) {
    scope.myCaseListDataRepo = [];
    scope.myCaseListData = [];
    scope.totalCaseList = 0;
    scope.startPageShown = 0;
    scope.endPageShown = 0;
    scope.caseListPerPage = 5; // this should match however many results your API puts on one page
    scope.caseListServiceData = ReportOutputFactory.data;
    scope.sortBy = '';
    scope.startIndex = 0;
    scope.endIndex = 0;
    var oldPageNumber = 1;
    scope.inputString = '';
    scope.slectedCaseListToAttach=null;

    scope.pagination = {
      current: 1
    };
    //scope.fnTileSelected = function (caseList) {
    //
    //};
    scope.fnGenerateOdataQueryParameters = function (pageNumber) {
      var url = urlService.getService('CASELIST_DEFAULT_FILTER');
      var qBaseSelectParameter = '$select=RPT_KEY,BCL_KEY,BCL_NAME,DESCRIPTION,CASES_COUNT,RPT_START_DATE,Audit_CreatedDt,Audit_CreatedBy,RPT_END_DATE,IS_LOCKED,BCL_DISPLAY_NAME,IS_SHARED';

      //The above select parameters are for fields to be displayed in case list library tile
      var qRecordCount = '$inlinecount=allpages';
      var qorderBy = '';
      var masterQueryParameter = [];
      var qFilter = '';
      var qTop = '';
      var qSkip = '';
      var filters = [];
      var andFilter = [];
      var sortFields = '';
      var textSearchString = '';
      var descSearchString = '';
      var filterArray = scope.caseListServiceData.selectedFilters;
      var selectedSort = scope.caseListServiceData.caseListSort;
      masterQueryParameter.push(qBaseSelectParameter);
      masterQueryParameter.push(qRecordCount);
      if (scope.inputString.length > 0) {
        for (var k = 0; k < scope.inputString.length; k++) {

          textSearchString = textSearchString + scope.inputString[k] + '*';
          /**
           * Append OR if more values are there.
           */
          if (k !== scope.inputString.length - 1) {
            textSearchString = textSearchString + ' OR ';
          }
        }
      }
      if (filterArray.length > 0) { //some filter parameters have been applied
        for (var i = 0; i < filterArray.length; i++) {
          var temp = [];
          if (filterArray[i].dbFilterName) { // Make Sure DB_FILTER_NAME is not null
            if (filterArray[i].dbFilterName.split('_').pop() === 'DATE' || filterArray[i].category === 'date') { // This is a date filter
              var startDate = filterArray[i].contents[0].split(',')[0];
              var endDate = filterArray[i].contents[0].split(',')[1];
              var endDateInDateFormat = new Date(endDate);
              endDate = new Date(endDateInDateFormat.getTime() + 24 * 60 * 60000).toJSON();///right now , if user chooses end date as 2nd feb,2016
              //from datepicker , the date that goes into the system is 2ndFeb,00:00:00 . So if we query to get cases with end date <= 2nd feb
              // , it actually translates to get end date <= 2ndFeb , 00:00:00 ,ie end date actually becomes 1st feb,23:59:59 effectively .
              // Hence , even though user wanted  to get cases with end date as 2nd feb , he will get cases till 1st feb only . Therefore ,
              // adding 24hours while querying
              if (startDate !== 'null' && endDate !== 'null') { // Both the dates exist
                filters.push([filterArray[i].dbFilterName + ' gt datetime\'' + startDate + '\'']);
                filters.push([filterArray[i].dbFilterName + ' lt datetime\'' + endDate + '\'']);
              }
            } else {
              for (var j = 0; j < filterArray[i].contents.length; j++) {
                /**
                 * Below function is to check if description is the filter category,
                 * making search string as separate wildcard appended values to comply with fuzy search logic
                 */
                if (filterArray[i].dbFilterName === constantService.FILTER_DESCRIPTION_TEXT) { // This is special case for description
                  descSearchString = descSearchString + filterArray[i].contents[j] + '*';
                  /**
                   * Append OR if more values are there.
                   */
                  if (j !== filterArray[i].contents.length - 1) {
                    descSearchString = url + ' OR ';
                  }
                  //.push('substringof(\'' + filterArray[i].contents[j] + '\',' + filterArray[i].dbFilterName + ')');
                } else if (filterArray[i].category === constantService.FILTER_CATEGORY_NUMBER) {
                  temp.push(filterArray[i].dbFilterName + ' eq ' + filterArray[i].contents[j]);
                } else {
                  temp.push(filterArray[i].dbFilterName + ' eq \'' + filterArray[i].contents[j] + '\'');
                }
              }
            }
          }
          if (temp.length > 0) {
            filters.push(temp);
          }
        }
        //Joining OR condition
        for (i = 0; i < filters.length; i++) {
          andFilter.push('(' + filters[i].join(' or ') + ')');
        }
        //Applying AND condition
        if (andFilter.length > 0) {
          qFilter = '$filter=' + andFilter.join(' and ');
          masterQueryParameter.push(qFilter);
        }
      }
      scope.startIndex = (pageNumber - 1) * scope.caseListPerPage;
      scope.endIndex = scope.startIndex + scope.caseListPerPage;
      qTop = '$top=' + (scope.endIndex - scope.startIndex);
      qSkip = '$skip=' + scope.startIndex;

      masterQueryParameter.push(qTop);
      masterQueryParameter.push(qSkip);
      if (selectedSort.sortedBy && selectedSort.sortOrder) {
        sortFields = selectedSort.sortedBy + ' ' + selectedSort.sortOrder;
        if (selectedSort.secondarySort) {
          if (selectedSort.secondarySort.indexOf(',') >= 0) {
            var eachSortField = selectedSort.secondarySort.split(',');
            for (var s = 0; s < eachSortField.length; s++) {
              sortFields += ',' + eachSortField[s] + ' ' + selectedSort.sortOrder;
            }
          } else {
            sortFields += ',' + selectedSort.secondarySort + ' ' + selectedSort.sortOrder;
          }
        }
        scope.sortBy = selectedSort.sortedByName;
        qorderBy = '$orderby=' + sortFields;
        masterQueryParameter.push(qorderBy);
      }
      url = url + '(IN_DESCRIPTION=\'' + descSearchString + '\',IN_TEXT_SEARCH=\'' + textSearchString + '\')/Results?';
      return url + masterQueryParameter.join('&');
    };

    scope.fnGetDate = function (dateInMilli) {
      return DateService.getDateStringInDateFormatOne(dateInMilli);
    };

    scope.fngetRecordPage = function (pageNumber) {
      var url = scope.fnGenerateOdataQueryParameters(pageNumber);
      loaderService.start();
      ReportOutputFactory.getCaseListData(url).then(
        function (result) {
          loaderService.stop();
          if (!result.error) {
            scope.myCaseListData=scope.myCaseListData.concat(result.data);
            scope.totalCaseList = parseInt(result.count);
            if (scope.totalCaseList === 0) {
              scope.startPageShown = 0;
              scope.endPageShown = 0;
            } else {
              scope.startPageShown = scope.startIndex + 1;
              scope.endPageShown = (scope.endIndex > scope.totalCaseList) ? scope.totalCaseList : scope.endIndex;
            }
          }
        }
      );
    };

    //Bclkey of a particular caselist retrieved
    scope.fnRetrieveBclKey = function (caselistdata) {
      ReportOutputFactory.data.attachCaseListData.bclDisplayName = caselistdata.caseListDisplayName;
        ReportOutputFactory.data.attachCaseListData.bclKey = caselistdata.baseCaseListKey;
      scope.slectedCaseListToAttach = caselistdata.baseCaseListKey;

    };

    scope.fnpageChanged = function (newPage) {
      if (oldPageNumber !== newPage) {
        scope.myCaseListData = scope.fngetRecordPage(newPage);
        oldPageNumber = newPage;
      }
    };

    scope.fnFindSearchString = function (searchString) {
      scope.pagination.current=1;
      scope.myCaseListData=[];
      scope.inputString = searchString.split(' ');
      scope.fnpageInitialization();
    };

    scope.fnInitScrollBind = function () {
      scope.queryResult = $document[0].getElementById('flux');
      scope.container = angular.element(scope.queryResult);
      scope.container.on('scroll', function() {
          if (scope.container.outerHeight() + scope.container.scrollTop() >= scope.queryResult.scrollHeight-2) {
            scope.pagination.current++;
            scope.fngetRecordPage(scope.pagination.current);
          }
      });
    };

    scope.fnInitScrollBi=function(){
      scope.pagination.current++;
      scope.fngetRecordPage(scope.pagination.current);
    };
    scope.fnpageInitialization = function () {
      scope.fngetRecordPage(scope.pagination.current);
    };

    scope.fnpageInitialization();
    scope.fnInitScrollBind();



    scope.fnOpenFilterViewModal = function () {
      scope.$emit('OPEN_FILTER_VIEW');
    };
    scope.fnCloseUpdateModal = function () {
      ReportOutputFactory.data.isReadyToAttach = false;
      scope.pagination.current=1;
      scope.$emit('HIDE_UPDATE_CASELIST_MODAL');
    };
    scope.fnAttachNewCaseList = function () {
      ReportOutputFactory.data.isReadyToAttach = true;
      scope.$emit('HIDE_UPDATE_CASELIST_MODAL');
    };



  }]);

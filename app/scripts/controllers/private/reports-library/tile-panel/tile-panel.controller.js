'use strict';
angular.module('saintApp').controller('MainReportController', ['loaderService','ConstantService', 'DateService','alertService', 'LanguageService', 'UrlService', '$scope', 'ReportFactory', '$timeout', function (loaderService, ConstantService, DateService, alertService, LanguageService, UrlService, $scope, ReportFactory, $timeout) {

    //Initial Configuration
    $scope.reportDescMaxLimit = 500;
    $scope.myReportDataRepo = [];
    $scope.myReportData = [];
    $scope.totalReports = 0;
    $scope.startPageShown = 0;
    $scope.endPageShown = 0;
    $scope.reportsPerPage = 50; // this should match however many results your API puts on one page
    $scope.reportFactoryData = ReportFactory.data;
    $scope.sortBy = '';
    $scope.deleteReportSeries = false;
    $scope.deleteReport=false;
    $scope.reportKey = 0;
    $scope.disableReportDelete = true;
    $scope.deleteReportOption = {
      name: ConstantService.DELETE_REPORT_OCCURRENCE_OPTION
    };

    //function to call the report modal, should not call when the report is completed
    $scope.callReportDelete = function(report) {
      if ($scope.fnGetReportStatus(report.reportStatus) === ConstantService.COMPLETED.toLowerCase()) {
        alertService.error(LanguageService.MESSAGES.FAILED_TO_DELETE_COMPLETED_REPORT);
      }
      else {
        $scope.reportKey = report.reportId;
        angular.element('#dsui-my-modal-reassure').modal('show');
      }
    };

    //Function to call the modal that allows user to select the mode of deletion
    $scope.reportDelete = function() {
      angular.element('#dsui-my-modal-reassure').modal('hide');
      angular.element('#dsui-report-delete').modal('show');
      $scope.setReportSeries(1);
    };

  //function to close the modal when the cancel icon is clicked
  $scope.reportDeleteCancel = function() {
    angular.element('#dsui-my-modal-reassure').modal('hide');
  };

  //function to close the modal by clearing all the selected data.
  $scope.fnOnCancel = function () {
    $scope.disableReportDelete = true;
    $scope.deleteReportSeries = false;
    $scope.deleteReport=false;
    angular.element('#dsui-report-delete').modal('hide');
    $('#dsui-report-delete').on('hidden.bs.modal', function () {

      $(this)
        .find('input,textarea,select')
        .val('')
        .end()
        .find('input[type=checkbox], input[type=radio]')
        .prop('checked', '')
        .end();
    });
    $scope.fnPageInitialization();
  };

  //function to trigger report delete
  $scope.fnDeleteReport = function() {
    var sendReportKey = {
      'RPT_KEY': $scope.reportKey
    };
    ReportFactory.deleteReport(sendReportKey).then($scope.fnOnCancel);
    //Code written for MVP 1.1 Please dont remove the below mentioned code
    /*if ($scope.deleteReport){
      ReportFactory.deleteReport(sendReportKey).then($scope.fnOnCancel);

    }
    else if ($scope.deleteReportSeries){
      $scope.fnOnCancel();

    }*/
  };

  //function that manage the report delete mode selection
  $scope.setReportSeries = function(choice){
    $scope.disableReportDelete = false;
    switch(choice){
      case 1:
      {
        if (!$scope.deleteReport) {
          $scope.deleteReport = true;
          $scope.deleteReportSeries = false;
        }
        break;
      }
      case 2:  {
        if (!$scope.deleteReportSeries) {
          $scope.deleteReport = false;
          $scope.deleteReportSeries = true;
        }
        break;
      }
    }
  };

    var oldPageNumber = 1;

    /**
     * Restricting the description length to be 500
     * @param reportDesc
     * @returns {string}
     */
    $scope.fnGetReportDescription = function (reportDesc) {
        var description = '';
        if (reportDesc) {
            description = reportDesc.substring(0, $scope.reportDescMaxLimit);
            if (reportDesc.length > $scope.reportDescMaxLimit) {
                description += '...';
            }
        }
        return description;
    };
    /**
     * Generate the Odata Url comprising of all filters to fetch data for Report Tiles
     * @param pageNumber
     * @returns {string}
     */
    $scope.fnGenerateOdataQueryParameters = function(pageNumber) {
      var filterArray = $scope.reportFactoryData.selectedFilters;
      var selectedSort = $scope.reportFactoryData.reportSort;
      var description='';
      var payload = {
        data:{
          'count':'',
          'offset':'',
          'descriptions':'',
          'columnsSelected': ['RPT_NAME','RPT_TYPE_NAME','ALL_DATES_FLAG', 'SUBMITTED_DATE', 'REPORT_DISPLAY_NAME', 'RPT_START_DATE', 'RPT_END_DATE', 'DESCRIPTION', 'DAYS_UNTIL_DUE', 'STATUS_KEY', 'Audit_CreatedDt', 'RPT_KEY','FK_RPT_PACKAGE_KEY'],
          'filters': {},
          'sort':{},
          'datesSelected': {}
        }};
      $scope.startIndex = (pageNumber - 1) * $scope.reportsPerPage;
      $scope.endIndex = $scope.startIndex + $scope.reportsPerPage;
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
            else if(filterArray[i].dbFilterName === ConstantService.DB_KEY_DUE_DAYS) { // Special case forward navigation to report library
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

    /**
     * Applying dynamic class based on paginator displayed or not
     * @returns {*}
     */
    $scope.fnGetPaginatorClass = function () {
        if ($scope.totalReports > $scope.reportsPerPage) {
            return 'dsui-reportTileContainerWithPaginator';
        } else {
            return 'dsui-reportTileContainerWithoutPaginator';
        }
    };

  $scope.$on(ConstantService.MANAGE_REPORTS_SCREEN + '_INIT_WATCHERS', function () {
      $scope.$watch('reportFactoryData.selectedFilters', function (newValue, oldValue) {
        if ((JSON.stringify(newValue) !== JSON.stringify(oldValue))&& ReportFactory.data.watchInitialization) {
          $scope.fnPageInitialization();
        }
      }, true);
      // Watching the sort
      $scope.$watch('reportFactoryData.reportSort', function (newValue, oldValue) {
        if ((JSON.stringify(newValue) !== JSON.stringify(oldValue)) && ReportFactory.data.watchInitialization) {
          if (newValue.sortedBy && newValue.sortOrder) {
            $scope.fnPageInitialization();
          }
        }
      }, true);
    });

    $scope.pagination = {
        current: 1
    };
    $scope.startIndex = 0;
    $scope.endIndex = 0;
    /**
     * Callled when the pagiantor is clicked
     * @param newPage
     */
    $scope.fnPageChanged = function (newPage) {
        if (oldPageNumber !== newPage) {
            $scope.myReportData = $scope.fnGetRecordPage(newPage);
            oldPageNumber = newPage;
        }
    };
    /**
     * Map the status number to string
     * @param status
     * @returns {string}
     */
    $scope.fnGetReportStatus = function (status) {
        switch (status) {
            case 1:
                return ConstantService.OVERDUE.toLowerCase();
            case 2:
                return ConstantService.OPEN.toLowerCase();
            case 3:
                return ConstantService.INPROGRESS.toLowerCase();
            case 4:
              return ConstantService.COMPLETED.toLowerCase();
        }
    };

    /**
     * Event Handler to denote the tile which has been selected
     * @param reportTile
     */
    $scope.fnTilesSelected = function (reportTile) {
      $scope.statusFilterPanel=$scope.showFilterPanel;
        // Update isSelected property for reportData all to false
        for (var i = 0; i < $scope.myReportData.length; i++) {
            $scope.myReportData[i].isSelected = false;
            $scope.fnShowReportPanel();
        }

        ReportFactory.data.selectedTileId = reportTile.reportId;
        reportTile.isSelected = true;
        $timeout(function () {
           $('[data-toggle="tooltip"]').tooltip();
        }, 100);
    };

    $scope.fnGetDate = function (dateInMilli) {
        return DateService.getDateStringInDateFormatOne(dateInMilli);
    };
    /**
     * Get the report library based on the page number selected on paginator
     * @param pageNumber
     */
    $scope.fnGetRecordPage = function(pageNumber){
      loaderService.start();
      var payload= $scope.fnGenerateOdataQueryParameters(pageNumber);
        ReportFactory.getTileReports(payload).then(
            function (result) {
                loaderService.stop();
                if (!result.error) {
                    $scope.myReportData = result.data;
                    $scope.totalReports = parseInt(result.count);

                    // Update isSelected property for reportData
                    for (var i = 0; i < $scope.myReportData.length; i++) {
                        $scope.myReportData[i].isSelected = false;
                    }
                    if ($scope.totalReports === 0) {
                        $scope.startPageShown = 0;
                        $scope.endPageShown = 0;
                    } else {
                        $scope.startPageShown = $scope.startIndex + 1;
                        $scope.endPageShown = ($scope.endIndex > $scope.totalReports) ? $scope.totalReports : $scope.endIndex;
                    }
                }
            }
        );
    };

    /**
     * Initialises the report library
     */
    $scope.fnPageInitialization = function () {
        $scope.fnGetRecordPage(1); // second parameter is for whether page initialization called it
        $scope.pagination.current = 1;
        $scope.fnHideReportPanel('auto'); // Whenever the page initialises, the report panel will not be shown
      //This needs to be called manually as watchers are called during initialization as well
    };
  $scope.fnInit=function()
  { $scope.$broadcast(ConstantService.MANAGE_REPORTS_SCREEN + '_INIT_WATCHERS');
    if(ReportFactory.data.watchInitialization) {
    $scope.fnPageInitialization();
  }

  };
  $scope.fnInit();
    $scope.$on('MANAGE_REPORT_TILES_INIT', function () {
        $scope.fnPageInitialization();
    });
}]);



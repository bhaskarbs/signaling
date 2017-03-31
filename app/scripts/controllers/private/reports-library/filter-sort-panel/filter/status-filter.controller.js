'use strict';

/**
 * @ngdoc function
 * @name saintApp.controller.auth:StatusFilterController
 * @description
 * # StatusFilterController
 * Controller of the saintApp
 */
angular.module('saintApp')
  .controller('StatusFilterController', ['$scope', 'UrlService', 'ReportFactory', 'ConstantService', function (scope, UrlService, ReportFactory, ConstantService) {
    scope.statusList = [];
    scope.collapse = false;
    scope.collapsePanel = false;
    scope.select = {
      selectAll: false
    };
    scope.reportData = ReportFactory.data;
    /**
     * @description This function handles filter persistance.
     */
    scope.fnFilterClick = function (filter, categoryName, columnName, category, selectAll) {
      var existingStory = _.findWhere(ReportFactory.data.selectedFilters, {'filterName': categoryName});
      if (!existingStory && selectAll !== false) {
          var newSelectedFilter = {};
          newSelectedFilter.filterName = categoryName;
          newSelectedFilter.contents = [];
          newSelectedFilter.contents.push(filter);
          newSelectedFilter.dbFilterName = columnName;
          newSelectedFilter.category = category;
          ReportFactory.data.selectedFilters.push(newSelectedFilter);
      } else {
        var index = scope.fnGetIndex();
        var reportFactory = ReportFactory.data.selectedFilters;
        if ((reportFactory[index].contents.indexOf(filter)<0) && (selectAll === true || selectAll === undefined)) {
          reportFactory[index].contents.push(filter);
        } else if ((reportFactory[index].contents.indexOf(filter)>=0) && (!scope.select.selectAll) ) {
          var indexTwo = reportFactory[index].contents.lastIndexOf(filter);
          reportFactory[index].contents.splice(indexTwo, 1);
          if (reportFactory[index].contents.length === 0) {
            reportFactory.splice(index, 1);
          }
        }
      }

      var keyToPersist = 'FILTER_' + categoryName.replace(' ', '_').toUpperCase();
      var valueToPersist = _.findWhere(ReportFactory.data.selectedFilters, {'filterName': categoryName});
      //Update Persistence
      ReportFactory.persistPreference(keyToPersist, valueToPersist);
    };
    /**
     * @description This function handles to get configured status.
     *
     */
    scope.fnGetStatusList = function () {
      ReportFactory.getMasterReportStatus().then(function (result) {
        if (result.data) {
          var counter = 0, selectedStatusFilter = _.findWhere(scope.reportData.selectedFilters, {'filterName': ConstantService.STATUS_KEY});
          _.each(result.data, function (data) {
              var selectedFlag = false;
              if (selectedStatusFilter) {
                if (selectedStatusFilter.contents.indexOf(data)>=0) {
                  counter++;
                  selectedFlag = true;
                } else {
                  selectedFlag = false;
                }
              }
              scope.statusList.push({
                'name': data, 'selected': selectedFlag
              });
            scope.select.selectAll = counter > 3 ? true : false;
          });
        }
      });
    };
    scope.fnGetIndex = function () {
      var filters = ReportFactory.data.selectedFilters;
      var index = -1;
      for( var i=0; i <filters.length; i++){
        if(filters[i].filterName === ConstantService.STATUS_KEY){
           index = i;
           return index;
        }
      }
      return index;
    };
    /**
     * @description This function handles individual status click event.
     */
    scope.fnOnStatusSelected = function (item) {
      var counter = 0;
      _.each(scope.statusList, function (list) {
        if(list.selected){
          counter++;
        }
      });
      scope.select.selectAll = counter > 3 ? true : false;
      scope.fnFilterClick(item.name, ConstantService.STATUS_KEY, ConstantService.DB_STATUS_KEY, ConstantService.STATUS_KEY);
    };
    /**
     * @description This function handles updating individual status.
     */
    scope.fnUpdateSelectAll = function (flag, updateDB) {
      _.each(scope.statusList, function (list) {
        list.selected = flag;
        if(updateDB){
            scope.fnFilterClick(list.name, ConstantService.STATUS_KEY, ConstantService.DB_STATUS_KEY, ConstantService.STATUS_KEY);
        }
      });
    };
    /**
     * @description This function handles select all check event
     */
    scope.fnOnSelectAll = function(){
      scope.fnUpdateSelectAll(scope.select.selectAll, true);
    };
    /**
     * @description This watch to check for applied filters and update status accordingly.
     */
    scope.$watch('reportData.selectedFilters', function (filter) {
      if ((filter !== undefined) && (filter.length > 0)) {
        var statusFilter = _.findWhere(filter, {'filterName': ConstantService.STATUS_KEY});
        if (!statusFilter) {
          scope.fnUpdateSelectAll(false,false);
        } else {
          var counter = 0;
          _.each(scope.statusList, function (list) {
            if(statusFilter.contents.indexOf(list.name)>=0){
              counter++;
              list.selected = true;
            }else{
              list.selected = false;
            }
          });
          scope.select.selectAll = counter > 3 ? true : false;
        }
      }else{
        scope.select.selectAll = false;
        scope.fnUpdateSelectAll(false,false);
      }
    }, true);
    scope.fnInit = function () {
      scope.fnGetStatusList();
    };
    scope.fnInit();
  }]);

'use strict';
angular.module('saintApp')
  .controller('ReportsFilterBreadcrumb', ['$scope', 'ReportFactory', '$filter', 'DateService', 'ConstantService', function ($scope, ReportFactory, $filter, DateService, ConstantService) {
    $scope.breadCrumbs = [];
    $scope.report = ReportFactory.data;
    $scope.$watch('report.selectedFilters', function (filters) {
      if (filters.length > 0) {
        $scope.breadCrumbs = [];
        angular.forEach(filters, function (arrayValue) {

            if (arrayValue.category !== ConstantService.FILTER_CATEGORY_NUMBER) {
              angular.forEach(arrayValue.contents, function (value) {
                /*
                 The below condition checks whether the date is selected to display for the breadcrumbs and formats
                 the date string
                 */
                if (arrayValue.category === ConstantService.DATE_STRING) {
                  var splitDate = arrayValue.contents[0].split(',');
                  value = arrayValue.filterName + ' ' + DateService.getFormattedDateStringFromDateObject(new Date(splitDate[0])) + ConstantService.DATE_STRING_TO + DateService.getFormattedDateStringFromDateObject(new Date(splitDate[1]));

                }
                var object = {};
                object.filter = value;
                object.filterName = arrayValue.filterName;
                object.dbFilterName = arrayValue.dbFilterName;
                object.category = arrayValue.category;
                $scope.breadCrumbs.push(object);
              });
            }
          }
        );
      } else {
        $scope.breadCrumbs = [];
      }
    }, true);
    $scope.fnDateFormat = function (date) {
      return date;
    };
    $scope.fnFilterClick = function (filter, categoryName, columnName, category) {
      var existingStory = _.findWhere(ReportFactory.data.selectedFilters, {'filterName': categoryName});
      if (!existingStory) {
        var newSelectedFilter = {};
        newSelectedFilter.filterName = categoryName;
        newSelectedFilter.contents = [];
        newSelectedFilter.contents.push(filter);
        newSelectedFilter.dbFilterName = columnName;
        newSelectedFilter.category = category;
        ReportFactory.data.selectedFilters.push(newSelectedFilter);
      } else {
        /*
         The condition below checks whether the columnName is date,so to be spliced.
         */
        var index, tempObj;
        if (existingStory.category === ConstantService.DATE_STRING) {
          index = ReportFactory.data.selectedFilters.findIndex(function (existingStory) {
            return existingStory.filterName === categoryName;
          });
          tempObj = ReportFactory.data.selectedFilters[index];
          ReportFactory.data.selectedFilters.splice(index, 1);
          var checkBoxIndex = ReportFactory.data.checkedDateBoxes.indexOf(categoryName);
          ReportFactory.data.checkedDateBoxes.splice(checkBoxIndex, 1);

        }
        else {
          index = ReportFactory.data.selectedFilters.findIndex(function (existingStory) {
            return existingStory.filterName === categoryName;
          });
          tempObj = ReportFactory.data.selectedFilters[index];

          if (tempObj.contents.indexOf(filter) < 0) {
            tempObj.contents.push(filter);
            ReportFactory.data.selectedFilters.splice(index, 1, tempObj);
          } else {
            var indexTwo = ReportFactory.data.selectedFilters[index].contents.lastIndexOf(filter);
            ReportFactory.data.selectedFilters[index].contents.splice(indexTwo, 1);
            if(ReportFactory.data.selectedFilters[index].filterName===ConstantService.FILTER_DESCRIPTION)
            {
              $scope.$parent.fnRemoveFilters(ReportFactory.data.selectedFilters[index]);
            }
            if (ReportFactory.data.selectedFilters[index].contents.length === 0) {
              ReportFactory.data.selectedFilters.splice(index, 1);
            }
          }
        }

      }
      var keyToPersist = 'FILTER_' + categoryName.replace(' ', '_').toUpperCase();
      var valueToPersist = _.findWhere(ReportFactory.data.selectedFilters, {'filterName': categoryName});
      //Update Persistence
      ReportFactory.persistPreference(keyToPersist, valueToPersist);

    };

    $scope.fnCheckClear = function () {
      if ($scope.breadCrumbs.length > 0) {
        return true;
      }
      else {
        return false;
      }
    };

    $scope.fnClearFilters = function () {
      var keyToPersist = null;
      var valueToPersist = null;
      _.each(ReportFactory.data.selectedFilters, function (value) {
        keyToPersist = 'FILTER_' + value.filterName.replace(' ', '_').toUpperCase();
        ReportFactory.persistPreference(keyToPersist, valueToPersist);
      });
      ReportFactory.data.selectedFilters.splice(0, ReportFactory.data.selectedFilters.length);
      ReportFactory.data.checkedDateBoxes.splice(0, ReportFactory.data.checkedDateBoxes.length);
      $scope.$parent.fnRemoveFilters();
    };
  }]);

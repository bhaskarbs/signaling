/**
 * Created by apbhushan on 7/15/2016.
 */
/*this controller will be used to trigger the modal and toggle between the 2 views of the modal*/
'use strict';
angular.module('saintApp')
  .controller('UpdateCaseListModalParentController', ['$scope','ReportOutputFactory', function (scope,ReportOutputFactory) {
    scope.defaultView=true;
    scope.subreportNode={};
    scope.fnToggleToDefault=function(){
      scope.defaultView=true;
    };

    //scope.fnToggleTo=function() {
    //  alert("hi");
    //  angular.element('#caselistModal').modal('hide');
    //  scope.defaultView=true;
    //  scope.fnOpenUpdateCaseListModal(scope.subreportNode);
    //};

    scope.fnOpenUpdateCaseListModal = function (subreport) {
      ReportOutputFactory.data.selectedFilters=[];
      angular.element('#caselistModal').modal('show');
      scope.subreportNode = subreport;
      scope.fnToggleToDefault();
    };
    scope.$on('OPEN_FILTER_VIEW',function(){
      scope.defaultView=false;
    });
    scope.$on('HIDE_UPDATE_CASELIST_MODAL',function(){
      angular.element('#caselistModal').modal('hide');
    });


  }]);

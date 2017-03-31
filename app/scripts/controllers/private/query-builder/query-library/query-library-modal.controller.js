/**
 * Created by apbhushan on 6/2/2016.
 */
'use strict';
angular.module('saintApp').controller('QueryLibraryModalController', ['loaderService', 'ConstantService', 'DateService', 'LanguageService', 'UrlService', '$scope', 'QueryFactory', '$timeout', function (loaderService, ConstantService, DateService, LanguageService, UrlService, scope, QueryFactory, $timeout) {


    //ID retrieval of the query clicked in modal
    scope.fnFetchQueryData = function (idQuery) {
        QueryFactory.getQueryDetail(idQuery).then(function (response) {
            scope.selectedQueryData = response.data[0];
        });
    };

    //Recieving the query group
    scope.$on('SEND_THE_QUERYGROUP', function (event, queryGroup) {
      scope.myQueryData=[];
      scope.queriesFetched=0;
      var url=scope.allQueryLibraryDataUrl+'&$top='+scope.queriesToBeFetched+'&$skip=0';
      scope.fngetQueryData(url);
        scope.groupReference = queryGroup;
        angular.element('#queryModal').modal('show');
    });

    //Inserting the query
    scope.fnInsQuery = function () {
        var queryData = JSON.parse(scope.selectedQueryData.setQueries.results[0].JSON_VALUE)[0];
        scope.groupReference.rules.push(queryData.jSON);
        angular.forEach(scope.filter.setEntities, function(setEntity){
          scope.fnPopulateQueryBuilder(setEntity.jSON.group, setEntity.jSON);
        });
        angular.element('#queryModal').modal('hide');
    };

    //Query details from query builder
    scope.fngetQueryData = function (url) {
        QueryFactory.getQueryData(url).then(
            function (result) {
                loaderService.stop();
                if (!result.error) {
                  angular.forEach(result.data,function(value){
                    scope.myQueryData.push(value);
                  });
                    scope.totalQuery = parseInt(result.count);

                    // Update isSelected property for queryData
                    for (var i = 0; i < scope.myQueryData.length; i++) {
                        scope.myQueryData[i].isSelected = false;
                    }
                }
            }
        );
    };

  //Lazy loading
  scope.fnLoadMoreQueries= function (){
    scope.queriesFetched+=scope.queriesToBeShown;
    var url=scope.allQueryLibraryDataUrl;
    url=url+'&$top='+scope.queriesToBeFetched+'&$skip='+ scope.queriesFetched;
    scope.fngetQueryData(url);
  };

    //Search function for Insert new Query
    scope.fnSearchQuerydata = function () {
        if (scope.querySearch.length > 0) {
          scope.queriesFetched=0;
            var modalSearchInput = scope.querySearch;
            var tempUrl=UrlService.getService('GET_QUERY_LIBRARY_SEARCH')+ '(SEARCH_QUERY_INPUT=\''+ modalSearchInput +'\')/Results?$select=QUERY_KEY,QUERY_NAME,DESCRIPTION,Audit_CreatedBy,Audit_UpdatedDt&$inlinecount=allpages';
            var queryfilterurl = tempUrl+'&$top='+scope.queriesToBeFetched+'&$skip=0';
            scope.allQueryLibraryDataUrl=tempUrl;
          QueryFactory.getQueryData(queryfilterurl).then(
                function (result) {
                    loaderService.stop();
                    if (!result.error) {
                        scope.myQueryData=[];
                        scope.myQueryData = result.data;
                        scope.totalQuery = parseInt(result.count);
                    }
                }
            );
        }
        else {
          scope.allQueryLibraryDataUrl=UrlService.getService('GET_QUERY_LIBRARY') + '(IN_DESCRIPTION=\'*\',IN_QUERY_NAME=\'*\')/Results?$select=QUERY_KEY,QUERY_NAME,DESCRIPTION,Audit_CreatedBy,Audit_UpdatedDt&$inlinecount=allpages';
            QueryFactory.getQueryData(scope.allQueryLibraryDataUrl).then(
                function (result) {
                    loaderService.stop();
                    if (!result.error) {
                        scope.myQueryData=[];
                        scope.myQueryData = result.data;
                        scope.totalQuery = parseInt(result.count);
                    }
                }
            );
        }
    };

    scope.$on('MANAGE_QUERY_TILES_INIT', function () {
        scope.fnPageInitialization();
    });

    scope.$on('ngRepeatFinished', function () {
        $timeout(
            function () {
                scope.containerHeight = $('#ql_tile_panel').outerHeight(true) - $('#ql_breadcrumb').outerHeight(true) - $('#ql_display_detail').outerHeight(true) - $('#ql_paginator').outerHeight(true);
            }, 0);
    });

scope.fnInit=function(){
  scope.myQueryDataRepo = [];
  scope.queriesToBeShown=5;
  scope.queriesToBeFetched = 5;
  scope.queriesFetched=0;
  scope.myQueryData = [];
  scope.totalQuery = 0;
  scope.startPageShown = 0;
  scope.endPageShown = 0;
  scope.queryPerPage = 50; // this should match however many results your API puts on one page
  scope.queryFactoryData = QueryFactory.data;
  scope.sortBy = '';
  scope.containerHeight = 0;
  scope.selectedQueryData = null;
  scope.querySearch = null;
  scope.allQueryLibraryDataUrl = UrlService.getService('GET_QUERY_LIBRARY') + '(IN_DESCRIPTION=\'*\',IN_QUERY_NAME=\'*\')/Results?$select=QUERY_KEY,QUERY_NAME,DESCRIPTION,Audit_CreatedBy,Audit_UpdatedDt&$inlinecount=allpages';
};
  scope.fnInit();
}]);



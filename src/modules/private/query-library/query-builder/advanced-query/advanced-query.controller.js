 'use strict';

/**
 * @ngdoc function
 * @name saintApp.controller.auth:caselist:AdvancedQueryController
 * @description
 * # AdvancedQueryController
 * Controller of the saintApp
 */
angular.module('saintApp')
  .controller('QueryLibraryBuilderAdvancedQueryController', ['QueryGeneratorService', '$scope', 'QueryFactory', 'QueryGroupEntity', function (QueryGeneratorService, scope, QueryFactory, QueryGroupEntity) {
    scope.defaultQuery = null;
    scope.finalQuery = null;
    scope.queryFactoryData = QueryFactory.data;
    scope.showExpand = false;
    scope.operators = null;
    scope.dimensions = null;
    scope.expandQueryBox = false;
    scope.groupEntity = angular.copy(QueryGroupEntity);

    scope.fnUpdateDisplayQuery = function(querySet){
      scope.finalQuery = null;
      scope.finalQuery = QueryGeneratorService.computeDisplaySQL(querySet) || null;
    };

    /**
     * @description This watch to check for any UpdateQuery Set, so that appropriate Query String is formed.
     */
    scope.$watch('queryFactoryData.updateQuerySet', function(value){
      scope.finalQuery = null;
      if(value && value.length>0) {
        scope.groupEntity = value[0].jSON;
        scope.fnUpdateDisplayQuery((value[0].jSON && value[0].jSON.group) || value[0].jSON);
      }
    }, true);

    scope.fnInit = function(){
      scope.finalQuery = null;
      scope.defaultQuery = null;
    };
    scope.fnInit();
  }]);

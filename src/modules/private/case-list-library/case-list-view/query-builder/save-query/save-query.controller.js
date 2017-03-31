'use strict';
angular.module('saintApp')
  .controller('QueryBuilderSaveQueryController', ['loaderService','QueryGeneratorService','QuerySetEntity', 'QueryFactory', '$scope', 'ConstantService', function (loaderService,QueryGeneratorService, QuerySetEntity, QueryFactory, scope, ConstantService) {

    scope.dialogMode = ConstantService.SAVE_QUERY;

    scope.$on('SEND_THE_QUERYGROUP_SAVEQUERY', function (event, queryGroup) {
      scope.groupToBeSaved = queryGroup;
      angular.element('#saveQueryModal').modal('show');
    });

    /**
     * Save the query library
     */
    scope.fnSaveQueryToLibrary = function (queryGroup) {
      loaderService.start();
      var querySet = angular.copy(QuerySetEntity);
      querySet.jSON = {'group': angular.copy(queryGroup)};
      querySet.sQLQuery = QueryGeneratorService.computeActualSQL(querySet.jSON.group).sql;
      var setArray = [];
      setArray.push(querySet);
      QueryFactory.saveQueryToLibrary(scope.queryName, scope.queryDescription, scope.dialogMode, setArray).then(
        function () {
          loaderService.stop();
          angular.element('#saveQueryModal').modal('hide');
        });
    };

    scope.fnOnCancel = function () {
      angular.element('#saveQueryModal').modal('hide');
    };

  }]);

'use strict';
angular.module('saintApp')
  .directive('queryString',['logService', 'QueryGeneratorService', 'ConstantService', '$filter', function(LogService, QueryGeneratorService, ConstantService, $filter){
    return {
      scope : {
        operators : '=',
        group : '=',
        caseListObject : '='
      },
      template : '<span data-ng-bind-html="groupInString"></span>',
      link : function(scope){
        scope.groupInString = null;
        scope.$watch('group',function(value){
          LogService.log(scope.operators,scope.group);
          if(value && scope.operators && scope.group.source !== 'source'){
            scope.groupInString = QueryGeneratorService.computeDisplaySQL(scope.group);
          }
          else{
            scope.groupInString = '';
            angular.forEach(scope.group.rules, function(rule){
              if(scope.group.rules.indexOf(rule)>0){
                scope.groupInString += ' ' + scope.group.groupOperator.name + ' ';
              }
              scope.groupInString += '( '+rule.dimension.name + ' is ' + rule.operator.name + ' ' + $filter('date')(scope.caseListObject.reportingStartDate, ConstantService.SAINT_DATE_FORMAT) + ' and ' + $filter('date')(scope.caseListObject.reportingEndDate, ConstantService.SAINT_DATE_FORMAT) + ' )';
            });
          }
        });
      }
    };
  }]);

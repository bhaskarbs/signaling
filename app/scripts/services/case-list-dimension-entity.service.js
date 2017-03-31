'use strict';
angular.module('saintApp').service('CaseListDimensionEntity', [function () {
  return {
    'dimensionId':null,
    'dimensionValue':null,
    'dimensionKey':null,
    'dimensionValues':[],
    'dimensionContainerLength':null,
    'bclKey':null,
    'dimensionGroup':null,
    'dimensionName':null,
    'configKey':null,
    'isSelected':null

  };
}]);

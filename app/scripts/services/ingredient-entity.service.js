'use strict';
angular.module('saintApp')
  .service('IngredientEntity',[ function() {
  return {
    'ingredientName':'',
    'ingredientId':'',
    'products':[],
    'licenses':[]
  };
}]);

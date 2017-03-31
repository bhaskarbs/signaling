'use strict';
angular.module('saintApp').factory('IngredientFactory',['IngredientEntity','$http','$q','UrlService','LanguageService','alertService','ProductEntity','LicenseEntity', function(IngredientEntity,$http,$q,UrlService,LanguageService,alertService,ProductEntity,LicenseEntity) {
  var ingredient = function(data) {
    angular.extend(this, data);
  };
  ingredient.data = {
    list :[]
  };
  ingredient.getIngredientMorphedData=function(ingredients){
    return _.map(ingredients,function(object){
      var actualObject=angular.copy(IngredientEntity);
      var productList = object.productsList.results;
      actualObject.ingredientName=object.FAMILY_DESC;
      actualObject.ingredientId=object.FAMILY_CODE;
      actualObject.products = _.map(productList,function(temp){
        var productObject = angular.copy(ProductEntity);
        productObject.productId = temp.PRODUCT_KEY;
        productObject.productName = temp.TRADE_NAME;
        productObject.productFormulation = temp.FORMULATION_DESC;

        return productObject;
      });
      if(productList){
        for(var i=0;i<productList.length;i++){
          if(productList[i].Licenses && productList[i].Licenses.results){
            for(var j=0;j<productList[i].Licenses.results.length;j++){
              var temp=productList[i].Licenses.results[j];
              var licenceObject=angular.copy(LicenseEntity);
              licenceObject.licenseId=temp.LICENSE_KEY;
              licenceObject.licenseName=temp.LIC_NUMBER;
              actualObject.licenses.push(licenceObject);
            }
          }
        }
      }
      return actualObject;
    });
  };
  ingredient.getIngredients=function(){
    var deferred = $q.defer();
    if(ingredient.data.list.length>0){
      deferred.resolve({'data': ingredient.data.list, 'message': ''});
    }else{
      $http.get(UrlService.getService('GET_INGREDIENTS'))
        .success(function(response){
          try{
            ingredient.data.list=ingredient.getIngredientMorphedData(response.d.results);
            deferred.resolve({'data': ingredient.data.list, 'message': ''});
          }catch(e){
            alertService.warn(LanguageService.MESSAGES.FAILED_GET_INGREDIENTS_LIST);
            deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_INGREDIENTS_LIST});
          }
        })
        .error(function(){
          alertService.error(LanguageService.MESSAGES.FAILED_GET_INGREDIENTS_LIST);
          deferred.resolve({'error': 'ok', 'message': LanguageService.MESSAGES.FAILED_GET_INGREDIENTS_LIST});
        });
    }
    return deferred.promise;
  };
  return ingredient;
}]);

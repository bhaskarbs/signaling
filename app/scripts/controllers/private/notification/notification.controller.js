'use strict';

angular.module('saintApp')
  .controller('NotificationController', ['$scope','NotificationFactory','ConstantService','$sce','UrlService','$state','DateService','LanguageService','loaderService',
    function ($scope,NotificationFactory,ConstantService,$sce,UrlService,$state,DateService,LanguageService,loaderService) {

      $scope.fnInit = function () {
        $scope.topValue = 10;
        $scope.skipValue = 0;
        $scope.notificationList=[];
        $scope.filterParam = '';
        $scope.isFromLazyLoad = false;
        $scope.notificationCreatedDate = null;
        $scope.notificationFactoryData=NotificationFactory.data;
        $scope.showFilterPanel = true;
        $scope.fngetFilterConfig();
        $scope.select = {
          selectAll: false
        };
        $scope.fnNotificationList();
      };
      $scope.$on('$destroy', function(){
        $('body').css('overflow','auto');
      });

     //Function to make notifications read

      $scope.fnToggleFilterPanel = function () {
        $scope.showFilterPanel = !$scope.showFilterPanel;
      };
      $scope.fnUpdateSelectAll = function (flag) {
        $scope.notificationFactoryData.selectedFilters.splice(0);
        _.each($scope.getFilterConfig, function (list) {
          list.selected = flag;
        });
      };
      $scope.fnOnSelectAll = function () {
        $scope.fnUpdateSelectAll($scope.select.selectAll);
      };

      $scope.fnNotificationList= function (){
        var notificationFilterUrl;
        var tempUrl = UrlService.getService('GET_NOTIFICATIONS_LIST');
        if(($scope.filterParam !== '') &&($scope.filterParam !== undefined)){
          notificationFilterUrl = tempUrl + $scope.filterParam;
        }else{
          notificationFilterUrl = tempUrl;
        }
        notificationFilterUrl = notificationFilterUrl + '&$top='+$scope.topValue+'&$skip=' +$scope.skipValue+'&$inlinecount=allpages';
        //todo update notification URL with filter parameter
        loaderService.start();
        NotificationFactory.notificationList(notificationFilterUrl).then(function(result) {
          loaderService.stop();
          if (!result.error) {
            if($scope.isFromLazyLoad === false)
            {
              $scope.notificationList = [];
            }
            angular.forEach(result.data,function(value){
              $scope.notificationList.push(value);
            });
          }
          loaderService.stop();
        });};

      $scope.fnGetNotificationMessage= function (notificationObj){
       return $sce.trustAsHtml(notificationObj);
      };

       $scope.fnNavigateFromNotification = function(notificationObj){
        var notificationObjectTypeKey = notificationObj.objectTypeKey;
        switch (notificationObjectTypeKey) {
          case 1:
            $scope.fnNavigate(ConstantService.STATE.NOTIFICATION_REPORT,{'id': notificationObj.objectKey});
            break;
          case 2 :
            $scope.fnNavigate(ConstantService.STATE.QUERY_LIBRARY_BUILDER,{'id': notificationObj.objectKey,'pageMode': 'shared'});
            break;
          case 3:
            $scope.fnNavigate(ConstantService.STATE.NOTIFICATION_REPORT,{'id': notificationObj.objectKey});
            break;
          case 4 :
            $scope.fnNavigate(ConstantService.STATE.CASE_LIST_VISUALS_STATE,{'id': notificationObj.objectKey,'page':2,'pageMode': 'edit'});
            break;
        }
      };

      $scope.fngetFilterConfig = function () {
        loaderService.start();
        NotificationFactory.getFilterConfig().then(function (result) {
          $scope.getFilterConfig=result.data;
          loaderService.stop();
        });
      };
      $scope.fnGenerateOdataParameters=function(){
        var orFilters=[];
        var tempUrl='';
        if($scope.notificationFactoryData.selectedFilters.length>0) {
          tempUrl += '&$filter=';
          angular.forEach($scope.notificationFactoryData.selectedFilters, function (value) {
            orFilters.push('EVENT_NOTIFICATION_GROUP_NAME eq \'' + value.filterCategory + '\'');
          });
          tempUrl += '(' + orFilters.join(' or ') + ')';
        }
        return(tempUrl);
        };
      $scope.fnClickfilterCategory = function(notification){
        if($scope.select.selectAll && !notification.selected){
          $scope.select.selectAll=false;
          var selectedFilters=[];
          angular.forEach($scope.getFilterConfig,function(filter){
            if(filter.selected) {
              selectedFilters.push({'filterCategory': filter.filterCategory});
            }
          });
          $scope.notificationFactoryData.selectedFilters=selectedFilters;
        }else{
          var existingStory = _.findWhere( $scope.notificationFactoryData.selectedFilters, {'filterCategory': notification.filterCategory});
       if(!existingStory && notification.selected){
         if($scope.notificationFactoryData.selectedFilters.length===$scope.getFilterConfig.length-1){
           $scope.notificationFactoryData.selectedFilters.splice(0);
           $scope.select.selectAll=true;
         }else{
           $scope.notificationFactoryData.selectedFilters.push({'filterCategory':notification.filterCategory});
         }
      }
        else if(existingStory && !notification.selected)
       {
         var filterIndex = $scope.notificationFactoryData.selectedFilters.findIndex(function (existingStory) {
           return existingStory.filterCategory === notification.filterCategory;
         });
         $scope.notificationFactoryData.selectedFilters.splice(filterIndex, 1);
       }
    }
      };
      $scope.$watch('notificationFactoryData.selectedFilters', function (newValue,oldValue) {
        if(JSON.stringify(newValue)!==JSON.stringify(oldValue)){
        $scope.filterParam=$scope.fnGenerateOdataParameters();
        $scope.isFromLazyLoad = false;
        $scope.skipValue=0;
        $scope.fnNotificationList();
      }}, true);
      $scope.fnLoadMoreNotifications = function(){
        $scope.isFromLazyLoad = true;
        $scope.skipValue+=$scope.topValue;
        $scope.filterParam = $scope.fnGenerateOdataParameters();
        $scope.fnNotificationList();
      };

      $scope.fnCalculateCreatedDate = function(notificationObj){
        return NotificationFactory.calculateCreatedDate(notificationObj);
      };
      $scope.fnInit();
    }]);

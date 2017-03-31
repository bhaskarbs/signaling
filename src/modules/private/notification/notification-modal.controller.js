'use strict';

angular.module('saintApp')
  .controller('NotificationControllerModal', ['$scope','NotificationFactory','ConstantService','$sce','UrlService','$state','DateService','LanguageService','loaderService',
    function ($scope,NotificationFactory,ConstantService,$sce,UrlService,$state,DateService,LanguageService,loaderService) {

      $scope.fnInit = function () {
        $scope.topValue = 5;
        $scope.skipValue = 0;
        $scope.notificationList=[];
        $scope.isFromLazyLoad = false;
        $scope.notificationPopupToggle = false;
        $scope.notificationCreatedDate = null;
      };
      //Function to make notifications read
      $scope.fnMakeNotificationsRead = function(notificationsData){
        $scope.notificationPopupToggle = true;
        $scope.fnNotificationList();
        if(notificationsData.length){
          NotificationFactory.makeNotificationsRead(notificationsData).then(function(){

          });
        }
      };
      $scope.fnKeepModalOpen = function(){
        event.stopPropagation();
      };

      $scope.fnNotificationList= function (){
        var notificationFilterUrl = UrlService.getService('GET_NOTIFICATIONS_LIST')+ '&$top='+$scope.topValue+'&$skip=' +$scope.skipValue+'&$inlinecount=allpages';
        NotificationFactory.notificationList(notificationFilterUrl).then(function(result) {
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

      $scope.fnGetNotificationMessage= function (domObj){
         return $sce.trustAsHtml(domObj);
      };

      $scope.fnNavigateFromNotification = function(notificationObj){
        $scope.notificationPopupToggle = false;
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
      $scope.fnLoadMoreNotifications = function(){
        $scope.isFromLazyLoad = true;
        $scope.skipValue+=$scope.topValue;
        $scope.fnNotificationList();
      };
      $scope.fnCloseModal = function(){
        $scope.notificationPopupToggle = false;
        $scope.fnNavigate(ConstantService.STATE.NOTIFICATION_SCREEN);
      };

      $scope.fnCalculateCreatedDate = function(notificationObj){
        return NotificationFactory.calculateCreatedDate(notificationObj);
      };
      $scope.fnInit();
    }]);

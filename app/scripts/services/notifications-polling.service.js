'use strict';
angular.module('saintApp').service('NotificationsPollingService',['$rootScope','NotificationFactory','alertService','UrlService', function (rootScope,NotificationFactory,alertService,UrlService) {
  var notificationPollObj = function (data){
    angular.extend(this,data);
  };
  notificationPollObj.data = { response: {}, count: 0 };
  var response={};
  var host = UrlService.getService('NOTIFICATION_POLLING_SERVICE');
  var params = {'url': host};
  //Creating pollWorker Web Worker
  rootScope.pollWorker = new Worker('worker/notifications-web-worker.js');

 //Method to send messing to polling web worker
  var poller = function() {
     rootScope.pollWorker.postMessage = rootScope.pollWorker.webkitPostMessage || rootScope.pollWorker.postMessage;
     rootScope.pollWorker.postMessage(JSON.stringify(params));
    };

  //Method to recieve message from Web Worker
   rootScope.pollWorker.onmessage = function (msg) {
           if (typeof msg.data === 'string') {
                response = JSON.parse(msg.data);
            }
            else {
                response = msg.data;
            }
            if(response.response){
              notificationPollObj.data.count = response.response.count;
              notificationPollObj.data.response = response.response.data;
            }
       };
    rootScope.pollWorker.onerror = function (error) {
        alertService.error('Error caused at : ' + error.lineno + ' in file : ' + error.filename + 'and the error is : ' + error.message);
    };

    notificationPollObj.fnInitializePoller = function () {
       poller();
    };
    return notificationPollObj;
}]);

'use strict';
angular.module('icomps.log',[])
.provider('logService', [function(){
	var _options={
		'ENABLED':false,
		'LEVEL':'LOG'
	};

	var LEVELS={'LOG':1,'INFO':2,'WARN':3,'ERROR':4};
	return {
		'setLogLevel':function(level){
			if(typeof level==='string' && (level==='LOG' || level==='INFO' || level==='WARN' || level==='ERROR')){
				_options.LEVEL=level;
			}
		},
		'setLog':function(logStatus){
			if(typeof logStatus ==='boolean'){
				_options.ENABLED=logStatus;
			}
		},
		'$get':['$log',function($log){
			var logger = {};
			/* Priority 4 i.e ERROR*/
			logger.error = function(){
				if(_options.ENABLED){
					if(LEVELS[_options.LEVEL]<=4){
						for(var key in arguments){$log.error(arguments[key]);}
					}
				}
			};
			/* Priority 3 i.e WARN*/
			logger.warn = function(){
				if(_options.ENABLED){
					if(LEVELS[_options.LEVEL]<=3){
						for(var key in arguments){$log.warn(arguments[key]);}
					}
				}
			};
			/* Priority 2 i.e INFO*/
			logger.info = function(){
				if(_options.ENABLED){
					if(LEVELS[_options.LEVEL]<=2){
						for(var key in arguments){$log.info(arguments[key]);}
					}
				}
			};
			/* Priority 1 i.e LOG*/
			logger.log = function(){
				if(_options.ENABLED){
					if(LEVELS[_options.LEVEL]<=1){
						for(var key in arguments){$log.log(arguments[key]);}
					}
				}
			};
			return logger;
		}]
	};
}]);

angular.module('icomps.loader',[])
//Usage loaderService.stop() loaderService.start();
.provider('loaderService',[function(){
	return {
		'$get':['$timeout', function($timeout) {
				var loader = function(data) {
					angular.extend(this, data);
				};
				loader.stop = function() {
					if (!angular.element('#icompsLoaderWidget').hasClass('icomps-loaded')) {
						$timeout(function() {
							angular.element('#icompsLoaderWidget').addClass('icomps-loaded');
						},0);
					}
				};
				loader.start = function() {
					if(angular.element('#icompsLoaderWidget').hasClass('icomps-loaded')) {
						angular.element('#icompsLoaderWidget').removeClass('icomps-loaded');
					}
				};
				return loader;
			}
		]
	};
}])
//Usage <div data-loader status="true"></div>
.directive('loader',[function(){
	return {
		'scope':{},
		'replace':true,
		'restrict':'A',
		'template':'<div class="icomps"><div id="icompsLoaderWidget" class="icomps-loader"> <img src="images/icomps/loader.gif" class="icomps-loader-icon" /></div></div>'
	};
}])
//Usage <div data-widget-loader status="true"></div>
.directive('widgetLoader', [function() {
	return {
		scope:{
			 status:'='
		},
		// Restrict it to be an attribute in this case
		restrict: 'A',
		replace:true,
		template: '<div class="icomps"><div data-ng-show="loaderStatus" align="center" class="icomps-wloader"><img src="images/icomps/loader.gif"/></div></div>',
		link: function(scope) {
			scope.loaderStatus=false;
			scope.$watch('status',function(value){
				if(value !== undefined && value !==null && typeof value ==='boolean'){
					scope.loaderStatus=angular.copy(value);
				}else{
					scope.loaderStatus=angular.copy(false);
				}
			});
		}
	};
}]);
angular.module('icomps.util',['icomps.log'])
.provider('applicationService',[function(){
	return {
		$get:['logService', function(logService) {
			var application = function(data) {
				angular.extend(this, data);
			};
			application.safeApply = function(scopeObject) {
				try{
					logService.log('Before applying $apply');
					if(!scopeObject.$$phase) {
						logService.log('$apply not in progress');
						scopeObject.$apply();
						logService.log('$apply applied');
					}else{
						logService.log('$apply already in progress');
					}
				}catch(e){}
			};
			return application;
		}]
	};
}])
.directive('whenScrolled', [function() {
  return function(scope, elm, attr) {
    var raw = elm[0];

    elm.bind('scroll', function() {
      if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
        scope.$apply(attr.whenScrolled);
      }
    });
  };
}])
.provider('commonService', [function(){
	return {
		'$get':function() {
			var common = function(data) {
				angular.extend(this, data);
			};
			common.searchArray = function(someArray, target) {
				var status = false;
				for (var i = 0; i < someArray.length; i++) {
					if (someArray[i] === target) {
						status = true;
						break;
					}
				}
				return status;
			};
			common.removeElementFromArray = function(someArray, target) {
				var temp = [];
				for (var i = 0; i < someArray.length; i++) {
					if (someArray[i] !== target) {
						temp.push(someArray[i]);
					}
				}
				return temp;
			};
			common.trimArray = function(data) {
				var temp = [];
				for (var i = 0; i < data.length; i++) {
					if (data[i] !== '' && data[i] !== null && data[i] !== undefined) {
						temp.push(data[i]);
					}
				}
				return temp;
			};
			common.getNonEmptyString = function(someData) {
				if (common.isEmptyString(someData)) {
					someData = '';
				}
				return someData;
			};
			common.isEmptyString = function(someString) {
				if (angular.isString(someString) && someString.length === 0) {
					return true;
				} else {
					return false;
				}
			};
			common.isEmptyArray = function(someArray) {
				if (angular.isArray(someArray) && someArray.length > 0) {
					return false;
				} else {
					return true;
				}
			};
			common.isEmptyJson = function(someJson) {
				if (angular.isObject(someJson) && Object.keys(someJson).length > 0) {
					return false;
				} else {
					return true;
				}
			};
			common.getDateFromMilliseconds = function(milliseconds) {
				try {
					if (angular.isNumber(milliseconds)) {
						var dateObject = new Date(milliseconds);
						var dateString = (dateObject.getMonth() + 1) + '/' + (dateObject.getDate()) + '/' + (dateObject.getYear() + 1900);
						return dateString;
					} else {
						return '';
					}
				} catch (e) {
					return '';
				}
			};
			common.getMilliSecondsFromDate = function(dateString) {
				try {
					if (!this.isEmptyString(dateString)) {
						return new Date(dateString).getTime();
					} else {
						return '';
					}
				} catch (e) {
					return '';
				}
			};
			/*common.jsonImages = function(files, cb) {
				var fileAttachments = [];
				for (var i = 0; i<files.length; i++) {
					var imageReader = new FileReader();
					imageReader.onload = (function(aFile, lastFileIndex, currentFileIndex) {
						return function(e) {
							var tempFileData = e.target.result;
							var dataContent = tempFileData.split(',');
							fileAttachments.push({
								'imageName': aFile.name,
								'mimeType': dataContent[0].split(':')[1].split(';')[0],
								'encodedString': dataContent[1]
							});
							if (lastFileIndex === currentFileIndex) {
								cb(fileAttachments);
							}
						};
					})(files[i], files.length - 1, i);
					imageReader.readAsDataURL(files[i]);
				}
			};*/
			common.removeDuplicatesIn1DArray = function(someArray) {
				var tempArray = [];
				someArray = common.trimArray(someArray);
				for (var i = 0; i < someArray.length; i++) {
					if (!common.searchArray(tempArray, someArray[i])) {
						tempArray.push(someArray[i]);
					}
				}
				return tempArray;
			};
			common.getJsonFromQuery=function(query){
				var allPairs=query.split('&');
				var temp={};
				for (var i = 0; i < allPairs.length; i++) {
					var pair=allPairs[i].split('=');
					temp[pair[0]]=pair[1];
				}
				return angular.copy(temp);
			};
			return common;
		}
	};
}]);
angular.module('icomps.alert',['icomps.util'])
.provider('alertService',[function(){
	return{
		'$get':['$rootScope', 'commonService', function($rootScope, common) {
			var alert = {};
			alert.alerts = [];
			alert.timer = null;
			alert.clearAlert = function() {
				if (alert.timer) {
					window.clearTimeout(alert.timer);
					alert.timer = null;
				}
				alert.timer = window.setTimeout(function() {
					alert.closeAlert();
					$rootScope.$broadcast('clearAlerts');
				}, 5000);
			};
			alert.closeAlert = function() {
				alert.alerts.splice(0, 1);
				window.clearTimeout(alert.timer);
				alert.timer = null;
			};
			alert.emptyAlert = function() {
				alert.alerts[0] = {
					'type': 'success',
					'message': 'Please try again'
				};
				alert.clearAlert();
			};
			alert.success = function(message) {
				if (!common.isEmptyString(message)) {
					alert.alerts[0] = {
						'type': 'success',
						'message': message
					};
					alert.clearAlert();
				} else {
					alert.emptyAlert();
				}
			};
			alert.info = function(message) {
				if (!common.isEmptyString(message)) {
					alert.alerts[0] = {
						'type': 'info',
						'message': message
					};
					alert.clearAlert();
				} else {
					alert.emptyAlert();
				}
			};
			alert.warn = function(message) {
				if (!common.isEmptyString(message)) {
					alert.alerts[0] = {
						'type': 'warning',
						'message': message
					};
					alert.clearAlert();
				} else {
					alert.emptyAlert();
				}
			};
			alert.error = function(message) {
				if (!common.isEmptyString(message)) {
					alert.alerts[0] = {
						'type': 'danger',
						'message': message
					};
					alert.clearAlert();
				} else {
					alert.emptyAlert();
				}
			};
			return alert;
		}]
	};
}])
//Usage <div data-alerts></div>
.directive('alerts',[function(){
	return {
		'scope':{},
		'replace':true,
		'restrict':'A',
		'template':'<div class="icomps"><div class="icomps-alerts"> <div alert data-ng-repeat="alert in alerts" type="alert.type" close="closeAlert($index)"><span><i data-ng-if="alert.type==\'danger\'" class="icon-exclamation-circle"></i> </span><span data-ng-bind="alert.message"></span> </div> </div></div>',
		'controller':['$scope','alertService','applicationService',function($scope,alertService,applicationService){
			$scope.alerts=alertService.alerts;
			$scope.closeAlert=alertService.closeAlert;
			$scope.$on('clearAlerts',function(){
				applicationService.safeApply($scope);
			});
		}]
	};
}]);
angular.module('icomps',['icomps.loader','icomps.alert']);

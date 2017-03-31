'use strict';
//Sample usage
//tooltip="{{request.requestName}}"  tooltip-placement="bottom" data-ng-bind="request.requestName|truncate:15:'...'"
angular.module('saintApp').filter('truncate', function () {
	return function (text, length, end) {
		if(text){
			if (text.length <= length ) {// || text.length - end.length <= length
					return text;
			}else {
					return String(text).substring(0, length) + end;
			}
		}
	};
});

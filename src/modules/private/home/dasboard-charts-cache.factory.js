'use strict';
angular.module('saintApp').factory('DashboardChartsCacheFactory',function () {
  	var svgElementMap=[];
    	return {
  		    getSvgElementMap: function () {
  		     return svgElementMap;
  		  	},

  		  	setSvgElementMap: function (cuid,svgElement,isImage) {
  		  		var svgData = {
  				    'cuid': cuid,
  				    'svg': svgElement,
  				    'isImage':isImage

  				};
  		      svgElementMap.push(svgData);
  		  	}
    	};
});



'use strict';
angular.module('saintApp')
  .directive('visual', ['DashboardChartsCacheFactory',function (DashboardChartsCacheFactory) {
    return {
      'scope': {
        'url': '=',
        'load': '=',
        'selector': '=',
        'mode':'=',
        'chartPosition':'=',
        'cuid':'='
      },
      'restrict': 'A',
      'template': '',
      'link': function (scope, element) {
        scope.$watch('load', function (value) {
          if (scope.url) {
            if (_.isBoolean(value) && value) {
                var CachedSvg=DashboardChartsCacheFactory.getSvgElementMap();
                if (CachedSvg.length > 0){
                  angular.forEach(CachedSvg, function(svgElement){
                    if(svgElement.cuid === scope.cuid){
                        if(svgElement.isImage){
                          scope.frameImage=svgElement.svg;
                          scope.fnLoadNewImage();
                        }else {
                           scope.svgElement=svgElement.svg;
                           scope.fnAppendDOM();
                        }
                    }
                  });
                } else {
                  scope.fnLoadUrl();
                }
           }
          }
        });
        scope.fnAppendDOM = function () {
          angular.element(element).append(scope.svgElement);
          scope.fnStopLoading();
        };
        scope.fnLoadNewImage=function(){
          angular.element(element).attr('src',scope.frameImage);
          angular.element('#'+scope.iframeElementId).remove();
          scope.fnStopLoading();
        };
        scope.fnInit = function () {
          var iframeElement = document.createElement('iframe');
          scope.iframeElementId = 'visualImage' + new Date().getTime() + Math.random().toString().substr(2);
          iframeElement.setAttribute('id', scope.iframeElementId);
          iframeElement.setAttribute('style','width:100%;height:196px;border:none;opacity:0;display:none');
          iframeElement.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms');
          element.parent().append(iframeElement);
          scope.elementWidth = $(element).width();
          scope.elementHeight = $(element).height();
        };
        scope.fnInit();
      },
      'controller': ['$scope', '$timeout', '$rootScope', function (scope, $timeout, $rootScope) {
        scope.iframeElementId = null;
        scope.frameDocument = null;
        scope.frameImage = null;
        scope.frameImageParent = null;
        scope.frameElementParent = null;
        scope.svgElement = null;
        $rootScope.$on('sessionClosed', function () {
          angular.element('#' + scope.iframeElementId).remove();
          scope.fnStopLoading();
        });
        scope.fnExecuteActionsIfElementLoaded = function (frameId, selector, callback) {
          try {
            var lumiraFrameDocument = document.getElementById(frameId).contentDocument;
            var childFrameDocument = lumiraFrameDocument.getElementById('openDocChildFrame').contentDocument;
            var element = childFrameDocument.querySelector(selector);
            if (typeof(element) !== 'undefined' && element !== null) {
              callback(selector);
            } else {
              scope.fnStartIdentifyingElement(frameId, selector, callback);
            }
            //loaderService.stop();FIXME once it is verified
          } catch (e) {
          }
        };
        scope.fnStartIdentifyingElement = function (frameId, selectorString, callback) {
          $timeout(function () {
            scope.fnExecuteActionsIfElementLoaded(frameId, selectorString, callback);
          }, 1000);
        };
        scope.fnLoadUrl = function () {
          var tempElement = document.getElementById(scope.iframeElementId);
          tempElement.onload = function () {
            scope.fnFrameOnLoad();
          };
          tempElement.src = scope.url;
        };
        scope.fnStartLoading = function () {
          angular.element(scope.frameElementParent).animate({'opacity': 0.06}, 1500);
        };
        scope.fnStopLoading = function () {
          scope.load=false;
          angular.element(scope.frameElementParent).animate({'opacity': 1}, 1500);
        };
        scope.fnIdentifyElement = function () {
          var lumiraFrameDocument = document.getElementById(scope.iframeElementId).contentDocument;
          var childFrameDocument = lumiraFrameDocument.getElementById('openDocChildFrame').contentDocument;
          if(scope.mode === 'story' ){
            scope.getIframeElement(childFrameDocument);
            scope.fnAppendDOM();
          }else if(scope.mode === 'visual' ){
            var element = childFrameDocument.querySelector(scope.selector);
            if(element.nodeName==='IMG'){
              scope.frameImage=element.src;
            }else{
              scope.frameImage=element.style.backgroundImage;
              scope.frameImage=scope.frameImage.substring(4,scope.frameImage.length-1).replace(/"/g, ' ');
            }
            DashboardChartsCacheFactory.setSvgElementMap(scope.cuid,scope.frameImage,true);
            scope.fnLoadNewImage();
          }
        };
         scope.getValue=function(max,required){
          var linearScale=d3.scale.linear().domain([0,max]).range([0,1]);
          return linearScale(required);
          };
        scope.getIframeElement = function (childFrameDocument) {
          scope.svgElement = childFrameDocument.getElementsByClassName('sap-bi-va-visualizer-Visualizer-frame-area')[scope.chartPosition];
          var transformWidth = scope.getValue(scope.svgElement.offsetWidth,scope.elementWidth);
          var transformHeight = scope.getValue(scope.svgElement.offsetHeight,scope.elementHeight);
          scope.svgElement.setAttribute('style', 'transform-origin: 0px 0px 0px; transform: scale(' + transformWidth + ',' + transformHeight + ');');
          DashboardChartsCacheFactory.setSvgElementMap(scope.cuid,scope.svgElement,false);
        };
        scope.fnFrameOnLoad = function () {
          try {
            scope.fnStartIdentifyingElement(scope.iframeElementId, scope.selector, scope.fnIdentifyElement);
          } catch (e) {
          }
        };
      }]
    };
  }]);



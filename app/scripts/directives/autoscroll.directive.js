'use strict';
//Usage data-autoscroll for the element
angular.module('saintApp').directive('autoscroll', ['$timeout', function($timeout){
  return {
    /* negative priority to make this post link function run first */
    priority:-1,
    link: function(scope, element, attrs){
      scope.fnSetElementHeightByDocument=function(){
        scope.operation=1;
        var elementOffset=$(element).offset();
        var bodyHeight=$(document.body).height();
        var requiredHeight=parseInt(bodyHeight-elementOffset.top-60);//XXX 60px is the Hardcoded height for header
        $(element).css({'height':requiredHeight+'px','overflow-y':'auto'});
      };
      scope.fnSetElementHeightByDocumentScroll=function(){
        scope.operation=2;
        var elementOffset=$(element).offset();
        var bodyHeight=document.body.scrollHeight;
        var requiredHeight=parseInt(bodyHeight-elementOffset.top);
        $(element).css({'height':requiredHeight+'px','overflow-y':'auto'});
      };
      scope.$watch(attrs.autoscroll,function(value) {
        if (!isNaN(attrs.timer) && value === true) {
          $timeout(function () {
            scope.fnSetElementHeightByDocumentScroll();
          }, attrs.timer);
        }
      });
      scope.$watch(attrs.timer,function(timerValue){
        if (!isNaN(timerValue) && !attrs.autoscroll && attrs.autoscroll!==true){
          $timeout(function () {
            scope.fnSetElementHeightByDocument();
          }, timerValue);
        }
      });
      scope.fnEvaluateHeights=function(){
        if(scope.operation===1){
          scope.fnSetElementHeightByDocument();
        }
      };
      $(window).resize(function(){
        scope.fnEvaluateHeights();
        scope.$apply();
      });
      scope.$on('scroll-resize',function(){
        scope.fnEvaluateHeights();
      });
      scope.fnSetElementHeightByDocument();
    }
  };
}]);
angular.module('saintApp').directive('viewportAutoHeight', ['$timeout','$window', function($timeout,$window){
  return {
    /* negative priority to make this post link function run first */
    priority:-1,
    link: function(scope, element, attrs){
      scope.isBodyScroll=attrs.bodyScroll?true:false;
      scope.spaceBottom=attrs.spaceBottom;
      scope.resizeDiv=function(){
        if(!scope.isBodyScroll){
          $('body').css('overflow','hidden');
        }
       var w = angular.element($window);
       $window.scroll(0,0);
       scope.getWindow = function () {
            return {
                'height': w.height(),
                'width': w.width()
            };
        };
        scope.setHeight=function(offsetTop){
            var requiredHeight=w.height()-offsetTop;
          if(scope.spaceBottom){
            requiredHeight=requiredHeight-scope.spaceBottom;
          }
            $timeout(function () {
             $(element).css({'height':requiredHeight,'overflow-y':'auto','overflow-x':'hidden'});
          }, 0);
           };
        scope.$watch(scope.getWindow, function () {
            var elementOffsetTop=$(element).offset().top;
            scope.setHeight(elementOffsetTop);
        }, true);
        scope.$watch( function() {
                scope.offsetTop = element.offset().top;
            } );
        scope.$watch( 'offsetTop', function(newOffsetTop) {
           scope.setHeight(newOffsetTop);
            } );
        w.bind('resize', function () {
            scope.$apply();
        });
    };
      scope.resizeDiv();
    }
  };
}]);

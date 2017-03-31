'use strict';
/*
 Dependency is : https://github.com/mathiasbynens/jquery-placeholder
 This is written but not used, It will solve placeholders problem for IE9
 Usage <div class="dsui-test-class" placeholders load="true"></div>
 */
angular.module('saintApp')
  .directive('scrollElement',['ConstantService', function(ConstantService) {
    return {
      scope:{
        'source':'@',
        'destination':'@'
      },
      // Restrict it to be an attribute in this case
      restrict: 'A',
      link: function(scope, element, attrs) {
        attrs.$observe('source',function(){
          /*
          Inside this function it check for any scroll from reports panel,
          and if it is ,hides the reports summary panel.Else, it must be from scroll spy.
           */
          if(scope.source===ConstantService.REPORTS_LIBRARY_POPOVER_ID) {
            scope.scrollHidePopover();
          }
          else
          {
            scope.scroll();
          }
        });
        scope.scrollHidePopover=function(){
          $(element).scroll(function(){
            $('.dsui-milestone-popover-summary').hide();
          });
        };
        scope.scroll=function(){

          $(element).click(function(){
            var spiedTop=$('#'+scope.destination).offset().top;
            var spiedTopPosition = $('#'+scope.source).scrollTop() - $('#'+scope.source).offset().top + spiedTop;
            $('#'+scope.source).animate(
              {
                scrollTop:spiedTopPosition
              },1000
            );

          });
        };
      }
    };
  }]);

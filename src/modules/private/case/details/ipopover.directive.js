'use strict';
angular.module('saintApp')
  .directive('ipopover', ['$compile', function ($compile) {
    return {
      restrict: 'A',
      scope: {
        load: '=',
        page: '@'
      },
      compile: function () {
        return {
          pre: function (scope, element) {
            var popElement = '<div class="popover fade right"><div class="arrow"></div><div class="popover-content" data-ng-include="myPage"></div></div>';
            popElement = $compile(popElement)(scope);
            $(element).after(popElement);
            scope.myPopOverElement = $(element).next('.popover');
          },
          post: function (scope, element) {
            scope.$watch('load', function (loadValue) {
              if (loadValue && scope.page && scope.page.length > 0) {
                scope.fnInit();
              }
            });
            scope.fnClosePopover = function () {
              scope.myPopOverElement.css({'display': 'none'});
              scope.myPopOverElement.removeClass('in');

            };
            scope.fnOpenPopover = function () {
              scope.fnResizeHandler();
              scope.myPopOverElement.css({'display': 'block'});
              scope.myPopOverElement.addClass('in');
            };
            scope.fnCreatePositionForPopover = function () {
              var top = Math.floor(($(element).outerHeight() / 2) - (scope.myPopOverElement.outerHeight() / 2));
              top = top > 0 ? (-1 * top) : top;
              scope.myPopOverElement.css({'top': top});
              scope.myPopOverElement.css({
                'left': Math.floor($(element).outerWidth() + $(element).position().left)
              });
            };
            scope.fnIsOpen = function () {
              var elementData = $(element).data('ipopover');
              return elementData && elementData.open;
            };
            $(element).click(function () {
              if (scope.fnIsOpen()) {
                $(element).removeData('ipopover');
                scope.fnClosePopover();
              } else {
                $(element).data('ipopover', {'open': true});
                scope.fnOpenPopover();
              }
            });
            scope.fnResizeHandler = function () {
              window.setTimeout(function () {
                scope.fnIdentifyResize();
              }, 100);
            };
            scope.fnIdentifyResize = function () {
              var newTop = Math.floor(($(element).outerHeight() / 2) - (scope.myPopOverElement.outerHeight() / 2));
              var currentTop = scope.myPopOverElement.position().top;
              var status = false;
              if (newTop < 0 && currentTop < 0 && newTop !== currentTop) {
                status = true;
              }
              if (scope.fnIsOpen()) {
                if (status) {
                  scope.fnHandleResize();
                }
                scope.fnResizeHandler();
              }
            };
          }
        };
      },
      controller: ['$scope', function (scope) {
        scope.fnHandleResize = function () {
          scope.fnCreatePositionForPopover();
        };
        scope.fnInit = function () {
          scope.myPage = scope.page;
          scope.fnCreatePositionForPopover();
          scope.fnResizeHandler();
        };
      }]
    };
  }]);

'use strict';
/*
 frame - frame id
 lumiraFrame - lumira frame id
 frameStyleSheet - stylesheet path to load in frame stylesheet to inject
 lumiraFrameStyleSheet - stylesheet path to load in lumiraFrame stylesheet to inject
 frameSelectors - [] which have the elements to toggle in frame
 lumiraFrameSelectors - [] which have the elements to toggle in lumira frame
 lumiraFrameSelectorsToClick - [] which have the elements to click in the lumira frame
 */
angular.module('saintApp')
  .directive('visualExpand', [function () {
    return {
      restrict: 'A',
      scope: {
        url: '=',
        options: '=',
        load: '=',
        height: '='
      },
      link: function (scope, element) {
        scope.element = element;
        scope.$watch('load', function (newValue) {
          if (newValue && newValue === true) {
            scope.fnInit();
            scope.load = false;
          }
        });
      },
      controller: ['$scope', '$timeout', function (scope, $timeout) {
        scope.element = null;
        scope.frameId = null;
        scope.lumiraFrameId = null;
        scope.frameDocumentObject = null;
        scope.lumiraFrameDocumentObject = null;
        scope.lumiraFrameWindowObject = null;
        scope.frameStyleSheet = null;
        scope.lumiraFrameStyleSheet = null;
        scope.frameSelectors = [];
        scope.lumiraFrameSelectors = [];
        scope.lumiraFrameSelectorsToClick = [];

        scope.fnIdentifyValues = function () {
          if (scope.options) {
            if (scope.options.hasOwnProperty('frame')) {
              scope.frameId = scope.options.frame;
            }
            if (scope.options.hasOwnProperty('lumiraFrame')) {
              scope.lumiraFrameId = scope.options.lumiraFrame;
            }
            if (scope.options.hasOwnProperty('frameStyleSheet')) {
              scope.frameStyleSheet = scope.options.frameStyleSheet;
            }
            if (scope.options.hasOwnProperty('lumiraFrameStyleSheet')) {
              scope.lumiraFrameStyleSheet = scope.options.lumiraFrameStyleSheet;
            }
            if (scope.options.hasOwnProperty('frameSelectors')) {
              scope.frameSelectors = scope.options.frameSelectors;
            }
            if (scope.options.hasOwnProperty('lumiraFrameSelectors')) {
              scope.lumiraFrameSelectors = scope.options.lumiraFrameSelectors;
            }
            if (scope.options.hasOwnProperty('lumiraFrameSelectorsToClick')) {
              scope.lumiraFrameSelectorsToClick = scope.options.lumiraFrameSelectorsToClick;
            }
          }
        };

        scope.fnLoadDocumentObject = function (aFrameDocumentObject, aDocumentObject, aFrameId, aCallback) {
          var frameSelector = 'iframe#' + aFrameId;
          scope.fnExecuteActionsIfElementLoaded(aDocumentObject, frameSelector, function () {
            aFrameDocumentObject = aDocumentObject.querySelector(frameSelector).contentDocument;
            if (aFrameDocumentObject === undefined || aFrameDocumentObject === null) {
              window.setTimeout(function (tempFrameDocumentObject, tempDocumentObject, tempFrameId, tempCallback) {
                scope.fnLoadDocumentObject(tempFrameDocumentObject, tempDocumentObject, tempFrameId, tempCallback);
              }, 5000, aFrameDocumentObject, aDocumentObject, aFrameId, aCallback);
            }
            if (aCallback instanceof Function) {
              aCallback();
            }
          });
        };

        scope.fnLoadCss = function (aDocumentObject, aStyleSheet) {
          window.setTimeout(function (tempDocumentObject, tempStyleSheet) {
            var cssFileLink = tempDocumentObject.createElement('link');
            cssFileLink.href = tempStyleSheet;
            cssFileLink.rel = 'stylesheet';
            cssFileLink.type = 'text/css';
            tempDocumentObject.head.appendChild(cssFileLink);
          }, 5000, aDocumentObject, aStyleSheet);
        };

        scope.fnToggleElements = function (documentObject, selectors) {
          selectors.forEach(function (tempSelector) {
            scope.fnExecuteActionsIfElementLoaded(documentObject, tempSelector, function () {
              documentObject.querySelector(tempSelector).style.display = 'none';
            });
          });
        };
          scope.fnToggleElementClicks = function (documentObject, selectors) {
          selectors.forEach(function (tempSelector) {
            window.setTimeout(function (tempDocumentObject, tempSelectorString) {
              scope.fnExecuteActionsIfElementLoaded(tempDocumentObject, tempSelectorString, function () {
                tempDocumentObject.querySelector(tempSelectorString).click();
              });
            }, 0, documentObject, tempSelector);
          });
        };

        scope.fnExecuteActionsIfElementLoaded = function (documentObject, selectorString, callback) {
          try {
            var element = documentObject.querySelector(selectorString);
            if (element !== 'undefined' && typeof(element) !== 'undefined' && element !== null) {
              if (callback instanceof Function) {
                callback();
              }
            } else {
              window.setTimeout(function (tempDocumentObject, tempSelectorString, tempCallback) {
                scope.fnExecuteActionsIfElementLoaded(tempDocumentObject, tempSelectorString, tempCallback);
              }, 5000, documentObject, selectorString, callback);
            }
          } catch (e) {
          }
        };

        scope.fnCreateFrame = function (element) {
          var frameElement = document.createElement('iframe');
          frameElement.id = scope.frameId;
          if (scope.height === undefined){
            frameElement.height = '900px';
          } else {
            frameElement.height = scope.height;
          }
          frameElement.width = '100%';
          element[0].appendChild(frameElement);
        };
        scope.fnLumiraFrameLoadingCompleted=function(){
          var status = false;
          var loadingElement = scope.lumiraFrameDocumentObject.querySelector('#ExplorerPage #maincontainer #contentwrapper #genericLoadingArea');
          if(loadingElement){
            var display = loadingElement.style.display;
            if(display==='none'){
              status = true;
            }
          }
          return status;
        };
        scope.fnIdentifyLumiraFrameLoadedCompletely = function () {
          var tempStatus = true;
          if (scope.fnLumiraFrameLoadingCompleted()) {
            var modals = scope.lumiraFrameDocumentObject.querySelectorAll('.sapUiDlg.sapUiDlgModal');
            for (var i = 0; i < modals.length; i++) {
              if (modals[i].style.display === 'block') {
                tempStatus = false;
                break;
              }
            }
          } else {
            tempStatus = false;
          }
          return tempStatus;
        };
        scope.fnHandleLumiraFrameOtherActions = function () {
          $timeout(function () {
            if (scope.fnIdentifyLumiraFrameLoadedCompletely()) {
              $timeout(function () {
                scope.fnEnableLumiraFrameOtherActions();
              }, 1000);
            } else {
              scope.fnHandleLumiraFrameOtherActions();
            }
          }, 3000);
        };
        scope.fnEnableLumiraFrameOtherActions = function () {
          if (scope.lumiraFrameSelectors && scope.lumiraFrameSelectors.length > 0) {
            scope.fnToggleElements(scope.lumiraFrameDocumentObject, scope.lumiraFrameSelectors);
          }
          if (scope.lumiraFrameSelectorsToClick && scope.lumiraFrameSelectorsToClick.length > 0) {
            scope.fnToggleElementClicks(scope.lumiraFrameDocumentObject, scope.lumiraFrameSelectorsToClick);
          }
        };
        scope.fnHandleLumiraFrame = function () {
          if (scope.lumiraFrameStyleSheet && scope.lumiraFrameStyleSheet.length > 0) {
            scope.fnLoadCss(scope.lumiraFrameDocumentObject, scope.lumiraFrameStyleSheet);
          }
          scope.fnHandleLumiraFrameOtherActions();
        };
        scope.fnHandleLumiraFrameLoad = function () {
          if (scope.fnLumiraFrameLoadingCompleted()) {
            $timeout(function () {
              scope.fnHandleLumiraFrame();
            }, 0);
          } else {
            $timeout(function () {
              scope.fnHandleLumiraFrameLoad();
            }, 2000);
          }
        };
        scope.fnInit = function () {
          scope.fnIdentifyValues();
          if (scope.url && scope.url.length > 0) {
            scope.fnCreateFrame(scope.element);
            document.getElementById(scope.frameId).src = scope.url;
            document.getElementById(scope.frameId).onload = function () {
              var frameElement = document.getElementById(scope.frameId);
              scope.frameDocumentObject = frameElement.contentDocument;
              if (scope.frameStyleSheet && scope.frameStyleSheet.length > 0) {
                scope.fnLoadCss(scope.frameDocumentObject, scope.frameStyleSheet);
              }
              if (scope.frameSelectors && scope.frameSelectors.length > 0) {
                scope.fnToggleElements(scope.frameDocumentObject, scope.frameSelectors);
              }
              scope.fnLoadDocumentObject(scope.lumiraFrameDocumentObject, scope.frameDocumentObject, scope.lumiraFrameId, function () {
                scope.frameDocumentObject.getElementById(scope.lumiraFrameId).onload = function () {
                  scope.lumiraFrameDocumentObject = scope.frameDocumentObject.querySelector('iframe#' + scope.lumiraFrameId).contentDocument;
                  scope.lumiraFrameWindowObject = scope.frameDocumentObject.querySelector('iframe#' + scope.lumiraFrameId).contentWindow;
                  scope.fnHandleLumiraFrameLoad();
                };
              });
            };
          }
        };
      }]
    };
  }]);

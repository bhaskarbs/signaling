/*
* Created by Shivansh Singh Raghuvanshi @ 16-May-2015
*/
(function () {
    'use strict';
    angular.module('saintApp')
        .controller('ActionTrayController', ['ActionTrayFactory', '$scope', 'LanguageService', 'alertService', function (actionTrayFactory, $scope, LanguageService, alertService) {
            $scope.progressBarArray = [];
            $scope.currentState = false;//for close false and true for open
            $scope.openActionTrayFlag = false; // for dev purpose make it true
            $scope.stateView = LanguageService.CONSTANTS.ACTION_TRAY_STATEVIEW_BUILD;
            $scope.errorMessage = LanguageService.MESSAGES.ACTION_TRAY_DOWNLOAD_ERROR;
            $scope.loaderIcon = 0; //0 for spinning 1 for non spinning
            var initialization = true;
            var hasRegistered = false;
            $scope.toogleTray = function () {
                if ($scope.currentState) {
                    $scope.currentState = false;
                    $scope.stateView = LanguageService.CONSTANTS.ACTION_TRAY_STATEVIEW_BUILD;
                }
                else {
                    $scope.currentState = true;
                    $scope.stateView = LanguageService.CONSTANTS.ACTION_TRAY_STATEVIEW_CLOSE;
                }
            };
            $scope.openTray = function () {
                $scope.openActionTrayFlag = true;
                $scope.currentState = true;
                $scope.stateView = LanguageService.CONSTANTS.ACTION_TRAY_STATEVIEW_CLOSE;
            };
            $scope.closeTray = function () {
                $scope.currentState = false;
                $scope.openActionTrayFlag = false;

            };
            var lengthChange = function () {
                if (!initialization) {
                    if ($scope.progressBarArray.length === 0) {
                        $scope.closeTray();
                        alertService.info('All Actions Completed.Action Tray Closed.');
                    }
                    else {
                        var counter = 0;
                        for (var i = 0; i < $scope.progressBarArray.length ; i++) {
                            if ($scope.progressBarArray[i].state === -1) {
                                counter++;
                            }
                        }
                        if ($scope.progressBarArrayLengthCount === counter) {
                            $scope.loaderIcon = 1;
                        } else {
                            $scope.loaderIcon = 0;
                        }
                    }
                }
                else {
                    initialization = false;
                }
            };

            $scope.popDownloadFromTray = function (thisObj) {
                var key = _.find($scope.progressBarArray, function (current) {
                    return current.processId === parseInt(thisObj.target.parentElement.children[0].innerText);
                });
                $scope.progressBarArray.splice($scope.progressBarArray.indexOf(key), 1);
            };
            $scope.$watch('progressBarArray.length', function () {
                $scope.$$postDigest(function () {
                    hasRegistered = false;
                    lengthChange();
                });

            }, true);
            $scope.$on('generateReportEventFired', function (evt, data) {
                //state is introduced as new variable to moniter progress:  0 for start 1 for progress 2 for finished -1 for error
                if (!data.error) {
                    if ($scope.progressBarArray) {
                        if (data.Status !== 0) {
                            //update the process bar of downloading of current process ID
                            var key = _.find($scope.progressBarArray, function (current) {
                                return current.processId === data.processId;
                            });
                            key.Status = data.Status;
                            key.state = 1;
                            if (key.Status === 100) {
                                key.state = 2;
                                $scope.progressBarArray.splice($scope.progressBarArray.indexOf(key), 1);
                            }
                        }
                        else {
                            $scope.openTray();
                            $scope.progressBarArray.push({ 'Name': data.Name, 'Status': data.Status, 'processId': data.processId, 'state': 0 });
                        }
                    }
                }
                else {
                    var keys = _.find($scope.progressBarArray, function (current) {
                        return current.processId === data.processId;
                    });
                    keys.Status = LanguageService.MESSAGES.ACTION_TRAY_DOWNLOAD_ERROR;
                    keys.state = -1;
                }
            });
        }]);
})();

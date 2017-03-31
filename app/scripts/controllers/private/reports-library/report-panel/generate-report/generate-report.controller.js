/**
 * Created by vrevanna on 3/10/2016.
 * Modified by ssinghraghuvanshi for webworker integration 18 May 2016
 * Modified by ssinghraghuvanshi with reference to red line document provided by Mario
 * Modified by ssinghraghuvanshi with input from test team 6 June 2016
 */
(function () {
    'use strict';
    angular.module('saintApp')
      .controller('generateReportController', ['ConstantService', '$scope', 'loaderService', 'UrlService', '$http', '$rootScope', 'ActionTrayFactory', '$location', 'alertService', 'UserService',
        function (ConstantService, $scope, loaderService, UrlService, $http, $rootScope, ActionTrayFactory, $location,alertService, UserService) {
            $scope.cuid = '';
            $scope.bclKey = '';
            $scope.xSAPLogonToken = window.decodeURIComponent(UserService.data.oUser.boeToken);
            $scope.reportName = '';
            $scope.fnGenerateReport = function (cuid, bclKey, reportName) {
                $scope.cuid = cuid;
                $scope.bclKey = bclKey;
                $scope.reportName = reportName;
                if ($scope.currentStatus === ConstantService.OPEN) {
                    $scope.updateStatus(ConstantService.REPORT_STATUS_IN_PROGRESS);
                }
                if ($scope.cuid) {
                    $scope.getToken();
                }
            };

            //Function to login to BOE and to get Logon Token
            $scope.getToken = function () {
              var host = window.location.origin;
              var url = host + UrlService.getView('GENERATE_REPORT');
              if (typeof (Worker) !== 'undefined') {
                // Yes! Web worker support!
                $scope.generateReport(host, url);
              } else {
                // Sorry! No Web Worker support..
                window.open(url + '?cuid=' + $scope.cuid + '&id=' + $scope.bclKey + '&reportName=' + $scope.reportName + '&token=' + $scope.xSAPLogonToken);
              }
            };
            $scope.parseXML = function (instanceXML) {
                //Converting XML to DOM
                var domParserObj = new DOMParser();
                var parsedXmlObj = domParserObj.parseFromString(instanceXML, 'text/xml');
                parsedXmlObj.getElementsByTagName('attr')[1].textContent = $scope.bclKey;
                //Converting DOM to XML String
                var serializerObj = new XMLSerializer();
                var xmlStringObject = serializerObj.serializeToString(parsedXmlObj);
                return xmlStringObject;
            };
            $scope.getReportId = function (reportResourceXML) {
                var domParserObj = new DOMParser();
                var parsedXmlObj = domParserObj.parseFromString(reportResourceXML, 'text/xml');
                var reportId = parsedXmlObj.getElementsByTagName('id')[0].textContent;
                return reportId;
            };
            $scope.broadcastReportDownload = function (status, processId) {
                $rootScope.$broadcast('generateReportEventFired', {
                    'Name': $scope.reportName,
                    'Status': status,// send whatever you want,
                    'processId': processId
                });
            };
            $scope.generateReport = function (host, url) {
                var reportGenerator;
                try {
                    reportGenerator = new Worker('worker/generate-report-web-worker.js');
                    //increment in the counter to make global persistent with singelton object
                    ActionTrayFactory.setCounter();
                    // setting up the params to be passed
                    var params = {
                        'token': $scope.xSAPLogonToken,
                        'cuId': $scope.cuid,
                        'bclKey': $scope.bclKey,
                        'reportName': $scope.reportName,
                        'host': host,
                        'url': url,
                        'phase': 1,
                        'processId': ActionTrayFactory.getCounter()
                    };
                    $scope.broadcastReportDownload(0, ActionTrayFactory.getCounter());
                    // Take care of browser prefixes.
                    reportGenerator.postMessage = reportGenerator.webkitPostMessage || reportGenerator.postMessage;
                    reportGenerator.postMessage(JSON.stringify(params));
                    var response;
                    reportGenerator.onmessage = function (msg) {
                        if (msg.data) {
                            if (typeof msg.data === 'string') {
                                response = JSON.parse(msg.data);
                            }
                            else {
                                response = msg.data;
                            }
                            if (!response.error) {
                                try {
                                    switch (response.phase) {
                                        case 1:
                                            var xmlStringObject = $scope.parseXML(response.data);
                                            //setting up params for second call
                                            var paramsOne = {
                                                'phase': 2,
                                                'xmlStringObject': xmlStringObject
                                            };
                                            try {
                                                reportGenerator.postMessage(JSON.stringify(paramsOne));
                                                $scope.broadcastReportDownload(5, response.processId);
                                            }
                                            catch (e) {
                                                throw e;
                                            }
                                            break;
                                        case 2:
                                            var reportId = $scope.getReportId(response.data);
                                            //construct params for third call
                                            var paramsTwo = {
                                                'phase': 3,
                                                'reportId': reportId
                                            };
                                            try {
                                                reportGenerator.postMessage(JSON.stringify(paramsTwo));
                                                $scope.broadcastReportDownload(45, response.processId);
                                            }
                                            catch (e) {
                                                throw e;
                                            }
                                            break;
                                        case 3:
                                            try {
                                                var reportName = $scope.reportName + '.pdf';
                                                var blob = new Blob([msg.data.response], { type: 'application/pdf' });
                                                var objectUrl = URL.createObjectURL(blob);
                                                if (window.navigator.msSaveOrOpenBlob) {
                                                    window.navigator.msSaveOrOpenBlob(blob, reportName);
                                                    $scope.broadcastReportDownload(100, ActionTrayFactory.getCounter());
                                                } else {
                                                    var a = document.createElement('a');
                                                    document.body.appendChild(a);
                                                    a.style = 'display: none';
                                                    a.href = objectUrl;
                                                    a.download = reportName;
                                                    a.click();
                                                    $scope.broadcastReportDownload(100, response.processId);
                                                    setTimeout(function () {
                                                        window.URL.revokeObjectURL(objectUrl);
                                                    }, 1000);
                                                    alertService.info(reportName+' is downloaded successfully');
                                                }
                                            }
                                            catch (e) {
                                                throw e;
                                            }
                                            break;
                                        default:
                                    }
                                }
                                catch (ex) {
                                    throw ex;
                                }
                            }
                            else {
                                alertService.error('Error Occured :' + response.error);
                                $rootScope.$broadcast('generateReportEventFired', {
                                    'error': response.error,
                                    'processId': response.processId
                                });
                            }
                        }
                    };
                    reportGenerator.onerror = function (error) {
                        alertService.error('Error caused at : ' + error.lineno + ' in file : ' + error.filename + 'and the error is : ' + error.message);
                    };
                }
                catch (e) {
                    alertService.error('Error is :' + e);
                }
                finally {
                }
            };

        }]);
})();

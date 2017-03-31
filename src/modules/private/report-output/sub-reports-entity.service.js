/**
 * Created by ankitsrivastava6 on 7/31/2016.
 */
'use strict';
angular.module('saintApp').service('SubReportEntity',[function () {
  return {
    'bclKey' :null,
    'documentType' : null,
    'isSelectedInPackage' : null,
    'srtKey':null,
    'subReportName':null,
    'templateName':null,
    'bclName' :null,
    'bclDisplayName' : null,
    'isMainReport' : null,
    'selectAllFlag':null,
    'packageId':null,
    'isBlinded':null,
    'isFinal': null,
    'instanceId' : null
  };
}]);

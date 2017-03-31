'use strict';
describe('StatusFilterController Controller', function () {
  var scope, UrlService, ReportFactory, ConstantService, loaderService, ctrl, $q;
  var serviceObj = {
    data: {
      list: [],
      reportNames: [],
      reportStatus: [],
      reportTypes: [],
      reportDetails: null,
      filteredReports: [],
      reportTypeList: [],
      favouriteList: [],
      statusList: [],
      operationalTypes: [],
      selectedDetailReportIndex: null,
      selectedFilters: [],
      selectedTileId: null,
      reportPanelDetails: [],
      reportSort:{
        sortedBy:null,
        sortedByName:null,
        sortOrder:null
      }
    }
  };
  var statusListRes = {
    data: ['Overdue']
  };
   var prefResponse = {
    data : []
   };

  ReportFactory = {
    data: serviceObj.data,
    getMasterReportStatus : function(){
      return $q.when(statusListRes);
    },
    persistPreference : function(){
      return $q.when(prefResponse);
    }
  };
  beforeEach(function () {
    module('saintApp');
    inject(function ($injector,$controller, $rootScope) {
      UrlService = $injector.get('UrlService');
      loaderService = $injector.get('loaderService');
      ReportFactory = ReportFactory;
      ConstantService = $injector.get('ConstantService');
      scope = $rootScope.$new();
      $q = $injector.get('$q');
      ctrl = $controller('StatusFilterController', {
        $scope: scope,
        ReportFactory : ReportFactory,
        ConstantService : ConstantService,
        loaderService : loaderService,
        UrlService : UrlService
      });
    });
  });
  var select = {
    selectAll: false
  };
  it('should exists', function () {
    expect(ctrl).toBeDefined();
    expect(scope.statusList).toBeDefined();
    expect(scope.statusList).toEqual([]);
    expect(scope.collapse).toBeDefined();
    expect(scope.collapse).toBe(false);
    expect(scope.collapsePanel).toBeDefined();
    expect(scope.collapsePanel).toBe(false);
    expect(scope.select).toBeDefined();
    expect(scope.select).toEqual(select);
    expect(scope.reportData).toBeDefined();
    expect(scope.reportData).toEqual(serviceObj.data);
  });
  it('Should have Methods defined in it', function() {
    expect(scope.fnGetStatusList).toBeDefined();
    expect(scope.fnOnStatusSelected).toBeDefined();
    expect(scope.fnGetIndex).toBeDefined();
    expect(scope.fnUpdateSelectAll).toBeDefined();
    expect(scope.fnOnSelectAll).toBeDefined();
    expect(scope.fnFilterClick).toBeDefined();
    expect(scope.fnInit).toBeDefined();
  });
  it('should call the method fnInit()', function() {
    scope.fnInit();
  });
  it('should call the method fnGetStatusList()', function() {
    var statusList = [{ name: 'Overdue', selected: false }, { name: 'Overdue', selected: false }];
    scope.fnGetStatusList();
    scope.$apply();
    expect(scope.statusList).toEqual(statusList);
    scope.reportData.selectedFilters = [{'filterName' : 'Status','contents' : ['Overdue']}];
    scope.fnGetStatusList();
    scope.$apply();
  });
  it('should call the method fnOnStatusSelected()', function() {
    scope.select.selectAll = true;
    var item = [{'name': 'Overdue','selected': false}];
    scope.fnOnStatusSelected(item);
    scope.select.selectAll = false;
    scope.statusList = [{
      'name': 'Overdue',
      'selected': false
    },{
      'name': 'Overdue1',
      'selected': false
    },{
      'name': 'Overdue2',
      'selected': false
    },{
      'name': 'Overdue3',
      'selected': false
    },{
      'name': 'Overdue4',
      'selected': false
    }];
    item.selected = false;
    scope.fnOnStatusSelected(item);
  });
  it('should call the method fnGetIndex', function() {
    var result = scope.fnGetIndex();
    scope.reportData.selectedFilters = [{'filterName' : 'Status'}];
    result = scope.fnGetIndex();
    expect(result).toBeDefined();
    expect(result).toEqual(0);
  });
  it('fnUpdateSelectAll() should have been called', function() {
    scope.statusList = [{
      'name': 'Overdue',
      'selected': false
    },{
      'name': 'In Progress',
      'selected': false
    },{
      'name': 'Open',
      'selected': false
    },{
      'name': 'Completed',
      'selected': false
    }];
    scope.fnUpdateSelectAll(true, false);
  });
  it('fnOnSelectAll() should have been called', function() {
    scope.select.selectAll = false;
    ReportFactory.data.selectedFilters = [{'filterName':'Status','contents':['Overdue'],
      'dbFilterName':'STATUS_NAME','category':'Status'}];
    scope.statusList = [{
      'name': 'Overdue',
      'selected': false
    },{
      'name': 'In Progress',
      'selected': false
    },{
      'name': 'Open',
      'selected': false
    },{
      'name': 'Completed',
      'selected': false
    }];
    scope.fnOnSelectAll();
    scope.select.selectAll = true;
    scope.fnOnSelectAll();
  });
  it('fnFilterClick() should have been called', function() {
    ReportFactory.data.selectedFilters = [{'filterName':'Status','contents':['Overdue'],
      'dbFilterName':'STATUS_NAME','category':'Status'}];
    scope.fnFilterClick('Overdue','Status','STATUS_NAME','Status', false);
    scope.fnFilterClick('Overdue','Status123','STATUS_NAME','Status', true);
  });
  it('should execute the watch statement', function() {
    scope.reportData.selectedFilters = [{'key'  :'value'}];
    scope.$apply();
    scope.reportData.selectedFilters = [{'filterName' : 'Status'}];
    scope.statusList = [];
    scope.$apply();
    scope.reportData.selectedFilters = [{'filterName' : 'Status','contents' : ['filter']}];
    scope.statusList = [{'name' : 'filter'}];
    scope.$apply();
  });
});

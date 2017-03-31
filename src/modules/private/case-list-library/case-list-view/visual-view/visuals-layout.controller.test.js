'use strict';
describe('VisualsLayoutController Controller', function () {
  var $http, scope, $state, CaseListFactory, ConstantService, loaderService, $q, ctrl, $httpBackend;
  var serviceObj = {
    data: {
      caseListLib: [],
      selectedFilters: [],
      persistedData: [],
      selectedCaseListKey: null,
      caseListSort: {
        sortedBy: null,
        sortedByName: null,
        sortOrder: null
      },
      countries : [],
      excludeInclude: false,
      chartSelected : null,
      selectedChartsList : [],
      clickedChart: null,
      defaultQuery: null
    }
  };
  var countryDetails = {
    data: ['India','USA','UK','UAE']
  },
  chartDetails = {
    data : [{}]
  },
  chartDimension  = {
    data : {}
  };

  CaseListFactory = {
    data: serviceObj.data,
    getCountryDetails : function(){
      return $q.when(countryDetails);
    },
    getVisualChartsDetails : function(){
      return $q.when(chartDetails);
    },
    getChartDimensions : function(){
      return $q.when(chartDimension);
    }
  };


  beforeEach(function () {
    module('saintApp');
    inject(function ($injector,$controller, $rootScope) {
      $http = $injector.get('$http');
      $httpBackend = $injector.get('$httpBackend');
      $state = $injector.get('$state');
      $state.params = {'id' : 22};
      loaderService = $injector.get('loaderService');
      CaseListFactory = CaseListFactory;
      ConstantService = $injector.get('ConstantService');
      scope = $rootScope.$new();
      $q = $injector.get('$q');
      ctrl = $controller('VisualsLayoutController', {
        $scope: scope,
        CaseListFactory : CaseListFactory,
        ConstantService : ConstantService,
        loaderService : loaderService,
        $http : $http,
        $state : $state,
        $httpBackend :$httpBackend
      });
    });
  });
  it('should exists', function () {
    expect(ctrl).toBeDefined();
  });
  it('should have configs defined in it', function() {
    expect(scope.configArray).toBeDefined();
    expect(scope.filterNames).toBeDefined();
    expect(scope.sampleData).toBeDefined();
    expect(scope.countriesList).toBeDefined();
    expect(scope.counter).toBeDefined();
    expect(scope.baseCaseListKey).toBeDefined();
    expect(scope.caseListData).toBeDefined();
  });
  it('should have methods defined in it', function() {
    expect(scope.fnGetCountryCodes).toBeDefined();
    expect(scope.fnGetVisualChartsDetails).toBeDefined();
    expect(scope.fnGetChartsData).toBeDefined();
    expect(scope.fnUpdateSelectedChartsList).toBeDefined();
    expect(scope.fnInit).toBeDefined();
  });
  it('should call the method fnInit()', function() {
      scope.fnInit();
  });
  it('should call the method fnGetCountryCodes()', function() {
      scope.fnGetCountryCodes();
  });
  it('should call the method fnGetVisualChartsDetails()', function() {
      scope.fnGetVisualChartsDetails();
  });
  it('should call the method fnGetChartsData()', function() {
      scope.fnGetChartsData();
  });
  it('should call the method fnUpdateSelectedChartsList()', function() {
    scope.fnUpdateSelectedChartsList({
      data: { name : 'AUSTRALIA'},
      name: 'COUNTRY_OF_INCIDENCE',
      index : 0
    });
  });
});

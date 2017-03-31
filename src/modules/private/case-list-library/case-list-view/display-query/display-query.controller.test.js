'use strict';
//FIXME: To be fixed in query builder pull request

xdescribe('DisplayQueryController Controller', function () {
  var response, caseListData, value, filter, saveFlag, scope, ctrl, CaseListFactory, QueryGroupEntity, QueryRuleEntity, CaseListQueryService, ConstantService, CaseListQuerySetEntity, CaseListEntity, $stateParams;
  filter = 'sdfsd';
  saveFlag = 1;
  value = [{
    updateDB: 'true',
    columnName: 'some',
    contents: [{
      updateDB: 'true'
    },
      {
        updateDB: 'true'
      }]
  }
  ];
  caseListData = [{
    updateQueryString: true
  }];
  response = {
    data: 'some',
    error: false
  };
  beforeEach(function () {
    module('saintApp');
    inject(function ($injector, $controller, $rootScope) {
      scope = $rootScope.$new();
      CaseListFactory = $injector.get('CaseListFactory');
      QueryGroupEntity = $injector.get('QueryGroupEntity');
      QueryRuleEntity = $injector.get('QueryRuleEntity');
      CaseListQueryService = $injector.get('CaseListQueryService');
      ConstantService = $injector.get('ConstantService');
      CaseListQuerySetEntity = $injector.get('CaseListQuerySetEntity');
      CaseListEntity = $injector.get('CaseListEntity');
      $stateParams = $injector.get('$stateParams');
      spyOn(CaseListQueryService, 'computePayload').and.callFake(function () {
        return {
          then: function (callback) {
            return callback(response);
          }
        };
      });
      ctrl = $controller('DisplayQueryController', {
        $scope: scope,
        CaseListFactory: CaseListFactory,
        QueryGroupEntity: QueryGroupEntity,
        QueryRuleEntity: QueryRuleEntity,
        CaseListQueryService: CaseListQueryService,
        ConstantService: ConstantService,
        CaseListQuerySetEntity: CaseListQuerySetEntity,
        CaseListEntity: CaseListEntity,
        $stateParams: $stateParams
      });
    });
  });
  it('Should exists', function () {
    expect(ctrl).toBeDefined();
  });
  it('Should have dependencies', function () {
    expect(scope).toBeDefined();
    expect(CaseListFactory).toBeDefined();
    expect(QueryGroupEntity).toBeDefined();
    expect(QueryRuleEntity).toBeDefined();
    expect(CaseListQueryService).toBeDefined();
    expect(ConstantService).toBeDefined();
    expect(CaseListQuerySetEntity).toBeDefined();
    expect(CaseListEntity).toBeDefined();
    expect($stateParams).toBeDefined();

  });
  it('Should have predefined values', function () {
    expect(scope.defaultQuery).toBe(null);
    expect(scope.displayDefaultQuery).toBe(null);
    expect(scope.finalQuery).toBe(null);
    expect(scope.caseListData).toEqual(CaseListFactory.data);
    expect(scope.showExpand).toBe(false);
    expect(scope.operators).toBe(null);
    expect(scope.dimensions).toBe(null);
    expect(scope.expandQueryBox).toBe(0);
    expect(scope.groupEntity).toEqual(QueryGroupEntity);

  });
  it('Should have methods in it', function () {
    expect(scope.fnInit).toBeDefined();
    expect(scope.fnAppendIncludeExcludeCount).toBeDefined();
    expect(scope.$watch).toBeDefined();
    expect(scope.saveAnalyticalQuery).toBeDefined();
    expect(scope.composeGroupObject).toBeDefined();
  });

  it('Should call fnInit() function()', function () {
    scope.fnInit();
  });

  it('Should call fnAppendIncludeExcludeCount() function()', function () {
    scope.fnAppendIncludeExcludeCount();
    scope.defaultQuery = 'test';
  });

  it('Should call $watch function() for sourceQueryUI', function () {
    if (scope.caseListData) {
      scope.caseListData.caseListObject.sourceQueryUI = 'true';
    } else {
      scope.caseListData = {
        caseListObject: {
          sourceQueryUI: 'true'
        }
      };
    }
    scope.$digest();
    expect(scope.defaultQuery).toBe(scope.caseListData.caseListObject.sourceQueryUI);
  });

  it('Should call $watch function() for updateQueryString when condition true', function () {
    if (scope.caseListData) {
      scope.caseListData.updateQueryString = true;
      scope.caseListData.caseListObject.queryBuilderObject.setEntities = [{jSON: {group: {rules: 'some'}}}];
    } else {
      scope.caseListData = {
        updateQueryString: true
      };
    }
    scope.$digest();
    expect(scope.caseListData.updateQueryString).toBe(false);
  });
  it('Should call $watch function() for updateQueryString when if condition false', function () {
    if (scope.caseListData) {
      scope.caseListData.updateQueryString = true;
      scope.caseListData.caseListObject.queryBuilderObject.setEntities = '';
    }
    scope.$digest();
  });
  it('Should call $watch function() for updateQuerySet', function () {
    if (scope.caseListData) {
      scope.caseListData.updateQuerySet = [
        {
          jSON: {
            group: {
              rules: {
                operator: {
                  dataType: 'DATE'
                }
              }
            }
          }
        }
      ];
    } else {
      scope.caseListData = {
        updateQuerySet: [{
          jSON: true
        }]
      };
    }
    scope.$digest();
    expect(CaseListFactory.data.excludeInclude).toBe(true);
  });
  it('Should call $watch function() for selectedChartsList when condition false', function () {
    if (scope.caseListData) {
      scope.caseListData = {
        selectedChartsList: {'updateDB': true},
        caseListObject: {
          asOfDate: '27/04/2016'
        }
      };
    } else {
      scope.caseListData = {
        selectedChartsList: {
          updateDB: true
        }
      };
    }
  });

  it('Should call $watch function() for selectedChartsList when condition true', function () {
    if (scope.caseListData) {
      scope.caseListData = {
        selectedChartsList: ('update', ({updateDB: 'some'}))
      };
    } else {
      scope.caseListData = {
        selectedChartsList: {
          updateDB: true
        },
        updateDB: true
      };
    }
  });
  it('Should call saveAnalyticalQuery() function() when condition true', function () {
    if (filter && saveFlag) {
      filter = true;
      saveFlag = 2;
    }
    else {
      filter = true;
      saveFlag = 2;
    }
    spyOn(CaseListFactory, 'fnUpdateCaseList').and.callFake(function () {
      return {
        then: function (callback) {
          return callback(response);
        }
      };
    });
    scope.saveAnalyticalQuery(filter, saveFlag);
  });
  it('Should call saveAnalyticalQuery() function() when condition false', function () {
    if (filter && saveFlag) {
      filter = '';
      saveFlag = '';
    }
    else {
      filter = '';
      saveFlag = '';
    }
    response = {
      data: 'some',
      error: true
    };
    spyOn(CaseListFactory, 'fnUpdateCaseList').and.callFake(function () {
      return {
        then: function (callback) {
          return callback(response);
        }
      };
    });
    scope.saveAnalyticalQuery(filter, saveFlag);
  });

  it('Should call composeGroupObject() function() when value present', function () {
    if (scope.caseListData) {
      scope.caseListData.operatorsList = [{'dataType': 'some', name: 'includes'}];
      scope.caseListData.dimensionsList = [{
        'columnName': 'some',
        'dataType': 'some'
      }];
    }
    if (scope.groupEntity) {
      scope.groupEntity = {
        group: false
      };
    }
    scope.composeGroupObject(value);
  });

  it('Should call composeGroupObject() function() when condition chart.contents.length<1', function () {
    value = [{
      updateDB: 'true',
      columnName: 'some',
      contents: [{
        updateDB: 'true'
      }]
    }];
    scope.operators = {
      'dataType': ''
    };
    scope.composeGroupObject(value);
  });
});

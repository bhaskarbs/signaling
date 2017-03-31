'use strict';
//FIXME: To be fixed in query builder pull request

xdescribe('CaseListHeaderController Controller', function () {
  var scope, ConstantService,ReportFactory,$filter,$stateParams,CaseListEntity,CaseListFactory, $state, CaseListQueryService, alertService, LanguageService, CaseFactory, ctrl, $q;
  var location = '#';
  var date = '22/04/2016';
  var result = {
    data: {
      listed: 10,
      removed: 10,
      added: 10,
      annotated: 10,
      lastRun: 1,
      lastSaved: 1
    },
    error: false
  };
  var response = {
    data: 'some',
    error: false
  };
  beforeEach(function () {
    module('saintApp');
    module('saint-authorize');
    inject(function ($injector, $controller, $rootScope) {
      CaseListFactory = $injector.get('CaseListFactory');
      $state = $injector.get('$state');
      CaseListQueryService = $injector.get('CaseListQueryService');
      alertService = $injector.get('alertService');
      CaseFactory = $injector.get('CaseFactory');
      LanguageService = $injector.get('LanguageService');
      ConstantService = $injector.get('ConstantService');
      CaseListEntity = $injector.get('CaseListEntity');
      $stateParams = $injector.get('$stateParams');
      $filter = $injector.get('$filter');
      ReportFactory = $injector.get('ReportFactory');
      scope = $rootScope.$new();
      $q = $injector.get('$q');
      spyOn($state, 'go');
      ctrl = $controller('CaseListHeaderController', {
        $scope: scope,
        $state: $state,
        CaseFactory: CaseFactory,
        LanguageService: LanguageService,
        CaseListFactory: CaseListFactory,
        alertService: alertService,
        CaseListQueryService: CaseListQueryService,
        ConstantService:ConstantService,
        CaseListEntity:CaseListEntity,
        $stateParams:$stateParams,
        $filter:$filter,
        ReportFactory:ReportFactory
      });
    });
  });
  it('should exists', function () {
    expect(ctrl).toBeDefined();
  });

  it('should behave configs defined in it', function () {
    expect(scope.caseListName).toBeDefined();
    expect(scope.caseListData).toBeDefined();
    expect(scope.caseListCount).toBeDefined();
    expect(scope.asOfDate).toBeDefined();
    expect(scope.caseListModalName).toBeDefined();
    expect(scope.caseListModalTempName).toBeDefined();
    expect(scope.caseListModalDescription).toBeDefined();
    expect(scope.saveCaseListModalTempName).toBeDefined();
    expect(scope.counter).toBeDefined();
  });

  it('should behave predefined values', function () {
    expect(scope.caseListName).toBe(null);
    expect(scope.caseListData).toEqual(CaseListFactory.data);
    expect(scope.caseListQueryData).toEqual(CaseListQueryService.data);
    expect(scope.asOfDate).toEqual('');
    expect(scope.caseListModalName).toBe(null);
    expect(scope.caseListModalTempName).toBe(null);
    expect(scope.caseListModalDescription).toBe(null);
    expect(scope.saveCaseListModalTempName).toBe(null);
    expect(scope.counter).toBe(0);
  });

  it('Should have Methods defined in it', function () {
    expect(scope.fnGenerateNameAndCount).toBeDefined();
    expect(scope.fnWrapperNavigate).toBeDefined();
    expect(scope.fnTrackAllCaseListCount).toBeDefined();
    expect(scope.fnTrackCases).toBeDefined();
    expect(scope.fnInit).toBeDefined();
    expect(scope.fnPersistReportPanelState).toBeDefined();
    expect(scope.fnOnDateChange).toBeDefined();
    expect(scope.fnResetQuery).toBeDefined();
    expect(scope.fnBuildReportPackage).toBeDefined();
    expect(scope.fnSaveAsCaseList).toBeDefined();
    expect(scope.fnOnModalChange).toBeDefined();
  });

  it('should call the method fnInit()', function () {
    scope.fnInit();
  });

  it('should call the method fnWrapperNavigate()', function () {
    ReportFactory={
      data:{
        reportPanelState:'EXPANDED'
      }
    };
    scope.fnWrapperNavigate(location);

  });

  it('should call the method fnPersistReportPanelState ()', function () {
    scope.fnPersistReportPanelState();

  });

  it('should call the method fnOnDateChange () when condition true', function () {
     if ($state.current) {
            $state.current.url = '/visuals';
        } else {
            $state.current = {
                url: '/visuals'
            };
        }
    spyOn(CaseListFactory, 'fnUpdateCaseList').and.callFake(function () {
      return {
        then: function (callback) { return callback(); }
      };
    });
    scope.fnOnDateChange(date);
    expect(CaseListFactory.data.excludeInclude).toBe(true);

  });

  it('Should call the method fnOnDateChange () when condition false',function(){
    date='';
    scope.fnOnDateChange(date);
  });

  it('should call the method fnTrackCases()', function () {
    scope.fnTrackCases('some value');
    expect(CaseFactory.data.trackViewType).toEqual('some value');
  });

  it('should call the method fnTrackAllCaseListCount() when condition true', function () {
    spyOn(CaseListFactory, 'getAllCasesCount').and.callFake(function () {
      return {
        then: function (callback) { return callback(result); }
      };
    });
    scope.fnTrackAllCaseListCount();
  });

  it('should call the method fnTrackAllCaseListCount() when condition false', function () {
    var result = {
      data: '',
      error: false
    };
    spyOn(CaseListFactory, 'getAllCasesCount').and.callFake(function () {
      return {
        then: function (callback) { return callback(result); }
      };
    });
    scope.fnTrackAllCaseListCount();
  });

  it('should call the method fnSaveCaseList () when condition true', function () {
    scope.caseListName='(Case List Not Saved)';
    scope.fnSaveCaseList();
  });
  it('should call the method fnSaveCaseList () when condition false', function () {
    spyOn(CaseListFactory, 'fnUpdateCaseList').and.callFake(function () {
      return {
        then: function (callback) { return callback(response); }
      };
    });
    scope.fnSaveCaseList();
  });
  it('should call the method fnSaveAsCaseList ()', function () {
    scope.fnSaveAsCaseList();
  });

  it('should call the method fnResetQuery()', function () {
    scope.fnResetQuery();
  });

  it('should call the method fnOnModalChange()', function () {
    scope.caseListModalTempName='some';
    scope.caseListModalDescription='should call the method fnGetSelectedCaseListAllDetails';
    scope.fnOnModalChange();
  });

  it('should call the method fnOnModalChange() when scope.caseListModalTempName == null', function () {
    scope.caseListModalTempName=null;
    scope.caseListModalDescription='should call the method fnGetSelectedCaseListAllDetails';
    scope.fnOnModalChange();
  });

   it('should call the method fnOnModalChange() when scope.caseListModalDescription empty  ', function () {
    scope.caseListModalTempName='some';
    scope.caseListModalDescription='';
    scope.fnOnModalChange();
  });

  it('should call the method fnGetSelectedCaseListAllDetails ()', function () {
    spyOn(CaseListFactory, 'getSelectedCaseListAllDetails').and.callFake(function () {
      return {
        then: function (callback) { return callback(response); }
      };
    });
    scope.fnGetSelectedCaseListAllDetails();
  });

  it('should call the method fnGetSelectedCaseListAllDetails () when if condition false', function () {
    response = {
      error: false
    };
    spyOn(CaseListFactory, 'getSelectedCaseListAllDetails').and.callFake(function () {
      return {
        then: function (callback) { return callback(response); }
      };
    });
    scope.fnGetSelectedCaseListAllDetails();
  });

  it('should call the method fnBuildReportPackage   ()', function () {
    scope.fnBuildReportPackage();
  });

  it('should call the method fnSaveAsCaseList ()', function () {
    scope.fnSaveAsCaseList();
  });

  it('should call the method fnGenerateNameAndCount()', function () {
    scope.fnGenerateNameAndCount({ 'caseListName': 'caseListName', 'description': 'description', 'finalQuery': 'finalQuery' });
  });
  it('should call the method $watch()', function () {
    scope.caseListData={

    };

    if (scope.caseListData) {
            $state.current.excludeInclude = true;
        } else {
           scope.caseListData = {
                excludeInclude: true
            };
        }
       scope.$digest();
  });

});

'use strict';
/* FIXME: Shrey is working on this */
xdescribe('CreateReportController Controller', function () {
  var scope, ConstantService, ReportFactory, UrlService, DateService,
    loaderService, CreateReportController, languageService, UserService, alertService, IngredientFactory, $filter;
  var fnResetIngredientSelections = {};
  beforeEach(function () {
    module('saintApp');
    inject(function ($injector, $controller, $rootScope) {
      ConstantService = $injector.get('ConstantService');
      languageService = $injector.get('LanguageService');
      scope = $rootScope.$new();
      $filter = $rootScope.$new();
      ReportFactory = $injector.get('ReportFactory');
      UrlService = $injector.get('UrlService');
      DateService = $injector.get('DateService');
      loaderService = $injector.get('loaderService');
      alertService = $injector.get('alertService');
      UserService = $injector.get('UserService');
      IngredientFactory = $injector.get('IngredientFactory');
      CreateReportController = $controller('CreateReportController', {
        $scope: scope,
        $filter: $filter,
        LanguageService: languageService,
        ConstantService: ConstantService,
        ReportFactory: ReportFactory,
        UrlService: UrlService,
        DateService: DateService,
        loaderService: loaderService,
        UserService: UserService,
        IngredientFactory: IngredientFactory
      });
    });
  });

  it('should exists', function () {
    expect(CreateReportController).toBeDefined();
  });
  it('Should have configs defined in it', function () {
    expect(scope.report).toBeDefined();
    expect(scope.report.signal).toBeDefined();
    expect(scope.data).toBeDefined();
    expect(scope.availableUserGroups).toBeDefined();
    expect(scope.allUsers).toBeDefined();
    expect(scope.availableUsers).toBeDefined();
    expect(scope.isModalInEditMode).toBeDefined();
    expect(scope.signalingReportTypeKey).toBeDefined();
    expect(scope.paderReportTypeKey).toBeDefined();
    expect(scope.comparatorData).toBeDefined();
    expect(scope.isSaving).toBeDefined();
    expect(scope.isIngredientSelectAll).toBeDefined();

  });
  it('Should have Methods defined in it', function () {
    expect(fnResetIngredientSelections).toBeDefined();
    expect(scope.fnCreateNewReport).toBeDefined();
    //Working on it.Please don't delete.
    //  expect(scope.fnGetPaginatorClass).toBeDefined();
    //  expect(scope.fnPageChanged).toBeDefined();
    //   expect(scope.fnGetReportStatus).toBeDefined();
    //   expect(scope.fnTilesSelected).toBeDefined();
    // expect(scope.fnGetDate).toBeDefined();
    //   expect(scope.fnGetRecordPage).toBeDefined();
    //   expect(scope.fnPageInitialization).toBeDefined();
  });

  it('should call the method fnCreateNewReport()', function () {
    //scope.fnCreateNewReport();
    //expect(scope.fnResetIngredientSelections).toBeDefined();
    expect(scope.fnOpenCreateReportModal).toBeDefined();
  });
  //Working on it. Please don't delete.
  /*
   it('fnGenerateOdataQueryParameters() should generate the desired URL', function () {
   scope.reportFactoryData.selectedFilters = [{
   'filterName': 'Description',
   'contents': ['Extended'],
   'dbFilterName': 'DESCRIPTION',
   'category': 'Description'
   },
   {'filterName': 'Product', 'contents': ['PRODUCT - 1'], 'dbFilterName': 'TRADE_NAME', 'category': 'Product'},
   {'filterName': 'Status', 'contents': ['Open'], 'dbFilterName': 'STATUS_NAME', 'category': 'Status'}];
   scope.reportFactoryData.reportSort = {
   'sortedBy': 'STATUS_NAME',
   'sortedByName': 'Status',
   'sortOrder': 'asc',
   'secondarySort': 'RPT_TYPE_NAME,DAYS_UNTIL_DUE'
   };

   expect(scope.fnGenerateOdataQueryParameters(1))
   .toEqual('$select=REPORT_DISPLAY_NAME,RPT_START_DATE,RPT_END_DATE,DESCRIPTION,DAYS_UNTIL_DUE,STATUS_KEY,Audit_CreatedDt,RPT_KEY&$inlinecount=allpages&$filter=(substringof(\'Extended\',DESCRIPTION)) and (TRADE_NAME eq \'PRODUCT - 1\') and (STATUS_NAME eq \'Open\')&$top=50&$skip=0&$orderby=STATUS_NAME,RPT_TYPE_NAME,DAYS_UNTIL_DUE asc');
   });

   it('fnGetPaginatorClass() should return the optimal output', function () {
   scope.totalReports = 100;
   expect(scope.fnGetPaginatorClass())
   .toEqual('dsui-reportTileContainerWithPaginator');
   scope.totalReports = 50;
   expect(scope.fnGetPaginatorClass())
   .toEqual('dsui-reportTileContainerWithoutPaginator');
   });

   it('fnGetReportStatus() should return the correct status name', function () {
   expect(scope.fnGetReportStatus(1)).toEqual(ConstantService.OVERDUE.toLowerCase());
   expect(scope.fnGetReportStatus(2)).toEqual(ConstantService.OPEN.toLowerCase());
   expect(scope.fnGetReportStatus(3)).toEqual(ConstantService.INPROGRESS.toLowerCase());
   expect(scope.fnGetReportStatus(4)).toEqual(ConstantService.FINAL.toLowerCase());
   expect(scope.fnGetReportStatus(5)).toEqual(ConstantService.COMPLETED.toLowerCase());
   });


   it('fnGetReportDescription() should return the optimal output', function () {
   expect(scope.fnGetReportDescription('desc'))
   .toEqual('desc');
   });

   it('should call the method fnGetRecordPage', function () {
   scope.fnGetRecordPage(1);
   });
   it('should call the method fnTilesSelected ', function () {
   scope.fnTilesSelected({});
   });*/
  /*
   it('should call the method fnpageChanged', function() {
   scope.fnpageChanged();
   });
   it('should call the method fnpageInitialization', function() {
   scope.fnpageInitialization();
   });
   */

});

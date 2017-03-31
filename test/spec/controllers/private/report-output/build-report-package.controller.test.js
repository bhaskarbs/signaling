'use strict';
describe('BuildReportPackageController Controller', function () {
  var ctrl,scope,$state,stateParams,UrlService,UserService,filterFilter,$window,ConstantService,SaveReportPackageEntity,ReportFactory,$modal,ReportOutputFactory;
  var fakeModal = {
    result: {
      then: function(confirmCallback, cancelCallback) {
        //Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
        this.confirmCallBack = confirmCallback;
        this.cancelCallback = cancelCallback;
      }
    },
    close: function( item ) {
      //The user clicked OK on the modal dialog, call the stored confirm callback with the selected item
      this.result.confirmCallBack( item );
    },
    dismiss: function( type ) {
      //The user clicked cancel on the modal dialog, call the stored cancel callback
      this.result.cancelCallback( type );
    }
  };
    beforeEach(function () {
        module('saintApp');
        inject(function ($injector, $controller, $rootScope) {

            scope = $rootScope.$new();
          $state =  $injector.get('$state');
            stateParams= $injector.get('$stateParams');
            UrlService= $injector.get('UrlService');
          UserService= $injector.get('UserService');
            filterFilter= $injector.get('filterFilter');
            $window= $injector.get('$window');
            ConstantService= $injector.get('ConstantService');
            SaveReportPackageEntity= $injector.get('SaveReportPackageEntity');
            ReportFactory= $injector.get('ReportFactory');
            $modal= $injector.get('$modal');
            ReportOutputFactory= $injector.get('ReportOutputFactory');

            spyOn(scope, '$on');
            spyOn($modal, 'open').and.returnValue(fakeModal);
            scope.$on.and.callThrough();
            ctrl = $controller('BuildReportPackageController', {
              $scope :scope,
              $state : $state,
              $stateParams: stateParams,
              UrlService: UrlService,
              UserService: UserService,
              filterFilter: filterFilter,
              $window: $window,
              ConstantService: ConstantService,
              SaveReportPackageEntity: SaveReportPackageEntity,
              ReportFactory: ReportFactory,
              $modal: $modal,
              ReportOutputFactory: ReportOutputFactory
            });
          scope.stateParams.reports = 1;
          scope.stateParams.key = 16;
        });
    });

    it('Expect Controller to be defined', function () {
        expect(ctrl).toBeDefined();
    });

    it('Should have dependencies', function () {
        expect(scope).toBeDefined();
        expect($state).toBeDefined();
        expect(stateParams).toBeDefined();
        expect(UrlService).toBeDefined();
        expect(UserService).toBeDefined();
        expect(filterFilter).toBeDefined();
        expect($window).toBeDefined();
        expect(ConstantService).toBeDefined();
        expect(SaveReportPackageEntity).toBeDefined();
        expect($modal).toBeDefined();
        expect(ReportOutputFactory).toBeDefined();
    });

    it('Expect following methods to be defined', function () {
        expect(scope.fnInit).toBeDefined();
        expect(scope.openReportFolder).toBeDefined();
        expect(scope.fnNavigatePrevious).toBeDefined();
        expect(scope.fnGetDataFromFactory).toBeDefined();
        expect(scope.fnLoadDataFromBackend).toBeDefined();
        expect(scope.fnGetCaselistMetadata).toBeDefined();
        expect(scope.fnSelectTemplate).toBeDefined();
        expect(scope.fnGeneratePackage).toBeDefined();
        expect(scope.fnGetPayload).toBeDefined();
        expect(scope.fnSpyOnChange).toBeDefined();
        expect(scope.showList).toBeDefined();
        expect(scope.fnLoadLockedTemplates).toBeDefined();
        expect(scope.fnSelectDocumentormat).toBeDefined();
        expect(scope.fnselectAll).toBeDefined();
        expect(scope.fnDiscardChanges).toBeDefined();
        expect(scope.fnSavePackage).toBeDefined();
        expect(scope.fnToggleLeftPanel).toBeDefined();
        expect(scope.fnToggleToDefault).toBeDefined();
        expect(scope.fnOpenUpdateCaseListModal).toBeDefined();
    });

    it('Should initialize variables by calling fnInit', function () {
        scope.stateParams.reports = 1;
        scope.stateParams.key = 16;
        scope.fnInit();
    });
  it('Should change the toggle value for left panel', function () {
    scope.showLeftPanel =true;
    scope.fnToggleLeftPanel();
    expect(scope.showLeftPanel).toBeFalsy();
  });
  it('Should change the toggle value for default view of modal', function () {
    scope.defaultView =false;
    scope.fnToggleToDefault();
    expect(scope.defaultView).toBeTruthy();
  });
  it('Should select all the subreports present', function () {
    scope.fnselectAll(true);
  });
  it('Should invoke the watcher group', function () {
    scope.isDraftOrFinal ='Final';
    scope.isDraftOrFinal = 'Draft';
  });
  it('Should invoke modal instance on location change', function () {
    scope.isSaveEnable =true;
    scope.$emit('$stateChangeStart','dummy','dummy');
  });


});

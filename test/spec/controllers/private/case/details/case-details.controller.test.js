'use strict';
describe('CaseDetailsController Controller',function(){
  var ctrl,$q, CaseFactory, LanguageService, alertService, loaderService, scope, $state;
  var result = {};

  beforeEach(function(){
    module('saintApp');
    inject(function($injector,$controller,$rootScope){
      $q = $injector.get('$q');
      CaseFactory=$injector.get('CaseFactory');
      LanguageService = $injector.get('LanguageService');
      alertService = $injector.get('alertService');
      loaderService = $injector.get('loaderService');
      scope = $rootScope.$new();
      $state = $injector.get('$state');

      ctrl = $controller('CaseDetailsController',{
        $scope: scope,
        CaseFactory:CaseFactory,
        LanguageService:LanguageService,
        alertService:alertService,
        loaderService:loaderService
      });
     scope.paramsObj = {'caseKey': '167767', 'baseCaseKey': '311'};
    });
  });

  it('should exists',function(){
    expect(ctrl).toBeDefined();
  });


  it('Should have configs defined in it',function(){
    expect(scope.caseDetails).toBeDefined();
    expect(scope.annotationText).toBeDefined();
    expect(scope.paramsObj).toBeDefined();
  });

  it('Should have Methods defined in it',function(){
    expect(scope.fnGetSelectedCaseAnnotationDetails).toBeDefined();
    expect(scope.fnSaveAnnotation).toBeDefined();
  });

   it('Should call fnGetSelectedCaseAnnotationDetails()', function(){
     spyOn(CaseFactory,'getCaseAnnotationDetails').and.callFake(function(){
        return $q.when(result);
     });
     scope.fnGetSelectedCaseAnnotationDetails();
     scope.$digest();
    });

    it('Should call fnSaveAnnotation()', function(){
    scope.caseDetails.caseId = 20100508662;
    var annotationText = 'Annotation Text';
     spyOn(CaseFactory,'fnAnnotationSave').and.callFake(function(){
        return $q.when(result);
     });
     scope.fnSaveAnnotation(annotationText);
     scope.$digest();
    });

});

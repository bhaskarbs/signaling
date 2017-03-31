'use strict';
//FIXME I will handle them the querybuilder branch pull-request - Sai
describe('GenderChartController Controller', function () {
  var scope,ConstantService, ctrl,CaseListFactory, AuthorizeService;
  beforeEach(function () {
    module('saintApp');
    module('saint-authorize');
    inject(function ($injector,$controller, $rootScope) {

      ConstantService = $injector.get('ConstantService');
      CaseListFactory=$injector.get('CaseListFactory');
      AuthorizeService=$injector.get('AuthorizeService');
      scope = $rootScope.$new();

      ctrl = $controller('GenderChartController', {
        $scope: scope,
        ConstantService : ConstantService,
        CaseListFactory:CaseListFactory,
        AuthorizeService: AuthorizeService
      });
    });
  });

  it('should exists', function () {
    expect(ctrl).toBeDefined();
  });

  it('Should have Methods defined in it', function() {
    expect(scope.fnInit).toBeDefined();
    expect(scope.fnGetClickedGenderDetail).toBeDefined();

  });
  //FIXME: Working on this
  xit('should call the method fnInit()', function() {
    scope.caseListObj={
      selectedChartsList:[{
        columnName:'name',
        contents:[{
          name:'Male'
        }]
      }]
    };

    scope.dimension='name';
    scope.type='report';
    scope.disableCharts=false;

    scope.data= [
      {name: ConstantService.MALE_TEXT,isSelected:false},
      {name: ConstantService.FEMALE_TEXT,isSelected:false},
      {name: ConstantService.OTHERS_TEXT||'null',isSelected:false}
      ];
    scope.fnInit();
    expect(scope.data.isSelected).toBe(true);
  });

   it('should call the method fnGetClickedGenderDetail()', function() {
      var data={
        data:{
          name:'name'
        }
      };
      var index=1;
      var chartName='bar-chart';
      var color='#fff';
      var selectedObj = {
          'data': data,
          'index': 0,
          'name': ConstantService.PATIENT_SEX_DESC
        };
     scope.fnGetClickedGenderDetail(data,index,chartName,color);
     expect(CaseListFactory.data.chartSelected).toEqual(selectedObj);
   });
   it('should call the method fnGetColor()', function() {
     var isDisabled=true;
     scope.fnGetColor(isDisabled);
   });
});

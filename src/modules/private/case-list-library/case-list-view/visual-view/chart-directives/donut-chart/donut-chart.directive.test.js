'use strict';
describe('Directive:donutChart',function(){
  	beforeEach(module('saintApp'));
	beforeEach(module('saint-authorize'));
  	var element,scope;

  	beforeEach(inject(function($rootScope) { scope = $rootScope; }));

  	afterEach(function(){element.remove(); element = scope = undefined;});

	it('should have an element with donut-chart as an attribute exist',inject(function($compile){
		var elem = '<div donut-chart ></div>';
		element = angular.element(elem);
		element = $compile(element)(scope);
		expect(element).not.toBeNull();
	}));
});


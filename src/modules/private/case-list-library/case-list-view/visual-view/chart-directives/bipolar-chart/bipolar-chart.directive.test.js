'use strict';
describe('Directive:bipolarChart',function(){
  	beforeEach(module('saintApp'));
	beforeEach(module('saint-authorize'));
  	var element,scope;

  	beforeEach(inject(function($rootScope) { scope = $rootScope; }));

  	afterEach(function(){element.remove(); element = scope = undefined;});

	it('should have an element with bipolar-chart as an attribute exist',inject(function($compile){
		var elem = '<div bipolar-chart ></div>';
		element = angular.element(elem);
		element = $compile(element)(scope);
		expect(element).not.toBeNull();
	}));
});


'use strict';
describe('Directive:visualPanel',function(){
  	beforeEach(module('saintApp'));
  	var element,scope;

  	beforeEach(inject(function($rootScope) { scope = $rootScope; }));

  	afterEach(function(){element.remove(); element = scope = undefined;});
/* FIXME: Working on this*/
	xit('should have an element with modal-popup as an attribute exist',inject(function($compile){
		var elem = '<div visual-panel></div>';
		element = angular.element(elem);
		element = $compile(element)(scope);
		expect(element).not.toBeNull();
	}));
});


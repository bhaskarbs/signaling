'use strict';
describe('Directive:queryBuilder', function () {

  var compile, scope, directiveElem;
  beforeEach(function() {
    module('queryBuilder');
    inject(function ($compile, $rootScope) {
      compile=$compile;
      scope=$rootScope.$new();
    });

    directiveElem = getCompiledElement();
  });

  function getCompiledElement(){
    var compiledDirective = compile(angular.element('<query-builder group="group" operands="operands" dimensions="dimensions" operations="operators" operator-key="operatorKey" depth="depth" case-list-object="caseListObject" is-read-only="isReadOnly"></query-builder></query-builder>'))(scope);
    scope.$digest();
    return compiledDirective;
  }


});

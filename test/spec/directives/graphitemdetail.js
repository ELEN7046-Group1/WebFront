'use strict';

describe('Directive: graphItemDetail', function () {

  // load the directive's module
  beforeEach(module('webFrontApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<graph-item-detail></graph-item-detail>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the graphItemDetail directive');
  }));
});

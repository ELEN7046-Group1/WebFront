'use strict';

describe('Controller: CasestatusflowCtrl', function () {

  // load the controller's module
  beforeEach(module('Group1WebApp'));

  var CasestatusflowCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CasestatusflowCtrl = $controller('CasestatusflowCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CasestatusflowCtrl.awesomeThings.length).toBe(3);
  });
});

'use strict';

describe('Controller: CasesperdaybarchartCtrl', function () {

  // load the controller's module
  beforeEach(module('Group1WebApp'));

  var CasesperdaybarchartCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CasesperdaybarchartCtrl = $controller('CasesperdaybarchartCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CasesperdaybarchartCtrl.awesomeThings.length).toBe(3);
  });
});

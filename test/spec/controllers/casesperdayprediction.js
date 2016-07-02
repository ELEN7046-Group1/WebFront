'use strict';

describe('Controller: CasesperdaypredictionCtrl', function () {

  // load the controller's module
  beforeEach(module('Group1WebApp'));

  var CasesperdaypredictionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CasesperdaypredictionCtrl = $controller('CasesperdaypredictionCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CasesperdaypredictionCtrl.filters.length).toBe(2);
  });
});

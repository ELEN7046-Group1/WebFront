'use strict';

/**
 * @ngdoc function
 * @name Group1WebApp.controller:CustomervsclaimCtrl
 * @description
 * # CustomervsclaimCtrl
 * Controller of the Group1WebApp
 */
angular.module('Group1WebApp')
  .controller('CustomervsclaimCtrl', ['$scope', function ($scope) {
    createCustomerHeatMap();
    createCasesHeatMap();
  }]);

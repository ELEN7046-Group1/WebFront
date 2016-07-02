'use strict';

/**
 * @ngdoc function
 * @name Group1WebApp.controller:CustomervsclaimCtrl
 * @description
 * # CustomervsclaimCtrl
 * Controller of the Group1WebApp
 */
angular.module('Group1WebApp')
  .controller('CustomervsclaimCtrl', [function () {
    function generateCustomerGraph() {
      var div = $('#customersByProvince'),
          loaderImg = $('#loaderCust');

      div.html('');
      loaderImg.show();

      d3.json('http://104.154.44.142/elen7046/customers/perprovince/', function (error, data) {
        loaderImg.hide();

        if (error) {
          div.load('views/noLoad.html');
        } else if (data) {
          var chart = provinceHeatMap()
            .width(645)
            .height(645)
            .province(function(d) { return d.province; })
            .count(function(d) { return d.count; })
            .colorRange(['#FFFFFF', '#00FF00']);

          d3.select('#customersByProvince').datum(data).call(chart);
        }
      });
    }

    function generateClaimsGraph() {
      var div = $('#claimsByProvince'),
          loaderImg = $('#loaderClaim');

      div.html('');
      loaderImg.show();

      d3.json('http://104.197.190.158/elen7046/cases/perprovince/', function (error, data) {
        loaderImg.hide();

        if (error) {
          div.load('views/noLoad.html');
        } else if (data) {
          var chart = provinceHeatMap()
            .width(645)
            .height(645)
            .province(function(d) { return d.province; })
            .count(function(d) { return d.count; })
            .colorRange(['#FFFFFF', '#FF0000']);

          d3.select('#claimsByProvince').datum(data).call(chart);
        }
      });
    }

    generateCustomerGraph();
    generateClaimsGraph();
  }]);

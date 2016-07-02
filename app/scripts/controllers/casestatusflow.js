'use strict';

/**
 * @ngdoc function
 * @name Group1WebApp.controller:CasestatusflowCtrl
 * @description
 * # CasestatusflowCtrl
 * Controller of the Group1WebApp
 */
angular.module('Group1WebApp')
  .controller('CasestatusflowCtrl', ['$scope', '$templateCache', function ($scope, $templateCache) {
    $scope.graphTitle = 'Case Flow Diagram';

    var graph = $('#graph'),
        imgLoading = $('#imgLoading');

    function generateGraph() {
      graph.html('');
      imgLoading.show();

      d3.json('http://104.154.44.142/elen7046/cases/sankey/1998-5-1/2016-5-1', function (error, data) {
        imgLoading.hide();

        if (error) {
          graph.html($templateCache.get('views/noLoad.html'));
        } else if (data) {
          var chart = sankeyChart()
            .margin({top: 40, right: 40, bottom: 40, left: 40})
            .width(1300)
            .height(650)
            .nodes(function (d) {
              return d.nodes.map(function (n) {
                return {name: n.name, node: n.node};
              });
            })
            .links(function (d) {
              return d.links.map(function (l) {
                return {source: l.source, target: l.target, value: l.value};
              });
            });

          d3.select('#graph').datum([data]).call(chart);
        }
      });
    }

    generateGraph();
  }]);

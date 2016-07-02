'use strict';

/**
 * @ngdoc function
 * @name Group1WebApp.controller:CasesperdaypredictionCtrl
 * @description
 * # CasesperdaypredictionCtrl
 * Controller of the Group1WebApp
 */
angular.module('Group1WebApp')
  .controller('CasesperdaypredictionCtrl', ['$scope', '$filter', '$templateCache', function ($scope, $filter, $templateCache) {
    var dateTo = new Date();
    dateTo.setHours(0, 0, 0, 0);
    var dateFrom = new Date('1998-02-03');

    $scope.graphTitle = 'Cases Per Day: Actual vs Predicted';
    $scope.filters = [
      { label: 'Date from',
        type: 'date',
        value: dateFrom },
      { label: 'Date to',
        type: 'date',
        value: dateTo }
    ];

    $scope.updateGraph = function() {
      setDescription();
      generateGraph();
    };

    var graph = $('#graph'),
        imgLoading = $('#imgLoading');

    function generateGraph() {
      graph.find('svg').remove();
      imgLoading.show();

      d3.json('http://104.154.44.142/elen7046/cases/prediction/' + $filter('date')($scope.filters[0].value, 'yyyy-MM-dd') + '/' + $filter('date')($scope.filters[1].value, 'yyyy-MM-dd'), function (error, data) {
        imgLoading.hide();

        if (error) {
          graph.html($templateCache.get('views/noLoad.html'));
        } else if (data) {
          nv.addGraph(function () {

            var chart = nv.models.lineWithFocusChart();

            chart.brushExtent([0, data.length / 2])
              .width(850)
              .height(600)
              .margin({top: 40, right: 40, bottom: 60, left: 40})
              .useInteractiveGuideline(true)
              .color(["#1f77b4", "#ff7f0e"])
              .xAxis.axisLabel('Cases Per Day');

            var stream1 = { key: "Actual", area: false, values: data.map(function (d, i) { return { x: i, y: parseInt(d.actual) }; }) };
            var stream2 = { key: "Predicted", area: false, values: data.map(function (d, i) { return { x: i, y: parseInt(d.prediction) }; }) };

            d3.select('#graph')
              .attr('style', 'background-color: #ffffff;')
              .append('svg')
              .attr('width', 850)
              .attr('height', 600)
              .datum([stream1,stream2])
              .transition(1000)
              .call(chart);

            nv.utils.windowResize(chart.update);

            return chart;
          });
        }
      });
    }

    function setDescription() {
      $scope.description = 'This graph shows the actual number of cases logged per day vs the predicted number for the period starting from ' + $filter('date')($scope.filters[0].value, 'dd MMMM yyyy') + ' to '  + $filter('date')($scope.filters[1].value, 'dd MMMM yyyy');
    }

    setDescription();
    generateGraph();
  }]);

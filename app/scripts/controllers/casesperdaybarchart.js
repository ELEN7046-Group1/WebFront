'use strict';

/**
 * @ngdoc function
 * @name Group1WebApp.controller:CasesperdaybarchartCtrl
 * @description
 * # CasesperdaybarchartCtrl
 * Controller of the Group1WebApp
 */
angular.module('Group1WebApp')
  .controller('CasesperdaybarchartCtrl', ['$scope', '$filter', function ($scope, $filter) {
    var dateTo = new Date();
    dateTo.setHours(0, 0, 0, 0);
    var dateFrom = dateFunctions.getFirstDayOfMonth(dateTo.getFullYear(), dateTo.getMonth());

    dateFrom.setMonth(dateTo.getMonth() - 3);

    $scope.graphTitle = 'Case per day';
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

    function generateGraph() {
      $('#graph').html('');
      d3.json('http://104.197.190.158/elen7046/cases/perday/' + $filter('date')($scope.filters[0].value, 'yyyy-MM-dd') + '/' + $filter('date')($scope.filters[1].value, 'yyyy-MM-dd'), function (error, data) {
        $('#imgLoading').hide();

        if (error) {
          $('#graph').load('views/noLoad.html');
        } else if (data) {
          var chart = barChart()
            .margin({top: 30, right: 30, bottom: 30, left: 50})
            .width(850)
            .height(400)
            .x(function (d) { return new Date(d.Date); })
            .y(function (d) { return +d.DayTotal;  })
            .xScale(d3.time.scale())
            .barTitleText(function (d) { return 'Date: ' + dateFormat.parse(new Date(d.Date)) + ' Cases: ' + d.DayTotal; });

          var dateFormat = d3.time.format('%dd %B %y');
          d3.select('#graph').datum(data).call(chart);
        }
      });
    }

    function setDescription() {
      $scope.description = 'This graph shows the number of cases logged for the period starting from ' + $filter('date')($scope.filters[0].value, 'dd MMMM yyyy') + ' to '  + $filter('date')($scope.filters[1].value, 'dd MMMM yyyy');
    }

    setDescription();
    generateGraph();
  }]);

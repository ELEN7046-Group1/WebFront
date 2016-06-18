/**
 * Created by Werner on 2016/06/13.
 */

angular.module("Group1WebApp")
  .controller("SingleGraphCtrl", ['$scope', '$state', '$stateParams', function ($scope, $state, $stateParams) {
    var myGraph = graph;


    switch (($stateParams.graphName || "").toLowerCase()) {
      case "claimsperprovince":
        myGraph.title = "Claims Per Province";
        group1ChartDrawer.ClaimsPerProvince("#graph", 800, 800, null, fakeCasesPerDay());
        break;
      case "casesperdaybarchart":
        myGraph.title = "Cases Per Day - Bar Chart";

        d3.json('http://104.197.190.158/elen7046/cases/perday/2016-01-01/2016-06-01', function (error, data) {
          if (error) {
            console.warn(error);
          } else if (data) {
            group1ChartDrawer.CasesPerDayBarChart("#graph", 850, 400, null, data);
          }
        });
        break;
      case 'calendarheatmap':
        myGraph.title = "Calendar Heatmap";

        var now = new Date();
        var toDate = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();

        d3.json('http://104.197.190.158/elen7046/cases/perday/2016-01-01/' + toDate, function (error, data) {
          if (error) {
            console.warn(error);
          } else if (data) {
            group1ChartDrawer.CasesPerDayCalendar("#graph", 850, 400, data);
          }
        });
        break;
      default:
        $state.go("notfound");
    }

    $scope.graph = myGraph;
  }
  ]);

function _padLeft(number, requiredWidth, padChar) {
  padChar = padChar || '0';
  number = number + '';

  return number.length >= requiredWidth ? number : new Array(requiredWidth - number.length + 1).join(padChar) + number;
}

Date.prototype.toShortDate = function () {
  return this.getFullYear() + "-" + _padLeft(this.getMonth() + 1, 2) + '-' + _padLeft(this.getDate(), 2);
};

function fakeCasesPerDay() {
  var startDate = new Date(2016, 5 - 1, 1);
  var endDate = new Date(2016, 5 - 1, 31);

  var data = "[";

  while (startDate <= endDate) {
    data += '{ "Date": "' + startDate.toShortDate() + '", "DayTotal": ' + Math.floor(Math.random() * 101) + ' }';
    startDate.setDate((startDate.getDate() + 1));

    if (startDate <= endDate) {
      data += ',';
    }
  }

  data += ']';

  return JSON.parse(data);
}

/**
 * Created by Werner on 2016/06/13.
 */

angular.module("Group1WebApp")
  .controller("SingleGraphCtrl", ['$scope', '$state', '$stateParams', function ($scope, $state, $stateParams) {
    $scope.filters = [];
    switch (($stateParams.graphName || "").toLowerCase()) {
      case "claimsperprovince":
        $scope.graphTitle = "Claims Per Province";
        $("#imgLoading").hide();
        group1ChartDrawer.ClaimsPerProvince("#graph", 800, 800, null, fakeCasesPerDay());
        break;
      case "casesperdaybarchart":
        $scope.graphTitle = "Cases Per Day - Bar Chart";

        d3.json('http://104.197.190.158/elen7046/cases/perday/2016-01-01/2016-06-01', function (error, data) {
          $("#imgLoading").hide();

          if (error) {
            $('#graph').load('views/noLoad.html');
          } else if (data) {
            group1ChartDrawer.CasesPerDayBarChart("#graph", 850, 400, null, data);
          }
        });
        break;
      default:
        $state.go("notfound");
    }
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
  var startDate = new Date(2016, 1 - 1, 1);
  var endDate = new Date(2016, 3 - 1, 31);

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

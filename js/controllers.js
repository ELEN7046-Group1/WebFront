'use strict';

var graph = {
    title: "Graph title",
    description: "description of the graph.",
    filters: [{name: "Date from", type: "Date"}, {name: "Date to", type: "Date"}],
    graphImage: "SVG to be rendered."
};

var group1WebAppControllers = angular.module("group1WebAppControllers", []);

group1WebAppControllers.controller("SingleGraphCtrl", ['$scope', '$routeParams',
    function ($scope, $routeParams) {
        var myGraph = graph;

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

        group1ChartDrawer.BarChart("#graph", 850, 400, null, JSON.parse(data));

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
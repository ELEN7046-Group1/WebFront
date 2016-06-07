'use strict';

var group1WebApp = angular.module("Group1WebApp", ['ngRoute', 'group1WebAppControllers']);

group1WebApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/graph', {
                templateUrl: 'views/graph-not-found.html',
                controller: 'SingleGraphCtrl'
            })
            .when('/graph/:graphName', {
                templateUrl: 'views/single-graph.html',
                controller: 'SingleGraphCtrl'
            })
            .when ('/dashboard', {
                templateUrl: 'views/dashboard.html',
                controller: 'HomeCtrl'
            })
            .otherwise({
            redirectTo: "/graph"
            });
    }
]);
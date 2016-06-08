'use strict';

var group1WebApp = angular.module("Group1WebApp", ['ui.router', 'group1WebAppControllers']);

// group1WebApp.config(['$routeProvider',
//     function($routeProvider) {
//         $routeProvider
//             .when('/graph', {
//                 templateUrl: 'views/graph-not-found.html',
//                 controller: 'SingleGraphCtrl'
//             })
//             .when('/graph/:graphName', {
//                 templateUrl: 'views/single-graph.html',
//                 controller: 'SingleGraphCtrl'
//             })
//             .when ('/dashboard', {
//                 templateUrl: 'views/dashboard.html',
//                 controller: 'HomeCtrl'
//             })
//             .otherwise({
//             redirectTo: "/graph"
//             });
//     }
// ]);

group1WebApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/notfound');

    $stateProvider
        .state("notfound", {
            url: "/notfound",
            views: {
                '': { templateUrl: "views/graph-not-found.html" },
                'menu@notfound': { templateUrl: "views/menu.html" }
            }
        })
        .state("graph", {
            url: '/graph/:graphName',
            views: {
                "": {templateUrl: "views/single-graph.html", controller: "SingleGraphCtrl"},
                "menu@graph": {templateUrl: "views/menu.html"}
            }
        });
});
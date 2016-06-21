'use strict';

/**
 * @ngdoc overview
 * @name Group1WebApp
 * @description
 * # Group1WebApp
 *
 * Main module of the application.
 */
angular
  .module('Group1WebApp', ['ui.router'])
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');

    $stateProvider
      .state('home', {
        url: '/home',
        views: {
          '': { templateUrl: 'views/home.html' },
          'menu@home': { templateUrl: 'views/menu.html' }
        }
      })
      .state('notfound', {
        url: '/notfound',
        views: {
          '': { templateUrl: 'views/graph-not-found.html' },
          'menu@notfound': { templateUrl: 'views/menu.html' }
        }
      })
      .state('graph', {
        url: '/graph/:graphName',
        views: {
          '': {templateUrl: 'views/single-graph.html', controller: 'SingleGraphCtrl'},
          'menu@graph': {templateUrl: 'views/menu.html'}
        }
      });
  });

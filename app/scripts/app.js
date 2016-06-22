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
      .state('calendarheatmap', {
        url: '/calendarheatmap',
        views: {
          '': {templateUrl: 'views/single-graph.html', controller: 'CalendarheatmapCtrl'},
          'menu@calendarheatmap': {templateUrl: 'views/menu.html'}
        }
      })
      .state('casesperdaybarchart', {
        url: '/casesperdaybarchart',
        views: {
          '': {templateUrl: 'views/single-graph.html', controller: 'CasesperdaybarchartCtrl'},
          'menu@casesperdaybarchart': {templateUrl: 'views/menu.html'}
        }
      })
      .state('customervsclaim', {
        url: '/customervsclaim',
        views: {
          '': {templateUrl: 'views/customervsclaim.html', controller: 'CustomervsclaimCtrl'},
          'menu@customervsclaim': {templateUrl: 'views/menu.html'}
        }
      });
  });

(function () {
  'use strict';

  angular
    .module('core.volunteer.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('volunteer', {
        abstract: true,
        url: '/volunteer',
        template: '<ui-view/>',
        data: {
          roles: ['volunteer']
        }
      });
  }
}());

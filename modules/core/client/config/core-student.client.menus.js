(function () {
  'use strict';

  angular
    .module('core.student')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
  }
}());

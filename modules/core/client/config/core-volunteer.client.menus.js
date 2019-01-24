(function () {
  'use strict';

  angular
    .module('core.volunteer')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
  }
}());

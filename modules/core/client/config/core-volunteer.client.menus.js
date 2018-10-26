(function () {
  'use strict';

  angular
    .module('core.volunteer')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Volunteer',
      state: 'admin',
      roles: ['volunteer']
    });
  }
}());

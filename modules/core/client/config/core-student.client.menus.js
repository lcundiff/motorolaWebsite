(function () {
  'use strict';

  angular
    .module('core.student')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    menuService.addMenuItem('topbar', {
      title: 'Student',
      state: 'student',
      type: 'dropdown',
      roles: ['student']
    });
  }
}());

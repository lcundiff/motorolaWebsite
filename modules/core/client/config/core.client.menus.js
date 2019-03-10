(function () {
  'use strict';

  angular
    .module('core')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {

    menuService.addMenu('account', {
      roles: ['admin', 'volunteer', 'student'],
    });

    menuService.addMenuItem('account', {
      title: '',
      state: 'settings',
      type: 'dropdown',
      roles: ['admin', 'volunteer', 'student'],
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: 'Edit Profile',
      state: 'settings.profile',
      roles: ['user','admin', 'volunteer', 'student'],
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: 'Edit Profile Picture',
      state: 'settings.picture',
      roles: ['user','admin', 'volunteer', 'student'],
    });

    menuService.addSubMenuItem('account', 'settings', {
      title: 'Change Password',
      state: 'settings.password',
      roles: ['admin', 'volunteer', 'student'],
    });
}
}());

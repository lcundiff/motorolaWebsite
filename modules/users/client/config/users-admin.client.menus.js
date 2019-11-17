(function () {
  'use strict';

  angular
    .module('users.admin')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  // Configuring the Users module
  function menuConfig(menuService) {

    //SYDNEY: 1. user clicks the item button on the menu,
    //then the state is changed so the client side can route
    //in file user-admin.client.routes.js
    menuService.addMenuItem('topbar', {
      title: 'Create Volunteer',
      state: 'admin.createvolunteer'
    });

    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'Manage Users',
      state: 'admin.users'
    });

    menuService.addSubMenuItem('topbar', 'admin', {
      title: 'Manage User Requests',
      state: 'admin.userreqs'
    });
    menuService.addMenuItem('topbar',  {
      title: 'Upload Forms',
      state: 'admin.updateForms'
    });
    menuService.addMenuItem('topbar', {
      title: 'Applicants',
      state: 'admin.students'
    });
    menuService.addMenuItem('topbar', {
      title: 'Volunteers',
      state: 'admin.volunteers'
    });
    menuService.addMenuItem('topbar', {
      title: 'Interviews',
      state: 'admin.interviews'
    });
    menuService.addMenuItem('topbar', {
      title: 'Match',
      state: 'admin.match'
    });
    menuService.addMenuItem('topbar', {
      title: 'CSV',
      state: 'admin.csv'
    });
  }
}());

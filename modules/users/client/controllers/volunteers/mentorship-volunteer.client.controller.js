(function() {
  'use strict';

  // Volunteers controller
  angular
    .module('users')
    .controller('MentorshipVolunteerController', MentorshipVolunteerController);

  MentorshipVolunteerController.$inject = ['$scope', '$state', '$window', 'Authentication', 'VolunteerService', 'menuService', 'Notification', '$http','$sce'];

  function MentorshipVolunteerController($scope, $state, $window, Authentication, VolunteerService, menuService, Notification, $http, $sce) {
    var vm = this;
    vm.authentication = Authentication;
    vm.mentees = [];

    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');


    VolunteerService.getVolunteerByUsername(vm.authentication.user.username).then(function(data){
      VolunteerService.getMentees(data.data);
      vm.mentees = data.data;
      console.log(data.data);
    });
  }

}());

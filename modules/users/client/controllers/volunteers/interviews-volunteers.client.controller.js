(function() {
  'use strict';

  // Volunteers controller
  angular
    .module('users')
    .controller('InterviewVolunteerController', InterviewVolunteerController);

  InterviewVolunteerController.$inject = ['$scope', '$state', '$window', 'Authentication', 'VolunteerService', 'menuService', 'Notification', '$http','$sce'];

  function InterviewVolunteerController($scope, $state, $window, Authentication, VolunteerService, menuService, Notification, $http, $sce) {
    var vm = this;
    vm.authentication = Authentication;
    vm.interviewees = [];

    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');


    VolunteerService.getVolunteerByUsername(vm.authentication.user.username).then(function(data){
      VolunteerService.getInterviewees(data.data);
      vm.mentees = data.data;
      console.log(data.data);
    });
  }

}());

(function() {
  'use strict';

  // Volunteers controller
  angular
    .module('users')
    .controller('VolunteerController', VolunteerController);

  VolunteerController.$inject = ['$scope', '$state', '$window', 'Authentication', 'VolunteerService', 'menuService', 'Notification', '$http','$sce'];

  function VolunteerController($scope, $state, $window, Authentication, VolunteerService, menuService, Notification, $http, $sce) {
    var vm = this;
    console.log("COntrolelr");
    vm.authentication = Authentication;
    vm.credentials = {};
    vm.credentials.application = {};
    vm.credentials.application.name = vm.authentication.user.displayName;
    vm.credentials.application.email = vm.authentication.user.email;

    console.log("vm.authentication: ",vm.authentication);

    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');

    vm.createVolunteer = createVolunteer;

    function createVolunteer(isValid){
      console.log(vm.credentials);
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.volunteerForm');

        return false;
      }
      VolunteerService.createVolunteer(vm.credentials)
        .then(onVolunteerSubmissionSuccess)
        .catch(onVolunteerSubmissionError);
    }

    function onVolunteerSubmissionSuccess(response) {
      // If successful we assign the response to the global user model
      vm.authentication.student = response;
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Volunteer submission successful.' });
      // And redirect to the previous or home page
      //$state.go($state.previous.state.name || 'home', $state.previous.params);
    }

    function onVolunteerSubmissionError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Volunteer submission error.', delay: 6000 });
    }
  }

}());

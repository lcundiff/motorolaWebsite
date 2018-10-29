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

    console.log("username: ", vm.authentication.user.username);

    console.log("vm.authentication: ",vm.authentication);

    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');

    vm.createVolunteer = createVolunteer;

    VolunteerService.getVolunteerByUsername(vm.authentication.user.username).then(function(data){
      if(data.status === undefined){
        console.log("here");
        vm.updateIsSubmit = true;

        vm.credentials = {};
        vm.credentials.application = {};
        vm.credentials.application = data.application;
        vm.credentials.application.name = vm.authentication.user.displayName;
        vm.credentials.application.email = vm.authentication.user.email;
      }
      else if(data.status==="404"){
        console.log("YO");
        vm.updateIsSubmit = false;
      }
    });

    function createVolunteer(isValid){
      var p1 = Promise.resolve({vm.credentials.username = vm.authentication.user.username});
      var p2;

      if(vm.application.credentials.roles === "m") p2 = Promise.resolve({vm.application.credentials.roles = ['volunteer', 'mentor']});
      else if(vm.credentials.application.roles === "i") p2 = Promise.resolve({vm.application.credentials.roles = ['volunteer', 'interviewer']});
      else if(vm.credentials.application.roles === "mi") p2 = Promise.resolve({vm.application.credentials.roles = ['volunteer', 'interviewer', 'mentor']});

      console.log(vm.credentials);
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.volunteerForm');

        return false;
      }

      Promise.all([p1, p2]).then(function([p1, p2]){
        VolunteerService.createVolunteer(vm.credentials, vm.authentication)
          .then(onVolunteerSubmissionSuccess)
          .catch(onVolunteerSubmissionError);
      });
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

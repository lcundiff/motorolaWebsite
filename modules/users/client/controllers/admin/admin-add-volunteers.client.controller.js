(function() {
  'use strict';

  // Admin Add Volunteers controller
  angular
    .module('users')
    .controller('AdminAddVolunteerController', AdminAddVolunteerController);

    AdminAddVolunteerController.$inject = ['$scope', '$state', '$window', 'Authentication', 'UsersService', 'VolunteerService', 'menuService', 'Notification', '$http','$sce'];

  function AdminAddVolunteerController($scope, $state, $window, Authentication, UsersService, VolunteerService, menuService, Notification, $http, $sce) {
    var vm = this;
    console.log("vm = ", vm)
    $window.user = {
      roles: []
    };
    vm.authentication = Authentication;
    vm.updateIsSubmit = false;

    vm.loading = false;

    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');

    vm.saveApp = saveApp;
    vm.createVolunteer = createVolunteer;
    vm.createUser = createUser;

    function saveApp(isValid){
      vm.loading = true;
  	  $scope.$broadcast('show-errors-reset', 'vm.volunteerForm');
      VolunteerService.updateVolunteer(vm.credentials.username, vm.credentials)
        .then(onVolunteerSubmissionSuccess)
        .catch(onVolunteerSubmissionError);
      }


    function findFirstErrorOnApp(){

      var currentActive = document.getElementsByClassName("item active")[0].id;
      var appPages = document.getElementsByClassName("item");

      console.log(appPages);
      console.log(currentActive);

      for(var i = 0; i < appPages.length; i++){
        var errorMessages = appPages[i].querySelectorAll('.error-text');

        if(errorMessages.length > 0){
          document.getElementById('myCarousel').querySelector(`#${currentActive}`).classList.remove('active');
          appPages[i].classList.add('active');
          return;
        }
      }

    }
    //first create user
    function createUser(isValid){
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.volunteerForm');

        findFirstErrorOnApp();
        Notification.error({ message: 'Please make sure you have filled out all required fields.', title: '<i class="glyphicon glyphicon-remove"></i> Error', delay: 6000 });
        return false;
      }
      var user = {};
      user.username = vm.credentials.application.username
      user.firstName = vm.credentials.application.firstName;
      user.lastName = vm.credentials.application.lastName;
      user.email = vm.credentials.application.email;
      user.displayName = vm.credentials.application.firstName + ' ' + vm.credentials.application.lastName
      user.password = 'Password123!'
      
      console.log("1. next line call users service ")
      UsersService.volunteerSignup(user).then(function(user){
        console.log("function called after calling User volunteer signup: data : ", user)
        createVolunteer(user)
      }).catch(onVolunteerSubmissionError);

    }
    //then the volunteer is created
    function createVolunteer(user){    
      console.log("3. User should be created. ")
      var volunteer = {};
      var address ={
        "line_1": vm.credentials.application.address.line_1 ,
        "line_2" : vm.credentials.application.address.line_2,
        "city":vm.credentials.application.address.city,
        "state":vm.credentials.application.address.state,
        "zipcode": vm.credentials.application.address.zipcode
      }
      console.log("adding user._id ", user._id);
      volunteer.user = user._id;
      volunteer.username = vm.credentials.application.username;
      volunteer.firstName = vm.credentials.application.firstName;
      volunteer.lastName = vm.credentials.application.lastName;
      volunteer.email = vm.credentials.application.email;
      volunteer.areaofexpertise = vm.credentials.application.areaofexpertise;
      volunteer.address = address;
      volunteer.phone = vm.credentials.application.phone
      volunteer.roles = ['volunteer']
      console.log("4. about to create new volunteer ")
      VolunteerService.createVolunteer(volunteer).then(onVolunteerSubmissionSuccess).catch(onVolunteerSubmissionError);
      document.getElementById("volunteerForm").reset();
    }


    function onVolunteerSubmissionSuccess(response) {
      // If successful we assign the response to the global user model

      vm.authentication.student = response;
      vm.loading = false;
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Volunteer submission successful.' });
      // And redirect to the previous or home page
      //$state.go($state.previous.state.name || 'home', $state.previous.params);
    }

    function onVolunteerSubmissionError(response) {
      vm.loading = false;
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Volunteer submission error.', delay: 6000 });
    }
  }

}());

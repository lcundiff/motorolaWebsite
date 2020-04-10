(function() {
  'use strict';

  // Admin Add Volunteers controller
  angular
    .module('users')
    .controller('AdminAddVolunteerController', AdminAddVolunteerController);

    AdminAddVolunteerController.$inject = ['$scope', '$state', '$window', 'Authentication', 'UsersService', 'VolunteerService', 'menuService', 'Notification', '$http'];

  function AdminAddVolunteerController($scope, $state, $window, Authentication, UsersService, VolunteerService, menuService, Notification, $http) {
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
      /* if carousel is needed
      for(var i = 0; i < appPages.length; i++){
        var errorMessages = appPages[i].querySelectorAll('.error-text');
        
        if(errorMessages.length > 0){
          // finds active slide in carousel
          document.getElementById('myCarousel').querySelector(`#${currentActive}`).classList.remove('active');
          appPages[i].classList.add('active');
          return;
        }
        
      }*/

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
      user.displayName = vm.credentials.application.firstName + ' ' + vm.credentials.application.lastName;
      user.password = "Motorola1!"
      if(vm.roles === "m") { user.roles = ['volunteer', 'mentor'];}
      else if(vm.roles === "i"){ user.roles  = ['volunteer', 'interviewer'] }
      else if(vm.roles === "mi"){ user.roles  = ['volunteer', 'interviewer', 'mentor'];}
  
      UsersService.volunteerSignup(user).then(function(user){
        createVolunteer(user)
      }).catch(onVolunteerSubmissionError);

    }
    //then the volunteer is created
    function createVolunteer(user){    
      var volunteer = {};
      //QUESTION: If admin is creating volunteer app, how would admin know if the volunteer app is complete?
      volunteer.isAppComplete = true;
      volunteer.user = user._id;
      volunteer.username = vm.credentials.application.username;

      var address ={
        "line_1": vm.credentials.application.address.line_1 == null ? vm.credentials.application.address.line_1 : '',
        "line_2" : vm.credentials.application.address.line_2 == null ? vm.credentials.application.address.line_2 : '',
        "city": vm.credentials.application.address.city == null? vm.credentials.application.address.city : '',
        "state":vm.credentials.application.address.state == null ? vm.credentials.application.address.state : '',
        "zipcode": vm.credentials.application.address.zipcode == null ? vm.credentials.application.address.zipcode : ''
      }
      volunteer.application = vm.credentials.application;
      volunteer.application.firstName = vm.credentials.application.firstName;
      volunteer.application.lastName = vm.credentials.application.lastName;
      volunteer.application.email = vm.credentials.application.email;
      volunteer.application.areaofexpertise = vm.credentials.application.areaofexpertise;
      volunteer.application.address = address;
      volunteer.application.phone = vm.credentials.application.phone

      volunteer.application.sessions = [];
      volunteer.sessions = [];
      volunteer.areaofexpertise = vm.credentials.application.areaofexpertise;
      if(vm.sessions_1 === true){ volunteer.application.sessions.push("1"); volunteer.sessions.push("1");};
      if(vm.sessions_2 === true){ volunteer.application.sessions.push("2"); volunteer.sessions.push("2");};
      if(vm.sessions_3 === true){ volunteer.application.sessions.push("3"); volunteer.sessions.push("3");};

      if(vm.roles === "m") { volunteer.application.roles = ['volunteer', 'mentor']; volunteer.roles = ['volunteer', 'mentor']; }
      else if(vm.roles === "i"){ volunteer.application.roles  = ['volunteer', 'interviewer']; volunteer.roles  = ['volunteer', 'interviewer'] }
      else if(vm.roles === "mi"){ volunteer.application.roles  = ['volunteer', 'interviewer', 'mentor']; volunteer.roles  = ['volunteer', 'interviewer', 'mentor'];}

      VolunteerService.createVolunteer(volunteer).then(onVolunteerSubmissionSuccess).catch(onVolunteerSubmissionError);
      //clear form so another user + volunteer can be added
      document.getElementById("volunteerForm").reset();
    }

    function onVolunteerSubmissionSuccess(response) {
      // If successful we assign the response to the global user model
      vm.authentication.student = response;
      vm.loading = false;
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Volunteer submission successful.' });
    }
    function onVolunteerSubmissionError(response) {
      vm.loading = false;
      Notification.error({ message: response, title: '<i class="glyphicon glyphicon-remove"></i> Volunteer submission error.', delay: 6000 });
    }
  }

}());

(function() {
  'use strict';

  // Admin Add Volunteers controller
  angular
    .module('users')
    .controller('AdminAddVolunteerController', AdminAddVolunteerController);

    AdminAddVolunteerController.$inject = ['$scope', '$state', '$window', 'Authentication', 'VolunteerService', 'menuService', 'Notification', '$http','$sce'];

  function AdminAddVolunteerController($scope, $state, $window, Authentication, VolunteerService, menuService, Notification, $http, $sce) {
    var vm = this;
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
    vm.updateVolunteer = updateVolunteer;

    
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

    function updateVolunteer(isValid){
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.volunteerForm');

        findFirstErrorOnApp();
        Notification.error({ message: 'Please make sure you have filled out all required fields.', title: '<i class="glyphicon glyphicon-remove"></i> Error', delay: 6000 });
        return false;
      }
      vm.loading = true;
      vm.credentials.isAppComplete = true;
      var p1 = Promise.resolve(vm.credentials.username = vm.authentication.user.username);
      var p2;

      vm.credentials.application.sessions = [];

      if(vm.sessions_1 === true) vm.credentials.application.sessions.push("1");
      if(vm.sessions_2 === true) vm.credentials.application.sessions.push("2");
      if(vm.sessions_3 === true) vm.credentials.application.sessions.push("3");

      if(vm.roles === "m") {
        $window.user.roles = ['volunteer', 'mentor'];
        p2 = Promise.resolve(vm.credentials.application.roles = ['volunteer', 'mentor']);
      }
      else if(vm.roles === "i"){
        $window.user.roles = ['volunteer', 'interviewer']
        p2 = Promise.resolve(vm.credentials.application.roles = ['volunteer', 'interviewer']);
      }
      else if(vm.roles === "mi"){
        $window.user.roles = ['volunteer', 'interviewer', 'mentor'];
        p2 = Promise.resolve(vm.credentials.application.roles = ['volunteer', 'interviewer', 'mentor']);
      }

      Promise.all([p1, p2]).then(function([p1, p2]){
        var p3 = Promise.resolve(function(){
          if(vm.authentication.user.roles.indexOf("admin") !== -1){
            vm.credentials.application.roles.push('admin');
          }

          console.log("final roles: ",vm.credentials.application.roles);
        });

        Promise.all([p3]).then(function([p3]){
          console.log("vm.credentials.application: ",vm.credentials.application);
          console.log("username: ",vm.credentials.username);

          vm.updateIsSubmit = true;
          VolunteerService.updateVolunteer(vm.credentials.username, vm.credentials)
            .then(onVolunteerSubmissionSuccess)
            .catch(onVolunteerSubmissionError);
        });
      });
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

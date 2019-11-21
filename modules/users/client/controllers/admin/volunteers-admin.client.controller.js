(function() {
  'use strict';

  // Admins controller
  angular
    .module('users')
    .controller('VolunteersAdminsController', VolunteersAdminsController);

  VolunteersAdminsController.$inject = ['$scope', '$state', '$window', '$filter', 'Authentication', 'Notification', 'AdminService', 'UsersService', 'VolunteerService', /*'VolunteersService', 'AutomateService', 'googleDriveService',*/'$http','$sce'];

  function VolunteersAdminsController($scope, $state, $window, $filter, Authentication, Notification, AdminService, UsersService, VolunteerService,/* VolunteersService, AutomateService, googleDriveService,*/$http, $sce) {
    var vm = this;

    vm.loading = false;
    vm.selected_user = false;

    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;

    vm.listActiveVolunteers = listActiveVolunteers;
    vm.listDeactivatedVolunteers = listDeactivatedVolunteers;
    vm.volunteers;

    vm.deactivateVolunteer = deactivateVolunteer;
    vm.activateVolunteer = activateVolunteer;

    vm.displayVolunteer = displayVolunteer;

    function displayVolunteer(user){
      vm.user = user;

      vm.selected_user = true;
    }

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 15;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.volunteers, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }

    function listActiveVolunteers() {
      VolunteerService.getVolunteers().then(async function(data){
        console.log("data: ",data);
        vm.volunteers = data;
        vm.selected_user = false;

        await(vm.buildPager());
      });
    }

    function listDeactivatedVolunteers() {
      VolunteerService.listDeactivated().then(async function(data){
        console.log("dat1a: ",data);
        vm.volunteers = data;
        vm.selected_user = false;

        await(vm.buildPager());
      });
    }

    //open confirm box when admin performs action

    //open modal window that displays the Volunteer resume
    $scope.openModal = function(username, docId){
        console.log("Open Modal id: ",username);

        VolunteerService.getVolunteerByUsername(username).then(function(data){
          console.log(data);
          vm.modal_Volunteer = data;
          $scope.vm.modal_vol = vm.modal_vol;
          var modal = document.getElementById(docId);
          modal.style.display = "block";
        });
    };

    $scope.closeModal = function(docId){
      var modal = document.getElementById(docId);
      var span = document.getElementsByClassName("close")[0];

      modal.style.display = "none";
      vm.modal_vol = '';
      $scope.vm.modal_vol = '';
    };

    //open tab (either active or deactivated Volunteers)
    $scope.openPage = function(pageName, elmnt){
      // Hide all elements with class="tabcontent" by default */
      var i, tabcontent, tablinks;
      tabcontent = document.getElementsByClassName("tabcontent");
      for (i = 0; i < tabcontent.length; i++) {
          tabcontent[i].style.display = "none";
      }

      // Remove the background color of all tablinks/buttons
      tablinks = document.getElementsByClassName("tablink");
      for (i = 0; i < tablinks.length; i++) {
          tablinks[i].style.backgroundColor = "";
      }

      // Show the specific tab content
      document.getElementById(pageName).style.display = "block";

      // Add the specific color to the button used to open the tab content
      //elmnt.style.backgroundColor = color;
    };

  //table sorts throughout admin side
  $scope.a_sortType = 'name';
  $scope.a_sortReverse = 'true';
  $scope.v_sortType = 'name';
  $scope.v_sortReverse = 'true';
  $scope.active = 'active';
  $scope.activeSelect = 2;
  $scope.activeFilter = true;
  $scope.listings = [{ val: 0, name: "All" }, { val: 1, name: "Active" }, { val: 2, name: "Inactive" }];
  $scope.activateClass = "disabledButton";
  $scope.deactivateClass = "disabledButton";
  $scope.volunteersChecked = [];
  $scope.anyChecked = false;

function deactivateVolunteer(user, volunteer, index) {
  vm.loading = true;
  vm.selected_user = false;
  volunteer.active = false;
  volunteer.mentee = [];
  volunteer.menteeID = [];
  volunteer.interviewee = [];
  volunteer.intervieweeID = [];
  vm.volunteers.splice(index, 1);
  vm.pagedItems.splice(index%15, 1);

  VolunteerService.updateVolunteer(user, volunteer)
  .then(onDeactivationSuccess)
  .catch(onDeactivationError);
};

function onDeactivationSuccess(response) {
      // If successful we assign the response to the global user model
      vm.loading = false;
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Volunteer deactivation successful.' });
      // And redirect to the previous or home page
      //$state.go($state.previous.state.name || 'home', $state.previous.params);
    }

    function onDeactivationError(response) {
      vm.loading = false;
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Volunteer deactivation error.', delay: 6000 });
    }

function activateVolunteer(user, volunteer, index) {
  vm.loading = true;
  vm.selected_user = false;
  volunteer.active = true;
  vm.volunteers.splice(index, 1);
  vm.pagedItems.splice(index%15, 1);

  VolunteerService.updateVolunteer(user, volunteer)
  .then(onActivationSuccess)
  .catch(onActivationError);
};

function onActivationSuccess(response) {
      // If successful we assign the response to the global user model
      vm.loading = false;
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Volunteer activation successful.' });
      // And redirect to the previous or home page
      //$state.go($state.previous.state.name || 'home', $state.previous.params);
    }

    function onActivationError(response) {
      vm.loading = false;
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Volunteer activation error.', delay: 6000 });
    }

}


}());

(function() {
  'use strict';

  // Volunteers controller
  angular
    .module('users')
    .controller('InterviewVolunteerController', InterviewVolunteerController);

  InterviewVolunteerController.$inject = ['$scope', '$state', '$window', '$filter', 'Authentication', 'VolunteerService', 'menuService', 'Notification', '$http','$sce'];

  function InterviewVolunteerController($scope, $state, $window, $filter, Authentication, VolunteerService, menuService, Notification, $http, $sce) {
    var vm = this;
    vm.authentication = Authentication;
    vm.interviewees = [];
    vm.volunteer;

    vm.selected_user = false;

    vm.displayStudent = displayStudent;
    vm.buildPager = buildPager;
		vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
		vm.pageChanged = pageChanged;

    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');


    VolunteerService.getInterviewees(vm.authentication.user.username).then(function(data){
      console.log("we here fam", data);
      vm.interviewees = data.interviewees;

      vm.buildPager();
    });

    VolunteerService.getVolunteerByUsername(vm.authentication.user.username).then(function(data){
      vm.volunteer = data;
    });

    function displayStudent(user) {
			vm.user = user;
			console.log(user.timeSlot.length);
			if (user.timeSlot === []) vm.sessionType = "";
			else vm.sessionType = user.timeSlot[0];

			console.log(vm.user);

			vm.selected_user = true;
		}

    function buildPager() {
			console.log("HERE IN BP");
			vm.pagedItems = [];
			vm.itemsPerPage = 15;
			vm.currentPage = 1;
			vm.figureOutItemsToDisplay();
		}

    function figureOutItemsToDisplay() {
			vm.filteredItems = $filter('filter')(vm.interviewees, {
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
  }

}());

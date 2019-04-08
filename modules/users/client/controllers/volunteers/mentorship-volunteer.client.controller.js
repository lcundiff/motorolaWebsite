(function() {
  'use strict';

  // Volunteers controller
  angular
    .module('users')
    .controller('MentorshipVolunteerController', MentorshipVolunteerController);

  MentorshipVolunteerController.$inject = ['$scope', '$state', '$window', '$filter', 'Authentication', 'GoogleCloudService', 'VolunteerService', 'menuService', 'Notification', '$http','$sce'];

  function MentorshipVolunteerController($scope, $state, $window, $filter, Authentication, GoogleCloudService, VolunteerService, menuService, Notification, $http, $sce) {
    var vm = this;
    vm.authentication = Authentication;
    vm.mentees = [];
    vm.volunteer;

    vm.viewForm = viewForm;

    vm.selected_user = false;

    vm.displayStudent = displayStudent;
    vm.buildPager = buildPager;
		vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
		vm.pageChanged = pageChanged;

    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');

    VolunteerService.getMentees(vm.authentication.user.username).then(function(data){
      vm.mentees = data.mentees;

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
			vm.filteredItems = $filter('filter')(vm.mentees, {
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

    function viewForm(fileId) {
      if(fileId === null || fileId === '' || fileId === undefined){
        Notification.error({ message: 'Student has not yet uploaded this form.', title: '<i class="glyphicon glyphicon-remove"></i> Error', delay: 6000 });
        return;
      }

      vm.loading = true;

      GoogleCloudService.downloadForm(fileId)
      .then(function(response){
        var file = new Blob([response.data], {
            type: 'application/pdf'
          });
            $scope.fileUrl = $sce.trustAsResourceUrl(URL.createObjectURL(file));
            var link = document.createElement('a');
                link.href = $scope.fileUrl;
                link.download = fileId;
                link.click();
                vm.loading = false;
        })
      .catch(onErrorGoogleCloudDownload);
    }

    function onErrorGoogleCloudDownload(){
      vm.loading = false;
      Notification.error({ message: 'There was an error downloading this form. Please try again in a few minutes or report this to your system administrator.', title: '<i class="glyphicon glyphicon-remove"></i> Error', delay: 6000 });
    }

    $scope.openModal = function (student, docId) {
			console.log(student);
			vm.modal_student = student;
			$scope.vm.modal_student = vm.modal_student;
			var modal = document.getElementById(docId);
			modal.style.display = "block";
		};

		$scope.closeModal = function (docId) {
			var modal = document.getElementById(docId);
			var span = document.getElementsByClassName("close")[0];

			modal.style.display = "none";
			vm.modal_student = '';
			$scope.vm.modal_student = '';
		};
  }

}());

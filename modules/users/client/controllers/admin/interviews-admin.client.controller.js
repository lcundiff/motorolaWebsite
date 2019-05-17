(function() {
  'use strict';

  // Admins controller
  angular
    .module('users')
    .controller('InterviewsAdminsController', InterviewsAdminsController);

  InterviewsAdminsController.$inject = ['$scope', '$state', '$window', '$filter', 'Authentication', 'Notification', 'AdminService', 'UsersService', 'StudentService', 'FileService', 'VolunteerService', /* 'AutomateService', 'googleDriveService',*/'$http','$sce'];

  function InterviewsAdminsController($scope, $state, $window, $filter, Authentication, Notification, AdminService, UsersService, StudentService, FileService, VolunteerService,/* AutomateService, googleDriveService,*/$http, $sce) {
    var vm = this;
    vm.loading = false;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;

    vm.listActiveStudents = listActiveStudents;
    vm.listDeactivatedStudents = listDeactivatedStudents;
    vm.students;

    vm.displayStudent = displayStudent;

    vm.selected_user = false;
	vm.backEndInterviewer = ['','',''];
    vm.selectedVol = [null, null, null];

    vm.addInterviewer = addInterviewer;
    vm.removeInterviewer = removeInterviewer;

    vm.autoAssignInterviews = autoAssignInterviews;

    function autoAssignInterviews() {
      vm.loading = true;
      AdminService.autoAssignInterviews()
      .then(onAutoAssignInterviewsSuccess)
      .catch(onAutoAssignInterviewsFailure);
    }

    function onAutoAssignInterviewsSuccess(response){
      vm.selected_user = false;
      vm.listActiveStudents();
      // If successful we assign the response to the global user model
      vm.loading = false;
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Auto Assignation of Interviews complete.' });
      // And redirect to the previous or home page
      //$state.go($state.previous.state.name || 'home', $state.previous.params);
    }
    function onAutoAssignInterviewsFailure(response){
      // If successful we assign the response to the global user model
      vm.loading = false;
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Auto Assignation of Interviews failed.' });
      // And redirect to the previous or home page
      //$state.go($state.previous.state.name || 'home', $state.previous.params);
    }

    function buildPager() {
      console.log("HERE IN BP");
      vm.pagedItems = [];
      vm.itemsPerPage = 15;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function displayStudent(user){
      vm.user = user;
      vm.selectedVol[0] = user.interviewerID[0];
      vm.selectedVol[1] = user.interviewerID[1];
      vm.selectedVol[2] = user.interviewerID[2];

      console.log(user.timeSlot.length);
      if(user.timeSlot === []) vm.sessionType = "";
      else vm.sessionType = user.timeSlot[0];

	  vm.backEndInterviewer[0] = user.interviewerID[0];
		vm.backEndInterviewer[1] = user.interviewerID[1];
		vm.backEndInterviewer[2] = user.interviewerID[2];
      vm.selected_user = true;
    }

    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.students, {
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

    function listActiveStudents() {
      StudentService.studentListActive().then(function(data){
        console.log("data: ",data);
        vm.students = data;

        VolunteerService.getVolunteers().then(function(data){
          console.log("data: ",data);
          vm.volunteers = data;

          vm.buildPager();
        });
      });
    }

    function listDeactivatedStudents() {
      StudentService.studentListDeactivated().then(async function(data){
        console.log("dat1a: ",data);
        vm.students = data;

        await(vm.buildPager());
      });
    }

    function addInterviewer(student, volunteerUser, index){
      if(student.interviewerID[index]){
        Notification.error({ message: 'There is an interviewer is assigned to the student in this slot. Please remove him/her first before assigning another interviewer.', title: '<i class="glyphicon glyphicon-remove"></i> Error', delay: 6000 });
        return;
      }
      if(!volunteerUser){
        Notification.error({ message: 'No interviewer was selected.', title: '<i class="glyphicon glyphicon-remove"></i> Error', delay: 6000 });
        return;
      }
      vm.loading = true;
      student.interviewerID[index] = volunteerUser;
      console.log(volunteerUser);

      VolunteerService.getVolunteer(volunteerUser).then(function(data){
        var volunteer = data.volunteer;
        student.interviewer[index] = `${volunteer.application.firstName} ${volunteer.application.lastName}`;

        console.log('volunteer:', volunteer);

        volunteer.intervieweeID.push(student.user);
        volunteer.interviewee_count += 1;

        VolunteerService.updateVolunteer(volunteer.username, volunteer);

        StudentService.updateStudent(student.user, student)
        .then(onAddInterviewerSuccess(student,index))
        .catch(onAddInterviewerError);
      });
    }

    function removeInterviewer(student, volunteerUser, index){
      if(!student.interviewerID[index]){
        Notification.error({ message: 'No interviewer is assigned to the student in this slot.', title: '<i class="glyphicon glyphicon-remove"></i> Error', delay: 6000 });
        return;
      }
      if(!volunteerUser){
        Notification.error({ message: 'No interviewer was selected.', title: '<i class="glyphicon glyphicon-remove"></i> Error', delay: 6000 });
        return;
      }
      vm.loading = true;
      student.interviewer[index] = null;
      student.interviewerID[index] = null;
      vm.selectedVol[index] = null;

      VolunteerService.getVolunteer(volunteerUser).then(function(data){
        var volunteer = data.volunteer;
        volunteer.interviewee_count -= 1;
        volunteer.intervieweeID.splice(volunteer.intervieweeID.indexOf(student.user), 1);
        VolunteerService.updateVolunteer(volunteer.username, volunteer);

      });

      StudentService.updateStudent(student.user, student)
      .then(onRemoveInterviewerSuccess(student, index))
      .catch(onRemoveInterviewerError);
    }

    function onRemoveInterviewerSuccess(student,index) {
          // If successful we assign the response to the global user model
          		  vm.backEndInterviewer[index] = student.interviewerID[index];
                vm.loading = false;
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Interviewer was successfully removed from student.' });
          // And redirect to the previous or home page
          //$state.go($state.previous.state.name || 'home', $state.previous.params);
        }

        function onRemoveInterviewerError(response) {
          vm.loading = false;
          Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> There was an error remove interviewer from the student.', delay: 6000 });
        }

    function onAddInterviewerSuccess(student,index) {
          // If successful we assign the response to the global user model
          		  vm.backEndInterviewer[index] = student.interviewerID[index];
                vm.loading = false;
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Interviewer was successfully added to student.' });
          // And redirect to the previous or home page
          //$state.go($state.previous.state.name || 'home', $state.previous.params);
        }

        function onAddInterviewerError(response) {
          vm.loading = false;
          Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> There was an error adding interviewer to student.', delay: 6000 });
        }

}


}());

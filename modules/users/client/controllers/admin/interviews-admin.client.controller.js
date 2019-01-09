(function() {
  'use strict';

  // Admins controller
  angular
    .module('users')
    .controller('InterviewsAdminsController', InterviewsAdminsController);

  InterviewsAdminsController.$inject = ['$scope', '$state', '$window', '$filter', 'Authentication', 'Notification', 'AdminService', 'UsersService', 'StudentService', 'FileService', 'VolunteerService', /* 'AutomateService', 'googleDriveService',*/'$http','$sce'];

  function InterviewsAdminsController($scope, $state, $window, $filter, Authentication, Notification, AdminService, UsersService, StudentService, FileService, VolunteerService,/* AutomateService, googleDriveService,*/$http, $sce) {
    var vm = this;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;

    vm.listActiveStudents = listActiveStudents;
    vm.listDeactivatedStudents = listDeactivatedStudents;
    vm.students;

    vm.deactivateStudent = deactivateStudent;
    vm.activateStudent = activateStudent;

    vm.displayStudent = displayStudent;

    vm.viewForm = viewForm;

    vm.selected_user = false;

    vm.addInterviewer = addInterviewer;

    function buildPager() {
      console.log("HERE IN BP");
      vm.pagedItems = [];
      vm.itemsPerPage = 15;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }

    function displayStudent(user){
      vm.user = user;
      console.log(user.timeSlot.length);
      if(user.timeSlot === []) vm.sessionType = "";
      else vm.sessionType = user.timeSlot[0];

      console.log(vm.user);

      vm.selected_user = true;
    }

    function viewForm(fileId) {
      console.log("fileId: ",fileId);

      FileService.download(fileId).then(function(data){

        var file = new Blob([data.data], {
            type: 'application/pdf'
            // type:'image/png'
          });
            //var fileURL = URL.createObjectURL(file);

            //window.open(fileURL);
            $scope.fileUrl = $sce.trustAsResourceUrl(URL.createObjectURL(file));
            // $scope.fileUrl = window.URL.createObjectURL(file);
            // console.log($scope.fileUrl)
            var link = document.createElement('a');
                link.href = $scope.fileUrl;
                link.download = fileId;
                // console.log(link);
                link.click();
      });
    }

    function figureOutItemsToDisplay() {
      console.log("HERE IN FOID");
      vm.filteredItems = $filter('filter')(vm.students, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);

      console.log("vm.pagedItems: ",vm.pagedItems);
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }

    function listActiveStudents() {
      StudentService.studentListActive().then(async function(data){
        console.log("data: ",data);
        vm.students = data;

        VolunteerService.getVolunteers().then(async function(data){
          console.log("data: ",data);
          vm.volunteers = data;

          await(vm.buildPager());
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
      student.interviewer[index] = volunteerUser;

      StudentService.updateStudent(student.user, student)
      .then(onAddInterviewerSuccess)
      .catch(onAddInterviewerError);
    }

    function onAddInterviewerSuccess(response) {
          // If successful we assign the response to the global user model
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Interviewer was successfully added to student.' });
          // And redirect to the previous or home page
          //$state.go($state.previous.state.name || 'home', $state.previous.params);
        }

        function onAddInterviewerError(response) {
          Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> There was an error adding interviewer to student.', delay: 6000 });
        }

    //open tab (either active or deactivated students)
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





/*

  $scope.addInterviewerToStudent = function(id){
    AutomateService.replaceInterviewer(id).then(function(response){
      if(response.data === 'No interviewers available!'){
        alert('No interviewers currently available to assign to that student.');
      }
      else{
        alert('Interviewer successfully added to student.');
        $window.location.reload();
      }
    })
  }

  $scope.chooseInterviewerToStudent = function(studentId,mentorId){
    AutomateService.chooseInterviewer(studentId,mentorId).then(function(response){
      if(response.data === 'No interviewers available!'){
        alert('No interviewers currently available to assign to that student.');
      }
      else{
        alert('Interviewer successfully added to student.');
        $window.location.reload();
      }
    })
  };
*/

function deactivateStudent(user, student, index) {
  vm.selected_user = false;
  student.active = false;
  student.timeSlot = [];
  student.mentor = "";
  student.mentorID = "";
  student.interviewer = [];
  student.interviewerID = [];
  vm.students.splice(index, 1);
  vm.pagedItems.splice(index%15, 1);

  StudentService.updateStudent(user, student)
  .then(onDeactivationSuccess)
  .catch(onDeactivationError);
};

function onDeactivationSuccess(response) {
      // If successful we assign the response to the global user model
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Student deactivation successful.' });
      // And redirect to the previous or home page
      //$state.go($state.previous.state.name || 'home', $state.previous.params);
    }

    function onDeactivationError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Student deactivation error.', delay: 6000 });
    }

function activateStudent(user, student, index) {
  vm.selected_user = false;
  student.active = true;
  vm.students.splice(index, 1);
  vm.pagedItems.splice(index%15, 1);

  StudentService.updateStudent(user, student)
  .then(onActivationSuccess)
  .catch(onActivationError);
};

function onActivationSuccess(response) {
      // If successful we assign the response to the global user model
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Student activation successful.' });
      // And redirect to the previous or home page
      //$state.go($state.previous.state.name || 'home', $state.previous.params);
    }

    function onActivationError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Student activation error.', delay: 6000 });
    }

}


}());

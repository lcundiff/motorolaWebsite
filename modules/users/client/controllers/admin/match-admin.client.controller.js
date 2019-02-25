(function() {
  'use strict';

  // Admins controller
  angular
    .module('users')
    .controller('MatchAdminsController', MatchAdminsController);

  MatchAdminsController.$inject = ['$scope', '$state', '$window', '$filter', 'Authentication', 'Notification', 'AdminService', 'UsersService', 'StudentService', 'FileService', 'VolunteerService', /* 'AutomateService', 'googleDriveService',*/'$http','$sce'];

  function MatchAdminsController($scope, $state, $window, $filter, Authentication, Notification, AdminService, UsersService, StudentService, FileService, VolunteerService,/* AutomateService, googleDriveService,*/$http, $sce) {
    var vm = this;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay_students = figureOutItemsToDisplay_students;
    vm.figureOutItemsToDisplay_volunteers = figureOutItemsToDisplay_volunteers;
    vm.pageChanged_students = pageChanged_students;
    vm.pagedChanged_volunteers = pageChanged_volunteers;

    vm.listActiveStudents = listActiveStudents;
    vm.listDeactivatedStudents = listDeactivatedStudents;
    vm.students;

    vm.selectStudent = selectStudent;
    vm.selectVolunteer = selectVolunteer;

    vm.selected_student = null;
    vm.selected_volunteer = null;

    vm.is_student_selected = false;
    vm.is_volunteer_selected = false;

    vm.manMatch = manMatch;
    vm.manUnmatch = manUnmatch;

    vm.autoMatch = autoMatch;

    vm.neutralBackgroundColor = null;
    vm.selectedBackgroundColor = "CCEFFF";

    StudentService.studentListActive().then(function(data){
      console.log("data: ",data);
      vm.students = data;

      VolunteerService.getVolunteers().then(function(data){
        console.log("data: ",data);
        vm.volunteers = data;

        vm.buildPager();
      });
    });

    function autoMatch() {
      AdminService.autoMatch("1").then(function(response){
        AdminService.autoMatch("2").then(function(response){
          AdminService.autoMatch("3")
          .then(onAutoMatchSuccess)
          .catch(onAutoMatchError);
        });
      });
    }

    function onAutoMatchSuccess(response) {
      vm.listActiveStudents();
          // If successful we assign the response to the global user model
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Auto-match was successful.' });
          // And redirect to the previous or home page
          //$state.go($state.previous.state.name || 'home', $state.previous.params);

        }

    function onAutoMatchError(response) {
          Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> An error occurred during auto-match.', delay: 6000 });
        }


    function manMatch(student, volunteer) {
      console.log(student);
      console.log(volunteer);
      if(student.timeSlot.length < 0){
        Notification.error({message: '<i class="glyphicon glyphicon-remove"></i> This student has not been accepted into a session.', title: 'Error', delay: 6000 });
        deSelectStudent(student);
        deSelectVolunteer(volunteer);
        return;
      }
      else if(student === null || student === undefined){
        Notification.error({message: '<i class="glyphicon glyphicon-remove"></i> Please select a student to match.', title: 'Error', delay: 6000 });
        return;
      }
      else if(volunteer === null || volunteer === undefined){
        Notification.error({message: '<i class="glyphicon glyphicon-remove"></i> Please select a volunteer to match.', title: 'Error', delay: 6000 });
        return;
      }
      else{
        if(student.timeSlot[0] === "1") volunteer.mentee_count_sess_1++;
        else if(student.timeSlot[0] === "2") volunteer.mentee_count_sess_2++;
        else volunteer.mentee_count_sess_3++;
      }

      if(student.mentorID === volunteer.user._id){
        Notification.error({message: '<i class="glyphicon glyphicon-remove"></i> This mentor has already been paired to this student.', title: 'Error', delay: 6000 });
        deSelectStudent(student);
        deSelectVolunteer(volunteer);
        return;
      }
      volunteer.mentee.push(student.application.firstName + " " + student.application.lastName);
      volunteer.menteeID.push(student.user);
      student.mentor = volunteer.user.displayName;
      student.mentorID = volunteer.user._id;

      StudentService.updateStudent(student.user, student).then(function(response){
        deSelectStudent(student);
        deSelectVolunteer(volunteer);

        console.log(response);
        VolunteerService.updateVolunteer(volunteer.username, volunteer)
        .then(onMatchSuccess)
        .catch(onMatchError);

      });
    }

    function manUnmatch(student, volunteer){

      if(!student.mentorID.includes(volunteer.user._id)){
        Notification.error({message: '<i class="glyphicon glyphicon-remove"></i> This pair is not matched.', title: 'Error', delay: 6000 });
        deSelectStudent(student);
        deSelectVolunteer(volunteer);
        return;
      }
      if(student.timeSlot[0] === "1") volunteer.mentee_count_sess_1--;
      else if(student.timeSlot[0] === "2") volunteer.mentee_count_sess_2--;
      else volunteer.mentee_count_sess_3--;

      volunteer.mentee.splice(volunteer.mentee.indexOf(student.user), 1);
      volunteer.menteeID.splice(volunteer.menteeID.indexOf(student.application.firstName + " " + student.application.lastName), 1);
      student.mentor = null;
      student.mentorID = null;
      student.mentor_email = null;

      StudentService.updateStudent(student.user, student).then(function(response){
        deSelectStudent(student);
        deSelectVolunteer(volunteer);

        console.log(response);
        VolunteerService.updateVolunteer(volunteer.username, volunteer)
        .then(onUnmatchSuccess)
        .catch(onUnmatchError);

      });
    }

    function onMatchSuccess(response) {
      vm.listActiveStudents();
          // If successful we assign the response to the global user model
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Matching of pair was successful.' });
          // And redirect to the previous or home page
          //$state.go($state.previous.state.name || 'home', $state.previous.params);
        }

    function onMatchError(response) {
          Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> There was an error matching the student-mentor pair.', delay: 6000 });
        }

        function onUnmatchSuccess(response) {
              // If successful we assign the response to the global user model
              Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Unmatching of pair was successful.' });
              // And redirect to the previous or home page
              //$state.go($state.previous.state.name || 'home', $state.previous.params);
            }

        function onUnmatchError(response) {
              Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> There was an error unmatching the student-mentor pair.', delay: 6000 });
            }



    function buildPager() {
      console.log("HERE IN BP");
      vm.pagedItems_students = [];
      vm.pagedItems_volunteers = [];
      vm.itemsPerPage = 15;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay_students();
      vm.figureOutItemsToDisplay_volunteers();
    }

    function selectStudent(user, el){
      console.log(vm.is_student_selected);
      if(vm.is_student_selected === false){
        vm.neutralBackgroundColor = document.getElementById(user.user).style.backgroundColor;
      }
      if(vm.is_student_selected === true){
        deSelectStudent(user);
        return;
      }
      document.getElementById(user.user).style.backgroundColor = "#CCEFFF";
      vm.selected_student = user;
      vm.is_student_selected = true;
      vm.search_student = user.application.firstName + " " + user.application.lastName;
    }

    function deSelectStudent(user){
      document.getElementById(user.user).style.backgroundColor = vm.neutralBackgroundColor;
      vm.selected_student = null;
      vm.search_student = "";
      vm.is_student_selected = false;
    }

    function selectVolunteer(user, el){
      if(vm.is_volunteer_selected === false){
        vm.neutralBackgroundColor = document.getElementById(user.user._id).style.backgroundColor;
      }
      console.log(user);
      if(vm.is_volunteer_selected === true){
        deSelectVolunteer(user);
        return;
      }
      document.getElementById(user.user._id).style.backgroundColor = "#CCEFFF";
      vm.selected_volunteer = user;
      vm.is_volunteer_selected = true;
      vm.search_volunteer = user.application.firstName + " " + user.application.lastName;
    }

    function deSelectVolunteer(user){
      document.getElementById(user.user._id).style.backgroundColor = vm.neutralBackgroundColor;
      vm.selected_volunteer = null;
      vm.search_volunteer = "";
      vm.is_volunteer_selected = false;
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

    function figureOutItemsToDisplay_students() {
      console.log("HERE IN FOID");
      vm.filteredItems = $filter('filter')(vm.students, {
        $: vm.search_students
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems_students = vm.filteredItems.slice(begin, end);

      console.log("vm.pagedItems: ",vm.pagedItems_students);
    }

    function figureOutItemsToDisplay_volunteers() {
      console.log("HERE IN FOID");
      vm.filteredItems = $filter('filter')(vm.volunteers, {
        $: vm.search_volunteers
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems_volunteers = vm.filteredItems.slice(begin, end);

      console.log("vm.pagedItems: ",vm.pagedItems_volunteers);
    }

    function pageChanged_students() {
      vm.figureOutItemsToDisplay_students();
    }

    function pageChanged_volunteers() {
      vm.figureOutItemsToDisplay_volunteers();
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

}


}());

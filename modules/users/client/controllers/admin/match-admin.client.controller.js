(function() {
  'use strict';

  // Admins controller
  angular
    .module('users')
    .controller('MatchAdminsController', MatchAdminsController);

  MatchAdminsController.$inject = ['$scope', '$state', '$window', '$filter', 'Authentication', 'Notification', 'AdminService', 'UsersService', 'StudentService', 'FileService', 'VolunteerService', /* 'AutomateService', 'googleDriveService',*/'$http','$sce'];

  function MatchAdminsController($scope, $state, $window, $filter, Authentication, Notification, AdminService, UsersService, StudentService, FileService, VolunteerService,/* AutomateService, googleDriveService,*/$http, $sce) {
    var vm = this;
    vm.loading = false;
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
      vm.loading = true;
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
          vm.loading = false;
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Auto-match was successful.' });
          // And redirect to the previous or home page
          //$state.go($state.previous.state.name || 'home', $state.previous.params);

        }

    function onAutoMatchError(response) {
          vm.loading = false;
          Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> An error occurred during auto-match.', delay: 6000 });
        }


    function manMatch(student, volunteer) {
      vm.loading = true;
      if(student.timeSlot.length < 0){
        deSelectStudent(student);
        deSelectVolunteer(volunteer);
        vm.loading = false;
        Notification.error({message: '<i class="glyphicon glyphicon-remove"></i> This student has not been accepted into a session.', title: 'Error', delay: 6000 });
        return;  
      }
      else if(student === null || student === undefined){
        vm.loading = false;
        Notification.error({message: '<i class="glyphicon glyphicon-remove"></i> Please select a student to match.', title: 'Error', delay: 6000 });
        return;      
      }
      else if(volunteer === null || volunteer === undefined){
        vm.loading = false;
        Notification.error({message: '<i class="glyphicon glyphicon-remove"></i> Please select a volunteer to match.', title: 'Error', delay: 6000 });
        return;
      }
      if(student.mentorID !== null){
        deSelectStudent(student);
        deSelectVolunteer(volunteer);
        vm.loading = false;
        if(student.mentorID === volunteer.user._id){
          Notification.error({message: '<i class="glyphicon glyphicon-remove"></i> This mentor has already been paired to this student.', title: 'Error', delay: 6000 });  
        }
        else{
          Notification.error({message: '<i class="glyphicon glyphicon-remove"></i> This mentee has already been paired. Please unmatch before making a new match.', title: 'Error', delay: 6000 });
        }
        return;
      }  
      var obj;
      for( obj in volunteer.menteeID){
        if(student.user === volunteer.menteeID[obj]){
          Notification.error({message: '<i class="glyphicon glyphicon-remove"></i> This mentor has already been paired to this student.', title: 'Error', delay: 6000 });
          vm.loading = false;
          return;
        }
      }
     

      if(student.timeSlot[0] === "1") volunteer.mentee_count_sess_1++;
      else if(student.timeSlot[0] === "2") volunteer.mentee_count_sess_2++;
      else volunteer.mentee_count_sess_3++;
     
      volunteer.mentee.push(student.application.firstName + " " + student.application.lastName);
      volunteer.menteeID.push(student.user);
      student.mentor = volunteer.user.displayName;
      student.mentorID = volunteer.user._id;

      StudentService.updateStudent(student.user, student).then(function(response){
        deSelectStudent(student);
        deSelectVolunteer(volunteer);
        VolunteerService.updateVolunteer(volunteer.username, volunteer)
      })
      .then(onMatchSuccess)
      .catch(onMatchError);
    }

    function manUnmatch(student, volunteer){
      vm.loading = true;
      var obj;
      var matched = false;
      for( obj in volunteer.menteeID){
        if(student.user === volunteer.menteeID[obj]){
          matched = true;
        }
      }
     if(!matched){
        deSelectStudent(student);
        deSelectVolunteer(volunteer);
        vm.loading = false;
        Notification.error({message: '<i class="glyphicon glyphicon-remove"></i> This pair is not matched.', title: 'Error', delay: 6000 });
        return;
      }   
      if(student.timeSlot[0] === "1") volunteer.mentee_count_sess_1--;
      else if(student.timeSlot[0] === "2") volunteer.mentee_count_sess_2--;
      else volunteer.mentee_count_sess_3--;

      volunteer.mentee.splice(volunteer.mentee.indexOf(student.application.firstName + " " + student.application.lastName), 1);
      volunteer.menteeID.splice(volunteer.menteeID.indexOf(student.user), 1);
      student.mentor = null;
      student.mentorID = null;
      student.mentor_email = null;

      StudentService.updateStudent(student.user, student).then(function(response){
        deSelectStudent(student);
        deSelectVolunteer(volunteer);
        VolunteerService.updateVolunteer(volunteer.username, volunteer)
      })
      .then(onUnmatchSuccess)
      .catch(onUnmatchError);
    }

    function onMatchSuccess(response) {
          // If successful we assign the response to the global user model
      vm.loading = false;
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Matching of pair was successful.' });
      vm.listActiveStudents();

      // And redirect to the previous or home page
      //$state.go($state.previous.state.name || 'home', $state.previous.params);
    }

    function onMatchError(response) {
          vm.loading = false;
          Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> There was an error matching the student-mentor pair.', delay: 6000 });
    }

    function onUnmatchSuccess(response) {
         // If successful we assign the response to the global user model
      vm.loading = false;
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Unmatching of pair was successful.' });
              // And redirect to the previous or home page
              //$state.go($state.previous.state.name || 'home', $state.previous.params);
    }

    function onUnmatchError(response) {
      vm.loading = false;
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> There was an error unmatching the student-mentor pair.', delay: 6000 });
    }



    function buildPager() {
      console.log("HERE IN BP");
      vm.pagedItems_students = [];
      vm.pagedItems_volunteers = [];
      vm.itemsPerPage = 15;
      vm.currentPage_students = 1;
      vm.currentPage_volunteers = 1;
      vm.figureOutItemsToDisplay_students();
      vm.figureOutItemsToDisplay_volunteers();
    }

    function selectStudent(user, el){
      console.log(vm.is_student_selected);
      if(vm.is_student_selected === false){
        vm.neutralBackgroundColor = document.getElementById(user.user).style.backgroundColor;
      }
      else if(vm.is_student_selected === true && vm.selected_student === user){
        deSelectStudent(user);
        return;
      }
      else if(vm.is_student_selected === true && vm.selected_student !== user){
        deSelectStudent(vm.selected_student);
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
      else if(vm.is_volunteer_selected === true && vm.selected_volunteer === user){
        deSelectVolunteer(user);
        return;
      }
      else if(vm.is_volunteer_selected === true && vm.selected_volunteer !== user){
        deSelectVolunteer(vm.selected_volunteer);
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

    function figureOutItemsToDisplay_students() {
      console.log("HERE IN FOID");
      vm.filteredItems_students = $filter('filter')(vm.students, {
        $: vm.search_students
      });
      vm.filterLength_students = vm.filteredItems_students.length;
      var begin = ((vm.currentPage_students - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems_students = vm.filteredItems_students.slice(begin, end);

      console.log("vm.pagedItems: ",vm.pagedItems_students);
    }

    function figureOutItemsToDisplay_volunteers() {
      console.log("HERE IN FOID");
      vm.filteredItems_volunteers = $filter('filter')(vm.volunteers, {
        $: vm.search_volunteers
      });
      vm.filterLength_volunteers = vm.filteredItems_volunteers.length;
      var begin = ((vm.currentPage_volunteers - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems_volunteers = vm.filteredItems_volunteers.slice(begin, end);

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
}


}());

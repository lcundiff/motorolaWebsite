(function() {
  'use strict';

  // Admins controller
  angular
    .module('users')
    .controller('ApplicantsAdminsController', ApplicantsAdminsController);

  ApplicantsAdminsController.$inject = ['$scope', '$state', '$window', '$filter', 'Authentication', 'Notification', 'AdminService', 'UsersService', 'StudentService', 'FileService', 'VolunteerService',/* 'AutomateService', 'googleDriveService',*/'$http','$sce'];

  function ApplicantsAdminsController($scope, $state, $window, $filter, Authentication, Notification, AdminService, UsersService, StudentService, FileService, VolunteerService, /*AutomateService, googleDriveService,*/$http, $sce) {
    var vm = this;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;

    vm.listActiveStudents = listActiveStudents;
    vm.listDeactivatedStudents = listDeactivatedStudents;
    vm.students;

    vm.deactivateStudent = deactivateStudent;
    vm.activateStudent = activateStudent;

    vm.manAcceptStudent = manAcceptStudent;
    vm.displayStudent = displayStudent;

    vm.viewForm = viewForm;

    vm.selected_user = false;

    vm.manAcceptStudent = manAcceptStudent;

    vm.autoAccept = autoAccept;

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

    function autoAccept() {
      AdminService.autoAccept()
      .then(onAutoAcceptSuccess)
      .catch(onAutoAcceptError);
    }

    function onAutoAcceptSuccess(response){
      vm.selected_user = false;
      vm.listActiveStudents();
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Students have been automatically accepted into the program.' });
    }

    function onAutoAcceptError(response){
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> There was an error when auto-accepting students into the program.', delay: 6000 });

    }
    // download pdf form
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
    // download CSV
    $scope.downloadAllCSV = function() {
        // get student info
        var header = "Name, Email, Phone, Address, School, Interviewers, Interview Date, Interview Time, Interview DOW\n";
        var content = "";
        //$scope.StudentService.studentListActive().then(function(data){
        StudentService.studentList().then(function(data){

          var Students = data;

          Students.forEach(function(student) { // creates and formats student data on a CSV sheet
            console.log("student object data: ", student)
            content = "\"" + student.application.firstName + "\"" + "," + "\"" + student.application.email + "\"" + "," +
              "\"" + student.application.phone + "\"" + "," + "\"" + /* student.application.address.city+" , "+ student.application.address.state+" "+student.application.address.zipcode +*/
             /* "\"" + "," + "\"" + */ student.application.school + "\"" + "," + "\"" + student.interviewer[0] +", "+student.interviewer[1] + "\"" + "," + "\"" + " " + "\"" + "," + "\"" + " " + "\"" + "\n" + content;
          });

          content = header + "\n" + content;
        FileService.download('All_Students_CSV.csv').then(function(data){
        console.log("ABOUT TO DOWNLOAD");
            //var fileUrl = $sce.trustAsResourceUrl(URL.createObjectURL(file));
            var link = document.createElement('a');
                link.href = 'data:attachment/csv,' +  encodeURIComponent(content);
                link.download = 'All_Students_CSV.csv';
                link.click();
        });
        },
        function(error) {
          $scope.error = 'Unable to retrieve students!\n' + error;
        });
    }
    $scope.downloadVolunteersCSV = function() {
        // get volunteer info
        var header = "Name, Email, Phone, Address, School, Interviewers, Interview Date, Interview Time, Interview DOW\n";
        var content = "";
        //$scope.StudentService.studentListActive().then(function(data){
        VolunteerService.getAllVolunteers().then(function(data){

          var Volunteers = data;

          Volunteers.forEach(function(volunteer) { // creates and formats volunteer data on a CSV sheet
            console.log("volunteer object data: ", volunteer)
            content = "\"" + volunteer.application.firstName + "\"" + "," + "\"" + volunteer.application.email + "\"" + "," +
              "\"" + volunteer.application.phone + "\"" + "," + "\"" + /* volunteer.application.address.city+" , "+ volunteer.application.address.state+" "+student.application.address.zipcode +*/
             /* "\"" + "," + "\"" + */ volunteer.application.school +"\"" + "," + "\"" + " " + "\"" + "," + "\"" + " " + "\"" + "\n" + content;
          });

          content = header + "\n" + content;
        FileService.download('All_Students_CSV.csv').then(function(data){
        console.log("ABOUT TO DOWNLOAD");
            //var fileUrl = $sce.trustAsResourceUrl(URL.createObjectURL(file));
            var link = document.createElement('a');
                link.href = 'data:attachment/csv,' +  encodeURIComponent(content);
                link.download = 'All_Students_CSV.csv';
                link.click();
        });
        },
        function(error) {
          $scope.error = 'Unable to retrieve students!\n' + error;
        });
    }
    $scope.downloadActiveCSV = function() {
        // get student info
        var header = "Name, Email, Phone, Address, School, Interviewers, Interview Date, Interview Time, Interview DOW\n";
        var content = "";
        //$scope.StudentService.studentListActive().then(function(data){
        StudentService.studentListActive().then(function(data){

          var Students = data;

          Students.forEach(function(student) { // creates and formats student data on a CSV sheet
            console.log("student object data: ", student)
            content = "\"" + student.application.firstName + "\"" + "," + "\"" + student.application.email + "\"" + "," +
              "\"" + student.application.phone + "\"" + "," + "\"" + /* student.application.address.city+" , "+ student.application.address.state+" "+student.application.address.zipcode +*/
             /* "\"" + "," + "\"" + */ student.application.school + "\"" + "," + "\"" + student.interviewer[0] +", "+student.interviewer[1] + "\"" + "," + "\"" + " " + "\"" + "," + "\"" + " " + "\"" + "\n" + content;
          });

          content = header + "\n" + content;
        FileService.download('All_Students_CSV.csv').then(function(data){
        console.log("ABOUT TO DOWNLOAD");
            //var fileUrl = $sce.trustAsResourceUrl(URL.createObjectURL(file));
            var link = document.createElement('a');
                link.href = 'data:attachment/csv,' +  encodeURIComponent(content);
                link.download = 'All_Students_CSV.csv';
                link.click();
        });
        },
        function(error) {
          $scope.error = 'Unable to retrieve students!\n' + error;
        });
    }
    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.users, {
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
      StudentService.studentListActive().then(async function(data){
        console.log("active students: ",data);
        vm.students = data;

        await(vm.buildPager());
      });
    }

    function listDeactivatedStudents() {
      StudentService.studentListDeactivated().then(async function(data){
        console.log("dat1a: ",data);
        vm.students = data;

        await(vm.buildPager());
      });
    }

    //open confirm box when admin performs action

    //open modal window that displays the student resume
    $scope.openModal = function(student, docId){
          console.log(student);
          vm.modal_student = student;
          $scope.vm.modal_student = vm.modal_student;
          var modal = document.getElementById(docId);
          modal.style.display = "block";
    };

    $scope.closeModal = function(docId){
      var modal = document.getElementById(docId);
      var span = document.getElementsByClassName("close")[0];

      modal.style.display = "none";
      vm.modal_student = '';
      $scope.vm.modal_student = '';
    };


    /*$scope.view_forms = function(fileId) {

      alert('Opening file... (Click button to continue)');
      console.log("fileId: ",fileId);
    googleDriveService.getDoc(fileId + '.pdf').then(function(response){


         $http.get('./download/' + fileId + '.pdf', { responseType: 'arraybuffer' })
        .success(function (data) {
           // alert("hi");
           console.log(data);
           // var data ='some data';
            var file = new Blob([data], {
                type: 'application/pdf'
                // type:'image/png'
            });
            // var fileURL = URL.createObjectURL(file);
            // window.open(fileURL);


            var url = $window.URL || $window.webkitURL;

            $scope.fileUrl = $sce.trustAsResourceUrl(url.createObjectURL(file));
            // $scope.fileUrl = window.URL.createObjectURL(file);
            // console.log($scope.fileUrl)
            var link = document.createElement('a');
                link.href = $scope.fileUrl;
                link.download = fileId;
                // console.log(link);
                link.click();
          });

      });
    }*/

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

    $scope.printResume = function(divID_1, divID_2, divID_3){
      var printContents_1 = document.getElementById(divID_1).innerHTML;
      var printContents_2 = document.getElementById(divID_2).innerHTML;
      var printContents = document.getElementById(divID_3).innerHTML;
      var popup = window.open('', '_blank', 'width=300px, height=300px');
      popup.document.open();
      popup.document.write('<html><meta charset="UTF-8">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1">' +
      '<link rel="stylesheet" type="text/css" href="/modules/core/client/css/core.css" media="print">'+
      '<link rel="stylesheet" type="text/css" href="/modules/core/client/css/bootstrap.css" media="print">'+
      '<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css" media="print">'+
      '<link rel="stylesheet" href="https://www.w3schools.com/lib/w3-theme-black.css" media="print">'+
      '<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto" media="print">'+
      '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" media="print">'+
      '<style>'+
      'body, html {height: 100%; margin: 0; font-family: "Roboto", sans-serif;}'+
      'h3,h4,h5,h6 {font-size: 11; font-family: "Roboto", sans-serif;}' +
      'h1 {text-align: center;font-family: "Roboto", sans-serif;}'+
      'h2 {text-align: center;font-family: "Roboto", sans-serif;}'+
      'table {width: 20%;}'+
      'body {background-color: #e6f2ff;}'+
      '.center {text-align:center;}'+
      '</style>'+
      //'<body>' + printContents + '</div></body></html>');
      '<body onload="popup.print();">' +'<div style="width:33%; float:left;">'+ printContents_1 +'</div>' + '<div style="width:66%; float:left;">' + printContents_2 + '</div></body></html>');
      popup.document.close();
      popup.focus();
      popup.print();
      setTimeout(function(){popup.close(); }, 0);
    };

/*

    $scope.getStudent = function(id) {

      //console.log("we here");
      //var id = $stateParams.user;

      //var id = '59f7f305e58b4010fc1307f4';
      console.log(id); //ISSUE: id is undefined
      StudentsService.read(id).then(function(response) {
        $scope.student = response.data;
        console.log($scope.student);
        //console.log(response.data);
        console.log("or are we here?");
      }, function(error) {
        $scope.error = 'Unable to retrieve student!\n' + error;
        console.log("nope");
      });
    };

    $scope.unmatch = function(id) {

      var v_id;
      StudentsService.read(id).then(function(response){

        //Ask admin to confirm unmatch action
        var r = confirm('This will unmatch '+response.data.application.name+' from his/her mentor, '+response.data.mentor+'. Would you like to proceed?');

        //If admin consented to action, unmatch student from mentor
        if( r === true){
          v_id = response.data.mentorID;
          AutomateService.manUnmatch(id, response.data.mentorID).then(function(response){

            VolunteersService.update(response.data, v_id).then(function(response){

              alert('Student successfully unmatched from volunteer.');
              $state.reload();
            });
          });
       }
      });
    };

    /*$scope.autoAssignInterviews = function() {

      //Ask admin to confirm auto assign interviews action
      var r=confirm('This will automatically assign three different interviewers to each active student. Would you like to proceed?');

      //If admin consented to action, automatically assign interviewers to each active student
      if(r === true){
        AutomateService.autoAssignInterviewsAll().then(function(response){
          if(response.data === 'Not enough volunteers available to complete task'){
            alert('Not enough volunteers available to complete task. There must be at least three active interviewers to use this feature.');
          }
          else{
            alert('Auto assignation of interviewers complete.');
            console.log(response);
            $state.reload();
          }
        });
      }
    };*/

    function manAcceptStudent(student, session) {
      if(session === "NA" || session === ""){
        student.timeSlot = [];

        StudentService.updateStudent(student.user, student)
        .then(onRescindSuccess)
        .catch(onRescindError);
      }
      else{
        student.timeSlot[0] = session;

        StudentService.updateStudent(student.user, student)
        .then(onAcceptanceSuccess)
        .catch(onAcceptanceError);
      }
    };

    function onAcceptanceSuccess(response) {
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Student has been accepted into selected session.' });
    }

    function onAcceptanceError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> There was an error when accepting student into selected session.', delay: 6000 });
    }

    function onRescindSuccess(response) {
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Student has been rescinded from the program.' });
    }

    function onRescindError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> There was an error when rescinding acceptance of selected student.', delay: 6000 });
    }

/*
    $scope.autoAcceptStudents = function() {

      var r = confirm('Students with a complete application will be automatically accepted and sorted into the best-fit session. Would you like to proceed?');

      if(r === true){
        AutomateService.autoAcceptAllStudents().then(function(res){
          alert('Auto acceptance of students has completed.');
          $state.reload();
        });
      }
    };

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
  //vm.students.splice(index, 1);
  //vm.pagedItems.splice(index, 1);


  StudentService.updateStudent(user, student)
  .then(onDeactivationSuccess)
  .catch(onDeactivationError);
};

function onDeactivationSuccess(response) {
    vm.listActiveStudents();
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
      vm.listDeactivatedStudents();
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

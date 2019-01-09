(function() {
  'use strict';

  // Admins controller
  angular
    .module('users')
    .controller('FormsAdminsController', FormsAdminsController);

  FormsAdminsController.$inject = ['$scope', '$state', '$window', '$filter', 'Authentication', 'Notification', 'AdminService', 'FileService', 'UsersService', 'StudentService', /*'VolunteersService', 'AutomateService', 'googleDriveService',*/'$http','$sce'];

  function FormsAdminsController($scope, $state, $window, $filter, Authentication, Notification, AdminService, FileService, UsersService, StudentService,/* VolunteersService, AutomateService, googleDriveService,*/$http, $sce) {
    var vm = this;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;

    vm.listActiveStudents = listActiveStudents;
    vm.listDeactivatedStudents = listDeactivatedStudents;
    vm.students;

    vm.deactivateStudent = deactivateStudent;
    vm.activateStudent = activateStudent;
    vm.viewForm = viewForm;

    vm.sendFormFixEmail = sendFormFixEmail;

    vm.approveLetterOfRecommendation = approveLetterOfRecommendation;
    vm.approveResume = approveResume;
    vm.approveWaiver = approveWaiver;
    vm.approveNDA = approveNDA;

    vm.uploadNDA = uploadNDA;
    vm.uploadWaiver = uploadWaiver;

    vm.displayUser = displayUser;

    vm.selected_user = false;

    function buildPager() {
      vm.pagedItems = [];
      vm.itemsPerPage = 15;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
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

    function displayUser(user){
      vm.user = user;

      console.log(vm.user);

      vm.selected_user = true;
    }

    function listActiveStudents() {
      StudentService.studentListActive().then(async function(data){
        vm.students = data;
        vm.selected_user = false;

        await(vm.buildPager());
      });
    }
    listActiveStudents(); 
      
    function listDeactivatedStudents() {
      StudentService.studentListNonActiveWithoutForms().then(async function(data){
        vm.students = data;
        //vm.selected_user = false;
        await(vm.buildPager());
      });
    }

    //open confirm box when admin performs action

    //open modal window that displays the student resume
    $scope.openModal = function(username, docId){

        StudentService.getStudentByUsername(username).then(function(data){
          vm.modal_student = data;
          $scope.vm.modal_student = vm.modal_student;
          var modal = document.getElementById(docId);
          modal.style.display = "block";
        });
    };

    $scope.closeModal = function(docId){
      var modal = document.getElementById(docId);
      var span = document.getElementsByClassName("close")[0];

      modal.style.display = "none";
      vm.modal_student = '';
      $scope.vm.modal_student = '';
    };

    function uploadNDA(){
      console.log($scope.file.upload);

      $scope.uploading = true;
      FileService.uploadNDA($scope.file)
      .then(onNDAUploadSuccess)
      .catch(onFormUploadError);
    }

    function uploadWaiver(){
      console.log(document.getElementById("nda_upload").value);

      console.log($scope.file.upload);
      console.log("file: ",$scope.file);

      $scope.uploading = true;
      FileService.uploadWaiver($scope.file)
      .then(onWaiverUploadSuccess)
      .catch(onFormUploadError);
    }

    function onNDAUploadSuccess(response) {
      // If successful we assign the response to the global user model
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> NDA upload successful.' });
      $scope.uploading = false;

      // And redirect to the previous or home page
      //$state.go($state.previous.state.name || 'home', $state.previous.params);
    }

    function onWaiverUploadSuccess(response) {
      // If successful we assign the response to the global user model
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Waiver upload successful.' });
      $scope.uploading = false;
      // And redirect to the previous or home page
      //$state.go($state.previous.state.name || 'home', $state.previous.params);
    }

    function onFormUploadError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Form upload error.', delay: 6000 });
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

    function approveNDA(student){
      vm.user.isNDAAdminApproved = true;

      StudentService.updateStudent(student.user, vm.user).then(function(data){
        console.log(data);
        onFormApprovalSuccess('NDA', (student.application.firstName+' '+student.application.lastName));
        approveForms(student);
      })
    }

    function approveWaiver(student){
      vm.user.isWaiverAdminApproved = true;

      StudentService.updateStudent(student.user, vm.user).then(function(data){
        console.log(data);
        onFormApprovalSuccess('Waiver', (student.application.firstName+' '+student.application.lastName));
        approveForms(student);
      });
    }

    function approveLetterOfRecommendation(student){
      vm.user.isLetterofRecommendationAdminApproved = true;

      console.log("before: ",vm.user);
      StudentService.updateStudent(student.user, vm.user).then(function(data){
        console.log("data: ",data);
        onFormApprovalSuccess('Letter of Recommendation', (student.application.firstName+' '+student.application.lastName));
        approveForms(student);
      });
    }

    function approveResume(student){
      vm.user.isResumeAdminApproved = true;

      StudentService.updateStudent(student.user, vm.user).then(function(data){
        console.log("data: ", data);
        onFormApprovalSuccess('Resume', (student.application.firstName+' '+student.application.lastName));
        approveForms(student);
      });
    }

    function approveForms(student){
      if(student.isResumeAdminApproved === true && student.isLetterofRecommendationAdminApproved === true && student.isNDAAdminApproved === true && student.isWaiverAdminApproved === true){
        student.areFormsAdminApproved = true;


        StudentService.updateStudent(student.user, student).then(function(data){
          console.log("data: ",data);
          vm.selected_user = false;
          vm.user = null;
          vm.students.splice(vm.students.indexOf(student), 1);
          vm.pagedItems.splice(vm.students.indexOf(student), 1);
          onFormCompletionSuccess(data);
        });
      }
    }

    function onFormApprovalSuccess(formName, studentName) {
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> The '+formName+' form belonging to '+studentName+' has been approved.' });
    }

    function onFormCompletionSuccess(response) {
      // If successful we assign the response to the global user model
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> All of the forms applicable to this student have been approved.' });
      // And redirect to the previous or home page
      //$state.go($state.previous.state.name || 'home', $state.previous.params);
    }

    function sendFormFixEmail(student, formName) {
      var credentials = {
        email: student.application.email,
        firstName: student.application.firstName,
        lastName: student.application.lastName,
        formName: formName
      }

      UsersService.sendFormFixEmail(credentials)
      .then(onFormFixEmailDeliverySuccess)
      .catch(onFormFixEmailDeliveryError);
    }

    function onFormFixEmailDeliverySuccess(response) {
          // If successful we assign the response to the global user model
          Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Email sent successfully.' });
          // And redirect to the previous or home page
          //$state.go($state.previous.state.name || 'home', $state.previous.params);
        }

    function onFormFixEmailDeliveryError(response) {
          Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Email send error.', delay: 6000 });
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


function deactivateStudent(user, student, index) {
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

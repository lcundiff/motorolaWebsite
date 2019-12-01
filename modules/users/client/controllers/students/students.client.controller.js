(function() {
  'use strict';

  // Students controller
  angular
    .module('users')
    .controller('StudentsController', StudentsController)

  StudentsController.$inject = ['$scope', '$state', '$window', 'StudentService', 'FileService', 'Authentication', 'Notification', '$http','$sce'];

  function StudentsController($scope, $state, $window, StudentService, FileService, Authentication, Notification, $http, $sce) {
    var vm = this;
    vm.tutorial = {
      toggle: false,
      submitApplication: false,
      saveApplication: false,
    };

    vm.tutorialPlay = tutorialPlay;
    vm.closeApps = closeApps;
    vm.closeApps(); // run this on load to find if apps are closed  
    vm.loading = false;
    vm.student;
    vm.credentials;
    vm.authentication = Authentication;
	  $scope.sessions = ["Session 1 (6/25/18 - 6/29/18)", "Session 2 (7/23/18 - 7/27/18)", "Session 3 (8/6/18 - 8/10/18)"];
    vm.updateStudent = updateStudent;
	  vm.saveApp = saveApp;
    vm.remove = remove;

    vm.uploadResume = uploadResume;
    //vm.viewResume = viewResume;

    vm.addClasses = addClasses;
    vm.editClass = editClass;
    vm.removeClass = removeClass;

    vm.addClubs = addClubs;
    vm.editClub = editClub;
    vm.removeClub = removeClub;

    vm.addProjects = addProjects;
    vm.editProject = editProject;
    vm.removeProject = removeProject;

    vm.addVolunteerExperiences = addVolunteerExperiences;
    vm.editVolunteerExperience = editVolunteerExperience;
    vm.removeVolunteerExperience = removeVolunteerExperience;

    vm.addProfessionalExperiences = addProfessionalExperiences;
    vm.editProfessionalExperience = editProfessionalExperience;
    vm.removeProfessionalExperience = removeProfessionalExperience;
    
    // checks if apps are closed on backend (student controller)
    function closeApps(){
      StudentService.checkAppsClosed().then(function(res){
        console.log("app status: " + res.appsClosed);
        vm.appsClosed = res.appsClosed;
        
      });
      console.log("apps closed boolean: " + vm.appsClosed);
    }

    StudentService.getStudentByUsername(vm.authentication.user.username).then(function(data){
      if(data.message === undefined){
        $scope.vm.credentials = data;
        $scope.vm.credentials.application = data.application;

        if(!data.isAppComplete){
          $scope.vm.submitIsUpdate = false;
        }
        else{

          $scope.vm.submitIsUpdate = true;
        }

      }
      else{
        $scope.vm.credentials = {};
        $scope.vm.credentials.application = {};
        $scope.vm.credentials.application.firstName = vm.authentication.user.firstName;
        $scope.vm.credentials.application.lastName = vm.authentication.user.lastName;
        $scope.vm.credentials.application.email = vm.authentication.user.email;
        $scope.vm.submitIsUpdate = false;
      }
    });

    function tutorialPlay(){
      console.log("HERE");
      if(vm.tutorial.toggle){
        console.log("STEP 1");
        console.log(vm.tutorial);
        if(!vm.tutorial.submitApplication && !vm.tutorial.saveApplication){
          vm.tutorial.submitApplication = true;
          return;
        }
        else if(vm.tutorial.submitApplication && !vm.tutorial.saveApplication){
          console.log("STEP2");
          vm.tutorial.submitApplication = false;
          vm.tutorial.saveApplication = true;
          return;
        }
        else if(!vm.tutorial.submitApplication && vm.tutorial.saveApplication){
          console.log("STEP3");
          vm.tutorial.saveApplication = false;
          vm.tutorial.toggle = false;
          return;
        }
      }
    }

    function uploadResume(){
      console.log($scope.file.upload);
      vm.credentials.ResumeId = $scope.file.upload.name;

      $scope.uploading = true;

      FileService.upload($scope.file).then(function(data){
        console.log(data);
        if(data.data.success){
          $scope.uploading = false;
        }
      });

      StudentService.updateStudent(vm.credentials.user, vm.credentials)
        .then(onResumeSubmissionSuccess)
        .catch(onResumeSubmissionError);
    }

    function addClasses() {
      var classN = {
        editMode: false,
        title: $scope.vm.classTitle,
        grade: $scope.vm.classGrade,
        description: $scope.vm.classDescription
      }

      $scope.vm.credentials.application.classes.push(classN);

      $scope.vm.classTitle = '';
      $scope.vm.classGrade = '';
      $scope.vm.classDescription = '';

    }

    function editClass(classE, index) {
      classE.editMode = false;
      $scope.vm.credentials.application.classes[index] = classE;
    }

    function removeClass(index) {
      $scope.vm.credentials.application.classes.splice(index, 1);
    }

    function addClubs() {
      var club = {
        editMode: false,
        name: $scope.vm.clubName,
        position: $scope.vm.clubPosition,
        description: $scope.vm.clubPosition
      }

      $scope.vm.credentials.application.clubs.push(club);

      $scope.vm.clubName = '';
      $scope.vm.clubPosition = '';
      $scope.vm.clubDescription = '';
    }

    function editClub(clubE, index) {
      clubE.editMode = false;
      $scope.vm.credentials.application.clubs[index] = clubE;
    }

    function removeClub(index) {
      $scope.vm.credentials.application.clubs.splice(index, 1);
    }

    function addProjects() {
      var project = {
        editMode: false,
        title: $scope.vm.projectTitle,
        link: $scope.vm.projectLink,
        description: $scope.vm.projectDescription
      }

      $scope.vm.credentials.application.projects.push(project);

      $scope.vm.projectTitle = '';
      $scope.vm.projectLink = '';
      $scope.vm.projectDescription = '';
    }

    function editProject(projE, index){
      projE.editMode = false;
      $scope.vm.credentials.application.projects[index] = projE;
    }

    function removeProject(index) {
      $scope.vm.credentials.application.projects.splice(index, 1);
    }

    function addVolunteerExperiences() {
      var volExp = {
        editMode: false,
        organizationName: $scope.vm.VolunteerOrganizationName,
        position: $scope.vm.VolunteerPosition,
        description: $scope.vm.VolunteerDescription,
        startDate: $scope.vm.VolunteerStartDate,
        endDate: $scope.vm.VolunteerEndDate
      }

      $scope.vm.credentials.application.volunteerExperiences.push(volExp);

      $scope.vm.VolunteerOrganizationName = '';
      $scope.vm.VolunteerPosition = '';
      $scope.vm.VolunteerDescription = '';
      $scope.vm.VolunteerStartDate = '';
      $scope.vm.VolunteerEndDate = '';
    }

    function editVolunteerExperience(volE, index){
      volE.editMode = false;
      $scope.vm.credentials.application.volunteerExperiences[index] = volE;
    }

    function removeVolunteerExperience(index) {
      $scope.vm.credentials.application.volunteerExperiences.splice(index, 1);
    }

    function addProfessionalExperiences() {
      var work = {
        editMode: false,
        companyName: $scope.vm.WorkCompanyName,
        position: $scope.vm.WorkPosition,
        description: $scope.vm.WorkDescription,
        startDate: $scope.vm.WorkStartDate,
        endDate: $scope.vm.WorkEndDate
      }

      $scope.vm.credentials.application.professionalExperiences.push(work);

      $scope.vm.WorkCompanyName = '';
      $scope.vm.WorkPosition = '';
      $scope.vm.WorkDescription = '';
      $scope.vm.WorkStartDate = '';
      $scope.vm.WorkEndDate = '';
    }

    function editProfessionalExperience(work, index){
      work.editMode = false;
      $scope.vm.credentials.application.professionalExperiences[index] = work;
    }

    function removeProfessionalExperience(index) {
      $scope.vm.credentials.application.professionalExperiences.splice(index, 1);
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

    function updateStudent(isValid){
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.studentForm');
        console.log("NOT VALID");
        Notification.error({ message: 'Review form for errors.', title: '<i class="glyphicon glyphicon-remove"></i> Fields in form are either missing information or are incorrect.', delay: 6000 });
        vm.credentials.isAppComplete = false;
        vm.submitIsUpdate = false;

        findFirstErrorOnApp();
        return false;
      }
      vm.loading = true;

	     $scope.$broadcast('show-errors-reset', 'vm.studentForm');
       vm.credentials.isAppComplete = true;
       vm.submitIsUpdate = true;

      StudentService.updateStudent(vm.credentials.user, vm.credentials)
        .then(onStudentSubmissionSuccess)
        .catch(onStudentSubmissionError);
    }
	function saveApp(isValid){
    vm.loading = true;
	  $scope.$broadcast('show-errors-reset', 'vm.studentForm');
      StudentService.updateStudent(vm.credentials.user, vm.credentials)
        .then(onStudentSaveSuccess)
        .catch(onStudentSaveError);
    }

    function remove(student){
      if ($window.confirm('Are you sure you want to delete this student?')) {
        if (student) {
          student.$remove();

          //vm.users.splice(vm.users.indexOf(user), 1);
          Notification.success('Student deleted successfully!');
        } else {
          vm.student.$remove(function () {
            //$state.go('admin.users');
            Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Student deleted successfully.' });
          });
        }
      }
    }

    function onStudentSubmissionSuccess(response) {
      // If successful we assign the response to the global user model
      vm.authentication.student = response;
      vm.loading = false;
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Student submission successful.' });
      // And redirect to the previous or home page
      //$state.go($state.previous.state.name || 'home', $state.previous.params);
    }
	// when student saves the application
    function onStudentSaveSuccess(response) {
      // If successful we assign the response to the global user model
      vm.authentication.student = response;
      vm.loading = false;
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Student save successful.' });
    }

    function onStudentSaveError(response) {
      vm.loading = false;
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Student save error.', delay: 6000 });
    }

    function onStudentSubmissionError(response) {
      vm.loading = false;
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Student submission error.', delay: 6000 });
    }
}

}());

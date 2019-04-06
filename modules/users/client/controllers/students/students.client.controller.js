(function() {
  'use strict';

  // Students controller
  angular
    .module('users')
    .controller('StudentsController', StudentsController)

  StudentsController.$inject = ['$scope', '$state', '$window', 'StudentService', 'FileService', 'Authentication', 'Notification', '$http','$sce'];

  function StudentsController($scope, $state, $window, StudentService, FileService, Authentication, Notification, $http, $sce) {
    var vm = this;
    vm.loading = false;
    vm.student;
    vm.credentials;
    vm.authentication = Authentication;
	$scope.sessions = ["Session 1 (6/25/18 - 6/29/18)", "Session 2 (7/23/18 - 7/27/18)", "Session 3 (8/6/18 - 8/10/18)"]
    vm.createStudent = createStudent;
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

    $scope.exportStudents = function() {
      // console.log("here");
        StudentService.studentList().then(function(data){
          var Students = data;
          console.log(Students)
          var header = "Name, Email, Phone, Address, School, Interviewers, Interview Date, Interview Time, Interview DOW";
          var content = "";
          // creates and formats student data on a CSV sheet
          Students.forEach(function(student) {
            console.log("student object data: ", student)
            content = "\"" + student.application.firstName + "\"" + "," + "\"" + student.application.email + "\"" + "," +
              "\"" + student.application.phone + "\"" + "," + "\"" + /* student.application.address.city+" , "+ student.application.address.state+" "+student.application.address.zipcode +*/
             /* "\"" + "," + "\"" + */ student.application.school + "\"" + "," + "\"" + student.interviewer[0] +", "+student.interviewer[1] + "\"" + "," + "\"" + " " + "\"" + "," + "\"" + " " + "\"" + "\n" + content;
          });

          content = header + "\n" + content;

          var body = {
            name: "accepted_students",
            mimeType: "text/csv",
            content: content
          }

          console.log(body);


          googleDriveService.createDocs(body).then(function(response){
            console.log("response: ");
            console.log(response);
            var file_id = response.data.id + ".csv";
            // var file_id = "All_Students.csv";

            googleDriveService.getDoc(file_id).then(function(){
              $http.get('./download/'+file_id, {responseType: 'arraybuffer' })
                .success(function(data) {
                  console.log('data')

                  var file = new Blob([data], {
                    type: 'text/csv'
                  });

                  var url = $window.URL || $window.webkitURL;

                  $scope.fileUrl = $sce.trustAsResourceUrl(url.createObjectURL(file));
                  var link = document.createElement('a');
                  link.href = $scope.fileUrl;
                  link.download = "All_Students.csv";
                  // console.log(link);
                  link.click();
                });
            });
          });

        /*  googleDriveService.updateDocs(body, "1JPr3KO6Dxt8SJakP9WSYx32fukvY9c3C")
            .then(function() {
              googleDriveService.getDoc("1JPr3KO6Dxt8SJakP9WSYx32fukvY9c3C.csv").then(function(){
                // alert('Downloaded to download folder');
                $http.get('./download/1JPr3KO6Dxt8SJakP9WSYx32fukvY9c3C.csv', { responseType: 'arraybuffer' })
                  .success(function (data) {
                   // alert("hi");
                   console.log(data);
                   // var data ='some data';
                    var file = new Blob([data], {
                        type: 'text/csv'
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
                        link.download = '1JPr3KO6Dxt8SJakP9WSYx32fukvY9c3C.csv';
                        // console.log(link);
                    link.click();
          });
              });
            });*/
        },
        function(error) {
          $scope.error = 'Unable to retrieve students!\n' + error;
        });
    };
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



    function createStudent(isValid){

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.studentForm');
        Notification.error({ message: 'Review form for errors.', title: '<i class="glyphicon glyphicon-remove"></i> Fields in form are either missing information or are incorrect.', delay: 6000 });


        return false;
      }
      StudentService.createStudent(vm.credentials)
        .then(onStudentSubmissionSuccess)
        .catch(onStudentSubmissionError);
    }

    function updateStudent(isValid){
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.studentForm');
        console.log("NOT VALID");
		/// Show user where the error is specifically.
		//var errorElement = document.querySelector( '#personal' ); // grab element
		//errorElement.scrollIntoView(); // scroll it into view
        //var idName = myElement.getAttribute('id'); // grab ID name from element
		//console.log(idName); // confirm we have right element

        Notification.error({ message: 'Review form for errors.', title: '<i class="glyphicon glyphicon-remove"></i> Fields in form are either missing information or are incorrect.', delay: 6000 });
        vm.credentials.isAppComplete = false;
        vm.submitIsUpdate = false;
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

 (function() {
  'use strict';

  // Students controller
  angular
    .module('users')
    .controller('StudentsController', StudentsController)

  StudentsController.$inject = ['$scope', '$state', '$window', 'StudentService', 'Authentication', 'Notification', '$http','$sce'];

  function StudentsController($scope, $state, $window, StudentService, Authentication, Notification, $http, $sce) {
    var vm = this;
    vm.student;
    vm.credentials;
    vm.authentication = Authentication;

    vm.createStudent = createStudent;
    vm.updateStudent = updateStudent;
    vm.isContextUserSelf = isContextUserSelf;
    vm.remove = remove;

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

    StudentService.getStudentByUsername(vm.authentication.user.username).then(function(data){
      if(data.message === undefined){
        $scope.vm.credentials = data;
        $scope.vm.credentials.application = data.application;
        $scope.vm.submitIsUpdate = true;
        console.log("userid check: ",$scope.vm.credentials);
      }
      else{
        $scope.vm.credentials = {};
        $scope.vm.credentials.application = {};
        $scope.vm.credentials.application.firstName = vm.authentication.user.firstName;
        $scope.vm.credentials.application.lastName = vm.authentication.user.lastName;
        $scope.vm.credentials.application.email = vm.authentication.user.email;
        $scope.vm.submitIsUpdate = true;
      }
    });

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

        return false;
      }
      StudentService.createStudent(vm.credentials)
        .then(onStudentSubmissionSuccess)
        .catch(onStudentSubmissionError);
    }

    function updateStudent(isValid){
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.studentForm');

        return false;
      }
      StudentService.updateStudent(vm.credentials.user, vm.credentials)
        .then(onStudentSubmissionSuccess)
        .catch(onStudentSubmissionError);
    }

    function isContextUserSelf(){

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
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Student submission successful.' });
      // And redirect to the previous or home page
      //$state.go($state.previous.state.name || 'home', $state.previous.params);
    }

    function onStudentSubmissionError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Student submission error.', delay: 6000 });
    }

    /*$scope.ChangesNotAllowed = function(){
      alert('Sorry, resume modifications are no longer allowed as the submission period is over as of May 25th. You will receive a notification if you are selected into this program.');
    };


    $scope.SubmitResume = async function() {
      console.log("student id: ",Authentication.user._id);
      console.log("student prior: ");
      console.log($scope.student);
      var fd = new FormData();

      var p2 = Promise.resolve(fd.append('myfile', $scope.file.upload1));

      Promise.all([p2]).then(function([p2]){
        googleDriveService.uploadDocs(fd).then(async function(data){
          //update student
          if($scope.student.ResumeId !== ""){
            /*await (  googleDriveService.deleteDocs($scope.student.ResumeId).then(function(response){
                console.log("Previous Resume existed. Now deleted.");
                console.log(response);
              }));
          }

          await($scope.student.ResumeId = data.data.id);

          await(StudentsService.update(student, student.user).then(function(response){
            console.log("yo I'm here 123");
            console.log("response: ", response);

            alert('File successfully uploaded.');

            $window.location.reload();
          }));

        });
      });


    };*/

    /*$scope.Submit = function (fileType) {

      //console.log("uploadsubmit called");

      var fd = new FormData();
      // if
      // $scope.file.upload.fileType = fileType;
      if (fileType === "NDA"){
        fd.append('myfile', $scope.file.upload1);
      } else if (fileType === "waiver"){
        fd.append('myfile', $scope.file.upload2);
      } else if (fileType === "Letter"){
        fd.append('myfile', $scope.file.upload3);
      }

      alert("Form is uploading... (Click button to continue)");

       googleDriveService.uploadDocs(fd).then(function (data) {

           $scope.uploading = false;
           $scope.alert = 'alert alert-success';
           $scope.message = data.data.message;
           $scope.file = {};

           updateStudentAfterForms(fileType, data.data.id);
      });

    };*/

    $scope.photoChanged1 = function (files) {
      console.log("files: ",files);
      //if (files.length > 0 && files[0].name.match(/\.(png|jpg|jpeg|pdf|gif)$/)) {
      if (files.length > 0 && files[0].name.match(/\.(pdf)$/)) {
        $scope.uploading1 = true;
        // console.log(files);
      } else {
        $scope.uploading1 = false;
      }
    };

    $scope.photoChanged2 = function (files) {
      console.log("files: ",files);
    //  if (files.length > 0 && files[0].name.match(/\.(png|jpg|jpeg|pdf|gif)$/)) {
    if (files.length > 0 && files[0].name.match(/\.(pdf)$/)) {
        $scope.uploading2 = true;
        // console.log(files);
      } else {
        $scope.uploading2 = false;
      }
    };
    $scope.photoChanged3 = function (files) {
      console.log("files: ",files);
      //if (files.length > 0 && files[0].name.match(/\.(png|jpg|jpeg|pdf|gif)$/)) {
      if (files.length > 0 && files[0].name.match(/\.(pdf)$/)) {
        $scope.uploading3 = true;
      } else {
        $scope.uploading3 = false;
      }
    };
    $scope.notMeetFile = function(){
      //alert("Please upload file correctly (only png, jpg, jpeg, pdf allowed");
      alert("Only files in PDF format are allowed for submission. Please upload file correctly.");
    };

    $scope.download_NDA = function(){
      googleDriveService.getNDA().then(function(resp){
        console.log("response 1022: ",resp);

        $scope.download(resp.data.id, resp.data.name);

        /*googleDriveService.getDoc(resp.data.id + '.pdf').then(function(response){
          $http.get('./public/upload/' + 'NDA.pdf', { responseType: 'arraybuffer' })
         .success(function (data) {
            console.log(data);
            // var data ='some data';
             var file = new Blob([data], {
                 type: 'application/pdf'
                 // type:'image/png'
             });


             var url = $window.URL || $window.webkitURL;

             $scope.fileUrl = $sce.trustAsResourceUrl(url.createObjectURL(file));
             // $scope.fileUrl = window.URL.createObjectURL(file);
             // console.log($scope.fileUrl)
             var link = document.createElement('a');
                 link.href = $scope.fileUrl;
                 link.download = 'NDA.pdf';
                 // console.log(link);
                 link.click();
           });
        });*/
      });
    };

    $scope.download_Waiver = function(){
      googleDriveService.getWaiver().then(function(resp){
        console.log("response 2022: ",resp);

        $scope.download(resp.data.id, resp.data.name);

        /*googleDriveService.getDoc(resp.data.id + '.pdf').then(function(response){
          $http.get('./public/upload/' + 'NDA.pdf', { responseType: 'arraybuffer' })
         .success(function (data) {
            console.log(data);
            // var data ='some data';
             var file = new Blob([data], {
                 type: 'application/pdf'
                 // type:'image/png'
             });


             var url = $window.URL || $window.webkitURL;

             $scope.fileUrl = $sce.trustAsResourceUrl(url.createObjectURL(file));
             // $scope.fileUrl = window.URL.createObjectURL(file);
             // console.log($scope.fileUrl)
             var link = document.createElement('a');
                 link.href = $scope.fileUrl;
                 link.download = 'NDA.pdf';
                 // console.log(link);
                 link.click();
           });
        });*/
      });
    };

  /*  $scope.download = function(fileId, fileName) {


      googleDriveService.getDoc(fileId + '.pdf').then(function(response){


         $http.get('./download/' + fileName, { responseType: 'arraybuffer' })
        .success(function (data) {
           console.log(data);
           // var data ='some data';
            var file = new Blob([data], {
                type: 'application/pdf'
                // type:'image/png'
            });


            var url = $window.URL || $window.webkitURL;

            $scope.fileUrl = $sce.trustAsResourceUrl(url.createObjectURL(file));
            // $scope.fileUrl = window.URL.createObjectURL(file);
            // console.log($scope.fileUrl)
            var link = document.createElement('a');
                link.href = $scope.fileUrl;
                link.download = fileName;
                // console.log(link);
                link.click();
          });

      });




  };*/

    $scope.removeFile = function(doc) {
      //doc is the entire document object stored in student
      //Assuming a student can only delete what he has submitted
      googleDriveService.deleteDocs(doc.id).then(function(response) {
        $scope.student_Forms.splice($scope.student_Forms.indexOf(doc), 1);
        $scope.updateStudent($scope.userid);
        console.log(response);
      }, function(error) {
        console.log(error);
      });

    };
  // Submission functions for forms page
  // letter of rec
    $scope.saveSubmittedLetterofRecommendation = function(){
   console.log("we changin submitted letter");

   StudentsService.read($scope.userid).then(function(response){
           $scope.student= response.data;
           $scope.student.isLetterofRecommendationSubmitted = true;


           StudentsService.update($scope.student, $scope.student.user).then(function(response){

             console.log("Success updating letters");
             console.log(response);
           });

  }, function(error) {
           $scope.error = 'Unable to retrieve student!\n' + error;
         });

 };

 $scope.saveSubmittedNDA = function(){
   //console.log("we changin submitted letter");

   StudentsService.read($scope.userid).then(function(response){
           $scope.student= response.data;
           $scope.student.isNDASubmitted = false;
           $scope.student.NDAId = $scope.up_file_id;
           console.log("NDAId: ",$scope.student.NDAId);

           if($scope.student.isWaiverSubmitted == true){
             $scope.student.isFormSubmitted = true;
           }

           StudentsService.update($scope.student, $scope.student.user).then(function(response){

             googleDriveService.listDocs().then(function(response){
               console.log("gr: ", response);
             })

             console.log("Success updating NDA");
             console.log(response);
           });

  }, function(error) {
           $scope.error = 'Unable to retrieve student!\n' + error;
         });

 };

 $scope.saveSubmittedWaiver = function(){
   //console.log("we changin submitted letter");

   StudentsService.read($scope.userid).then(function(response){
           $scope.student= response.data;
           $scope.student.isWaiverSubmitted = true;
           $scope.student.WaiverId = $scope.up_file_id;

           if($scope.student.isNDASubmitted == true){
               $scope.student.isFormSubmitted = true;
           }

           StudentsService.update($scope.student, $scope.student.user).then(function(response){

             console.log("Success updating Waiver");
             console.log(response);
           });

  }, function(error) {
           $scope.error = 'Unable to retrieve student!\n' + error;
         });

 };
}

}());

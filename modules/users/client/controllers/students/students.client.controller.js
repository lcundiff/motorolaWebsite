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

    StudentService.getStudentByUsername(vm.authentication.user.username).then(function(data){
      if(data.message === undefined){
        $scope.vm.credentials = data;
        $scope.vm.credentials.application = data.application;
      }
      else{
        $scope.vm.credentials = {};
        $scope.vm.credentials.application = {};
        $scope.vm.credentials.application.firstName = vm.authentication.user.firstName;
        $scope.vm.credentials.application.lastName = vm.authentication.user.lastName;
        $scope.vm.credentials.application.email = vm.authentication.user.email;
      }
    });

    function addClasses() {
      var classN = {
        editMode: false,
        title: $scope.vm.classTitle,
        grade: $scope.vm.classGrade,
        description: $scope.vm.classDescription
      }

      console.log("classN: ",classN);

      $scope.vm.credentials.application.classes.push(classN);

      $scope.vm.classTitle = '';
      $scope.vm.classGrade = '';
      $scope.vm.classDescription = '';

    };
    function addClubs() {
      var club = {
        editMode: false,
        name: $scope.club_name,
        position: $scope.club_position,
        description: $scope.club_description
      }

      $scope.student_clubs.push(club);

      $scope.club_name = '';
      $scope.club_position = '';
      $scope.club_description = '';

    };

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

    $scope.Submit = function (fileType) {

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

    };

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



    $scope.remove = function() {
      var id = '59ec3b14c2c8291270f23d73';

      StudentsService.delete(id)
        .then(function(response) {
          //$state.go('TBD', {successMessage: 'A student had been deleted! '});
        }, function(error) {
          $scope.error = 'Unable to delete student\n' + error;
        });
    };

    $scope.enterEditMode_work = function(work){
    /*  for(var i =0; i<$scope.student_proExperience.length; i++){
        document.getElementById($scope.student_proExperience[i].id+'editButton').disabled = true;
      }*/
      if($scope.inWorkEditMode === true){
        alert('You can only edit one work experience at a time.');
      }
      else{

        $scope.work_edit.edit_pro_companyName = work.companyName;
        $scope.work_edit.edit_pro_position = work.position;
        $scope.work_edit.edit_pro_startDate = work.startDate;
        $scope.work_edit.edit_pro_endDate = work.endDate;
        $scope.work_edit.edit_pro_description = work.description;
      console.log('workeditMode: ',work.editMode);
      work.editMode = true;
      $scope.inWorkEditMode = true;
    }

    };

    $scope.enterEditMode_vol = function(volE){
      if($scope.inVolEditMode === true){
        alert('You can only edit one volunteer experience at a time.');
      }
      else{

        $scope.vol_edit.edit_vol_orgName = volE.organizationName;
        $scope.vol_edit.edit_vol_position = volE.position;
        $scope.vol_edit.edit_vol_startDate = volE.startDate;
        $scope.vol_edit.edit_vol_endDate = volE.endDate;
        $scope.vol_edit.edit_vol_description = volE.description;
      console.log('workeditMode: ',volE.editMode);
      volE.editMode = true;
      $scope.inVolEditMode = true;
    }

    };

    $scope.enterEditMode_class = function(classE){
      if($scope.inClassEditMode === true){
        alert('You can only edit one class at a time.');
      }
      else{

        $scope.class_edit.edit_class_title = classE.title;
        $scope.class_edit.edit_class_grade = classE.grade;
        $scope.class_edit.edit_class_description = classE.description;

      classE.editMode = true;
      $scope.inClassEditMode = true;
    }

    };

    $scope.enterEditMode_club = function(club){
      if($scope.inClubEditMode === true){
        alert('You can only edit one club at a time.');
      }
      else{

        $scope.club_edit.edit_club_name = club.name;
        $scope.club_edit.edit_club_position = club.position;
        $scope.club_edit.edit_club_description = club.description;

      club.editMode = true;
      $scope.inClubEditMode = true;
    }

    };

    $scope.enterEditMode_proj = function(proj){
      if($scope.inProjEditMode === true){
        alert('You can only edit one project at a time.');
      }
      else{

        $scope.proj_edit.edit_proj_title = proj.title;
        $scope.proj_edit.edit_proj_link = proj.link;
        $scope.proj_edit.edit_proj_description = proj.description;

      proj.editMode = true;
      $scope.inProjEditMode = true;
    }

    };

    $scope.removeProExperience = function(work) {
      $scope.student_proExperience.splice($scope.student_proExperience.indexOf(work), 1);
    };

    $scope.removeVolExperience = function(vol) {
      $scope.student_volExperience.splice($scope.student_volExperience.indexOf(vol), 1);
    };

    $scope.removeClass = function(stdClass) {
      $scope.student_classes.splice($scope.student_classes.indexOf(stdClass), 1);
    };

    $scope.removeClub = function(club) {
      $scope.student_clubs.splice($scope.student_clubs.indexOf(club), 1);
    };

    $scope.removeProject = function(project) {
      $scope.student_projects.splice($scope.student_projects.indexOf(project), 1);
    };

    //Functionality to edit sections added to the student application
    $scope.editProExperience = function(work) {
      console.log("in here");
      return new Promise(function(resolve, reject){
        work.companyName = $scope.work_edit.edit_pro_companyName;
        work.position = $scope.work_edit.edit_pro_position;
        work.startDate = $scope.work_edit.edit_pro_startDate;
        work.endDate = $scope.work_edit.edit_pro_endDate;
        work.description = $scope.work_edit.edit_pro_description;
        work.editMode = false;
        console.log("$scope: ",$scope);
        resolve(work);
      }).then(function(updated_work){
        return new Promise(function(resolve, reject){
          for(var i =0; i<$scope.student_proExperience.length; i++){
            console.log("are work ids equal?",$scope.student_proExperience[i].id === updated_work.id);
            if($scope.student_proExperience[i].id === updated_work.id){
              $scope.student_proExperience[i].companyName === work.companyName;
              $scope.student_proExperience[i].position === work.position;
              $scope.student_proExperience[i].startDate === work.startDate;
              $scope.student_proExperience[i].endDate === work.endDate;
              $scope.student_proExperience[i].description === work.description;
              $scope.student_proExperience[i].editMode === work.editMode;

              console.log($scope.student_proExperience);
              resolve($scope.student_proExperience);
            }
          }
        });
      }).then(function(){
        console.log("PE: ",$scope.student_proExperience);
        $scope.inWorkEditMode = false;
        /*for(var i =0; i<$scope.student_proExperience.length; i++){
          console.log(document.getElementById($scope.student_proExperience[i].id+'editButton'));
          document.getElementById($scope.student_proExperience[i].id+'editButton').disabled = false;
        }*/
        console.log("$scope.inEditMode", $scope.inEditMode);
      });
    };

    $scope.editVolExperience = function(volE) {
      console.log("in here");
      return new Promise(function(resolve, reject){
        volE.organizationName = $scope.vol_edit.edit_vol_orgName;
        volE.position = $scope.vol_edit.edit_vol_position;
        volE.startDate = $scope.vol_edit.edit_vol_startDate;
        volE.endDate = $scope.vol_edit.edit_vol_endDate;
        volE.description = $scope.vol_edit.edit_vol_description;
        volE.editMode = false;
        console.log("$scope: ",$scope);
        resolve(volE);
      }).then(function(updated_volE){
        return new Promise(function(resolve, reject){
          for(var i =0; i<$scope.student_volExperience.length; i++){
            console.log("are work ids equal?",$scope.student_volExperience[i].id === updated_volE.id);
            if($scope.student_volExperience[i].id === updated_volE.id){
              $scope.student_volExperience[i].orgName === volE.orgName;
              $scope.student_volExperience[i].position === volE.position;
              $scope.student_volExperience[i].startDate === volE.startDate;
              $scope.student_volExperience[i].endDate === volE.endDate;
              $scope.student_volExperience[i].description === volE.description;
              $scope.student_volExperience[i].editMode === volE.editMode;

              console.log($scope.student_volExperience);
              resolve($scope.student_volExperience);
            }
          }
        });
      }).then(function(){
        console.log("PE: ",$scope.student_volExperience);
        $scope.inVolEditMode = false;
      /*  for(var i =0; i<$scope.student_volExperience.length; i++){
          console.log(document.getElementById($scope.student_volExperience[i].id+'editButton'));

          document.getElementById($scope.student_volExperience[i].id+'editButton').disabled = false;
        }*/
        console.log("$scope.inEditMode", $scope.inVolEditMode);
      });
    };

    $scope.editClass = function(classE) {
      console.log("in here");
      return new Promise(function(resolve, reject){
        classE.title = $scope.class_edit.edit_class_title;
        classE.grade = $scope.class_edit.edit_class_grade;
        classE.description = $scope.class_edit.edit_class_description;
        classE.editMode = false;
        console.log("$scope: ",$scope);
        resolve(classE);
      }).then(function(updated_classE){
        return new Promise(function(resolve, reject){
          for(var i =0; i<$scope.student_classes.length; i++){
            if($scope.student_classes[i].id === updated_classE.id){
              $scope.student_classes[i].title === classE.title;
              $scope.student_classes[i].grade === classE.grade;
              $scope.student_classes[i].description === classE.description;
              $scope.student_classes[i].editMode === classE.editMode;

              resolve($scope.student_classes);
            }
          }
        });
      }).then(function(){
        $scope.inClassEditMode = false;
      });
    };

    $scope.editClub = function(club) {
      return new Promise(function(resolve, reject){
        club.title = $scope.club_edit.edit_club_name;
        club.position = $scope.club_edit.edit_club_position;
        club.description = $scope.club_edit.edit_club_description;
        club.editMode = false;

        resolve(club);
      }).then(function(updated_club){
        return new Promise(function(resolve, reject){
          for(var i =0; i<$scope.student_clubs.length; i++){
            if($scope.student_clubs[i].id === updated_club.id){
              $scope.student_clubs[i].name === club.name;
              $scope.student_clubs[i].position === club.position;
              $scope.student_clubs[i].description === club.description;
              $scope.student_clubs[i].editMode === club.editMode;

              resolve($scope.student_clubs);
            }
          }
        });
      }).then(function(){
        $scope.inClubEditMode = false;
      });
    };

    $scope.editProj = function(proj) {
      return new Promise(function(resolve, reject){
        proj.title = $scope.proj_edit.edit_proj_title;
        proj.link = $scope.proj_edit.edit_proj_link;
        proj.description = $scope.proj_edit.edit_proj_description;
        proj.editMode = false;

        resolve(proj);
      }).then(function(updated_proj){
        return new Promise(function(resolve, reject){
          for(var i =0; i<$scope.student_projects.length; i++){
            if($scope.student_projects[i].id === updated_proj.id){
              $scope.student_projects[i].title === proj.title;
              $scope.student_projects[i].link === proj.position;
              $scope.student_projects[i].description === proj.description;
              $scope.student_projects[i].editMode === proj.editMode;

              resolve($scope.student_projects);
            }
          }
        });
      }).then(function(){
        $scope.inProjEditMode = false;
      });
    };

    //Functionality to add classes to the student application

    //Functionality to add projects to the student application
    $scope.addProjects = function() {
      console.log("Here added project");
      var project = {
        id: Math.floor((Math.random()*6)+1),
        editMode: false,
        title: $scope.proj_title,
        link: $scope.proj_link,
        description: $scope.proj_description
      }

      $scope.student_projects.push(project);

      $scope.proj_title = '';
      $scope.proj_link = '';
      $scope.proj_description = '';

    };
    //Functionality to add clubs to the student application
    $scope.addClubs = function() {
      var club = {
        id: Math.floor((Math.random()*6)+1),
        editMode: false,
        name: $scope.club_name,
        position: $scope.club_position,
        description: $scope.club_description
      }

      $scope.student_clubs.push(club);

      $scope.club_name = '';
      $scope.club_position = '';
      $scope.club_description = '';

    };

    $scope.addProExperience = function() {
      var proExperience = {
        id: Math.floor((Math.random()*6)+1),
        editMode: false,
        companyName: $scope.pro_companyName,
        position: $scope.pro_position,
        startDate: $scope.pro_startDate,
        endDate: $scope.pro_endDate,
        description: $scope.pro_description
      }

      return new Promise(function(resolve, reject){

        $scope.student_proExperience.push(proExperience);

        $scope.pro_companyName = '';
        $scope.pro_position = '';
        $scope.pro_startDate = '';
        $scope.pro_endDate = '';
        $scope.pro_description = '';

        resolve($scope.student_proExperience);
      }).then(function(student_proExperience){
      /*  if($scope.inWorkEditMode === true){
          console.log(document.getElementById(proExperience.id+'editButton'));
          document.getElementById(proExperience.id+'editButton').disabled = true;
        }*/
      });
    };

    $scope.addVolExperience = function() {
      var volExperience = {
        id: Math.floor((Math.random()*6)+1),
        editMode: false,
        organizationName: $scope.vol_orgName,
        position: $scope.vol_position,
        startDate: $scope.vol_startDate,
        endDate: $scope.vol_endDate,
        description: $scope.vol_description
      }

      return new Promise(function(resolve, reject){
        $scope.student_volExperience.push(volExperience);

        $scope.vol_orgName = '';
        $scope.vol_position = '';
        $scope.vol_startDate = '';
        $scope.vol_endDate = '';
        $scope.vol_description = '';

        resolve($scope.student_volExperience);
      }).then(function(student_volExperience){
      /*  if($scope.inVolEditMode === true){
          console.log(document.getElementById(volExperience.id+'editButton'));

          document.getElementById(volExperience.id+'editButton').disabled = true;
        }*/
      });
    };

  /*  $scope.addLocationChoice = function() {
      var locationChoice = {
        name: $scope.locName,
        address: $scope.locAddress
      }

      $scope.student_locationChoice.add(locationChoice);
    };

    $scope.addForm = function(formId) {
      $scope.student_Forms.push(formId);
    };

    $scope.addInterviewRank = function() {
      var interviewRank = {
        interviewer: $scope.interviewer_name,
        rank: $scope.rank
      }
      $scope.interview_rank.push(interviewRank);
      $scope.interviewer_name = '';
      $scope.rank = '';
    };*/

  }

}());

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
    vm.authentication = Authentication;
    vm.createStudent = createStudent;
    vm.updateStudent = updateStudent;
    vm.isContextUserSelf = isContextUserSelf;
    vm.remove = remove;

    console.log("vm.authentication: ",vm.authentication);

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

    function updateStudentAfterForms(fileType, fileId){

      StudentsService.read($scope.userid).then(function(response){
        console.log("123400");
              $scope.student= response.data;

              return new Promise(function(resolve, reject){
                console.log("123500");
                if(fileType ==="NDA" && $scope.student.NDAId !== ""){
                    googleDriveService.deleteDocs($scope.student.NDAId).then(function(response){
                      console.log("Previous NDA existed. Now deleted.");
                      console.log(response);

                      resolve($scope.student);
                    });
                }
                else if(fileType === "waiver" && $scope.student.WaiverId !== ""){
                    googleDriveService.deleteDocs($scope.student.WaiverId).then(function(response){
                      console.log("Previous Waiver existed. Now deleted.");
                      console.log(response);

                      resolve($scope.student);
                    });
                }
                else if(fileType === "Letter" && $scope.student.letterOfRecommendationId !== ""){
                    googleDriveService.deleteDocs($scope.student.letterOfRecommendationId).then(function(response){
                      console.log("Previous Letter of Recommendation existed. Now deleted.");
                      console.log(response);

                      resolve($scope.student);
                    });
                }
                else if(fileType === "Resume" && $scope.student.ResumeId !== ""){
                  googleDriveService.deleteDocs($scope.student.ResumeId).then(function(response){
                    console.log("Previous Resume existed. Now deleted.");
                    console.log(response);

                    resolve($scope.student);
                  })
                }
                else{
                  resolve($scope.student);
                }
              }).then(function(student){
                return new Promise(function(resolve, reject){
                  if(fileType ==="NDA" ){
                    $scope.student.isNDASubmitted = true;
                    $scope.student.NDAId = fileId;
                    console.log("student.NDAId: ", $scope.student.NDAId);
                    console.log("$scope.student 233", $scope.student);

                    resolve($scope.student);
                  }
                  else if(fileType === "waiver"){
                    $scope.student.isWaiverSubmitted = true;
                    $scope.student.WaiverId = fileId;

                    console.log("$scope.student 233", $scope.student);

                    resolve($scope.student);
                  }
                  else if(fileType === "Letter"){
                    $scope.student.isLetterofRecommendationSubmitted = true;
                    $scope.student.letterOfRecommendationId = fileId;

                    console.log("$scope.student 233", $scope.student);

                    resolve($scope.student);
                  }
                  else if(fileType === "Resume"){
                    $scope.student.ResumeId = fileId;
                  }
                });
              }).then(async function(student){
                console.log("54600");
                console.log("student", student);
                if($scope.student.isNDASubmitted === true && $scope.student.isWaiverSubmitted === true){
                  await ($scope.student.isFormSubmitted = true);
                }

                StudentsService.update(student, student.user).then(function(response){
                  console.log("yo I'm here");
                  console.log("response: ", response);

                  alert('File successfully uploaded.');

                  $window.location.reload();
                });
              });
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

    function saveStudent() {

      var application = {
        name: $scope.stuuser.displayName,
        email: $scope.stuuser.email,
        phone: $scope.app_phone,
        address: {
          line_1: $scope.app_line_1,
          line_2: $scope.app_line_2,
          city: $scope.app_city,
          state: $scope.app_state,
          zipcode: $scope.app_zipcode
        },
        school: $scope.app_school,
        grade: $scope.app_school_grade,
        parent: {
          name: $scope.parent_name,
          email: $scope.parent_email,
          phone: $scope.parent_phone
        },
        classes: $scope.student_classes,
        projects: $scope.student_projects,
        clubs: $scope.student_clubs,


        professionalExperiences: $scope.student_proExperience,
        volunteerExperiences: $scope.student_volExperience,
        preferredSession1: $scope.app_session1,
        preferredSession2: $scope.app_session2,
        preferredSession3: $scope.app_session3
        //timeSlot: $scope.student_timeSlot
      }

      var student = {
        credentialId: 'TBD',
        application: application,
        locationChoice: $scope.student_locationChoice,
        interviewForms: $scope.student_Forms,
        interviewForms: $scope.student_interviewForms,
        forms: $scope.student_Forms,
        sessionsAvailable: $scope.student_timeSlots,
        interests: [$scope.student_interests_1, $scope.student_interests_2, $scope.student_interests_3],

        mentor: $scope.student_mentor,
        mentorID: $scope.student_mentorID,
        mentor_email: $scope.student_mentor_email,
        track: $scope.student_track,
        isAppComplete : $scope.student.isAppComplete,
        isLetterofRecommendationSubmitted: $scope.student.isLetterofRecommendationSubmitted,
        isFormSubmitted: $scope.student.isFormSubmitted,
         isWaiverSubmitted: $scope.student.isWaiverSubmitted,
         isNDASubmitted: $scope.student.isNDASubmitted


        }

      return student;
    }

    function upSaveStudent(){
      console.log("B2");
      var student = $scope.student;

      return new Promise(function(resolve, reject){
        var application = {
          name: $scope.stuuser.displayName,
          email: $scope.stuuser.email,
          phone: $scope.app_phone,
          address: {
            line_1: $scope.app_line_1,
            line_2: $scope.app_line_2,
            city: $scope.app_city,
            state: $scope.app_state,
            zipcode: $scope.app_zipcode
          },
          school: $scope.app_school,
          grade: $scope.app_school_grade,
          parent: {
            name: $scope.parent_name,
            email: $scope.parent_email,
            phone: $scope.parent_phone
          },
          classes: $scope.student_classes,
          projects: $scope.student_projects,
          clubs: $scope.student_clubs,


          professionalExperiences: $scope.student_proExperience,
          volunteerExperiences: $scope.student_volExperience,
          preferredSession1: $scope.app_session1,
          preferredSession2: $scope.app_session2,
          preferredSession3: $scope.app_session3
          //timeSlot: $scope.student_timeSlot
        }

        console.log("student application: ",application);
        student.application = application;
        student.credentialId = 'TBD';
        student.locationChoice = $scope.student_locationChoice;
        student.interests = [$scope.student_interests_1, $scope.student_interests_2, $scope.student_interests_3];
        student.isAppComplete = $scope.student.isAppComplete;

        resolve(student);
      }).then(function(upStudent){
        console.log("Updated Student: ", upStudent);
        return upStudent;
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
    $scope.testUser = function() {

      console.log("we are in testuser");

      StudentsService.read($scope.userid)
        .then(function(response) {
          console.log("A123: ", response);
          $scope.student = response.data;
          $scope.app_name = $scope.stuuser.displayName;
          $scope.app_email = $scope.stuuser.email;
          if ($scope.student.application !== null || $scope.student.application !== undefined) {
            $scope.app_name = $scope.student.application.name;
            $scope.app_email = $scope.student.application.email;
            $scope.app_phone = $scope.student.application.phone;
            $scope.app_line_1 = $scope.student.application.address.line_1;
            $scope.app_line_2 = $scope.student.application.address.line_2;
            $scope.app_city = $scope.student.application.address.city;
            $scope.app_state = $scope.student.application.address.state;
            $scope.app_zipcode = $scope.student.application.address.zipcode;
            $scope.app_school = $scope.student.application.school;
            $scope.app_school_grade = $scope.student.application.grade;
            $scope.parent_name = $scope.student.application.parent.name;
            $scope.parent_email = $scope.student.application.parent.email;
            $scope.parent_phone = $scope.student.application.parent.phone;
            $scope.app_session1 = $scope.student.application.preferredSession1;
            $scope.app_session2 = $scope.student.application.preferredSession2;
            $scope.app_session3 = $scope.student.application.preferredSession3;
            $scope.student_interests_1 = $scope.student.interests[0];
            $scope.student_interests_2 = $scope.student.interests[1];
            $scope.student_interests_3 = $scope.student.interests[2];

            // console.log("a111",$scope.app_line_1);

            $scope.student.application.professionalExperiences.forEach(function(element) {
              $scope.student_proExperience.push(element);
              $scope.parent_email = $scope.student.application.parent.email;
            });

            $scope.student.application.projects.forEach(function(element) {
              $scope.student_projects.push(element);
            });

            $scope.student.application.volunteerExperiences.forEach(function(element) {
              $scope.student_volExperience.push(element);
            });

            $scope.student.application.clubs.forEach(function(element) {
              $scope.student_clubs.push(element);
            });

            $scope.student.application.classes.forEach(function(element) {
              $scope.student_classes.push(element);
            });

            // $scope.student.interests.forEach(function(element){
            //   $scope.student_interests.push(element);
            // });

            $scope.student.forms.forEach(function(element) {
              $scope.student_Forms.push(element);
            });

            $scope.student.locationChoice.forEach(function(element) {
              $scope.student_locationChoice.push(element);
            });
          }
        }, function(error) {
          $scope.error = 'Unable to retrieve student!\n' + error;
        });

    };

$scope.notMeet = function(){
  alert("Please fill all the required(*) area.");
}

$scope.modifyStudent = function(){
  console.log("A1");
  StudentsService.read($scope.userid).then(function(response){
    console.log("res data app: ", response.data.application);
    if(response.data.application === null || response.data.application === undefined){
      console.log('create initiated');
      $scope.createStudent();

    }
    else {
      console.log("update");
      console.log("$scope.userid in modifyStudent:", $scope.userid);
      $scope.updateStudent($scope.userid);
    }
	document.emailSubmission.submit();
    alert("Application submitted successfully.");
}, function(error) {
  $scope.error = 'Unable to retrieve student!\n' + error;
});
};

    $scope.getAllStudent = function() {
      StudentsService.getAll()
        .then(function(response) {
          $scope.students = response.data;
          console.log($scope.students);
        }, function(error) {
          $scope.error = 'Unable to retrieve students!\n' + error;
        });

      };


      var isAppComplete = false;

      function checkAppStatus(student){
        console.log('Student here: ',student);
        return new Promise(function(resolve, reject){

        if( student.application.email !== '' && student.application.phone !== '' &&   student.application.address !== '' &&
           student.application.school !== '' && student.application.preferredSession1 !== '' &&
           student.application.preferredSession2 !== '' && student.application.preferredSession3 !== ''){
            //console.log($scope.student.isAppComplete);
            student.isAppComplete = true ;

            resolve(student);

          }
          else {
            student.isAppComplete = false;

            resolve(student);
          }
        }).then(function(upStudent){
          return upStudent;
        });
      };

      $scope.checkAppStatus2 = function(userid) {
          StudentsService.read($scope.userid).then(function(response){
             $scope.student = response.data;

             console.log("the value on db is:" + $scope.student.isAppComplete);

             if ($scope.student.isAppComplete !== false){
                 isAppComplete = true;
             }

             else{
                 isAppComplete = false;
             }

             console.log("we are executing this: " + isAppComplete);

       }, function(error){
           $scope.error = 'Unable to check application status\n' + error;
       });

     };



    $scope.getStudent = function(id) {
      StudentsService.read(id)
        .then(function(response) {
          $scope.student = response.data;
          //console.log(response.data);
        }, function(error) {
          $scope.error = 'Unable to retrieve student!\n' + error;
        });
    };

    $scope.createStudent = function() {
      return new Promise(function(resolve, reject){
        $scope.error = null;

        var student = saveStudent();
        student.indivRanks = ["Not Ranked", "Not Ranked", "Not Ranked"];
        student.interviewRank = [];
        student.timeSlot = [];
        student.mentor = "";
        student.mentorID = "";
        student.NDAId = "";
        student.WaiverId = "";
        student.letterOfRecommendationId = "";
        student.resumeId = "";

        resolve(student);
      }).then(function(stu){
        return new Promise(function(resolve, reject){

          var upStudent = checkAppStatus(stu);

          resolve(upStudent);
        });
      }).then(function(newUpStudent){
        StudentsService.create(newUpStudent)
          .then(function(response) {
            console.log("response after creation: ", response.data);
            $scope.student = response.data;
          //  $scope.student = response.data;
            //alert('Application submitted successfully.');
            //$window.location.reload();
            //  $state.go('TBD', {successMessage: 'A student had been registered! '});
          }, function(error) {
            $scope.error = 'Unable to save student!\n' + error;
          });
      });
    };

    // $scope.checkStuff = function(){
    //   console.log("file upload doc: ",document.getElementById('file_Upload'));
    //   console.log("file upload doc: ",document.getElementById('file_upload2'));
    // };

    $scope.submitEmail = function () {
        $scope.myTxt = "You clicked submit!";
    }

    $scope.updateStudent = function(id) {
      return new Promise(function(resolve, reject){
        console.log("B1");
        var student = upSaveStudent();
        console.log("B2 student: ", student);

        resolve(student);
      }).then(function(stu){
        return new Promise(function(resolve, reject){
          var upStudent = checkAppStatus(stu);
		  //angular.element('#mce-EMAIL').trigger('submit');
		  //var mailchimp = angular.element( document.querySelector( '#mce-EMAIL' ) );
		  document.getElementById('#mce-EMAIL').submit();
          resolve(upStudent);
        });
      }).then(function(newUpStudent){
        console.log("B3");
        console.log("newUpStudent: ",newUpStudent);
        StudentsService.update(newUpStudent, id).then(function(response){
          console.log('Success update student!');
          console.log(response);
          $scope.student = response.data;
           //$window.location.reload();
        });
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
    $scope.addClasses = function() {
      var classes = {
        id: Math.floor((Math.random()*6)+1),
        editMode: false,
        title: $scope.class_title,
        grade: $scope.class_grade,
        description: $scope.class_description
      }

      $scope.student_classes.push(classes);

      $scope.class_title = '';
      $scope.class_grade = '';
      $scope.class_description = '';

    };

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

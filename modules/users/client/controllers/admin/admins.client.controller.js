(function() {
  'use strict';

  // Admins controller
  angular
    .module('users')
    .controller('AdminsController', AdminsController);

  AdminsController.$inject = ['$scope', '$state', '$window', 'UsersService', 'StudentService', /*'VolunteersService', 'AutomateService', 'googleDriveService',*/'$http','$sce'];

  function AdminsController($scope, $state, $window, UsersService, StudentService,/* VolunteersService, AutomateService, googleDriveService,*/$http,$sce) {

    var selectedStudent;
    var selectedVolunteer;
    var selectedVolunteerName;
    var selectedStudentName;
    var applicantsModal;
    var volModal;
    var chooseMentor;
    // console.log(volunteers);



    /////////////////Web page scripts//////////////////////
    //Initialize variables when in applicants view

    //open confirm box when admin performs action

    //open modal window that displays the student resume
    $scope.openModal = function(id, docId){
      return new Promise(function(resolve, reject){
        console.log("Open Modal id: ",id);
        $scope.modal_Id = id;

        var modal_student = getModalStudent(id);


        resolve(modal_student);
      }).then(function(modal_student){
          var modal = document.getElementById(docId);

          modal.style.display = "block";
      });
    };

    $scope.closeModal = function(docId){
      var modal = document.getElementById(docId);
      var span = document.getElementsByClassName("close")[0];

      modal.style.display = "none";
    };

    $scope.openModal_V = function(id, docId){
      return new Promise(function(resolve, reject){
        console.log("Open Modal id: ",id);
        $scope.modal_Id = id;

        var modal_student = getModalVolunteer(id);


        resolve(modal_student);
      }).then(function(modal_student){
          var modal = document.getElementById(docId);

          modal.style.display = "block";
      });
    };

    $scope.closeModal_V = function(docId){
      var modal = document.getElementById(docId);
      var span = document.getElementsByClassName("close")[0];

      modal.style.display = "none";
    };

    $scope.view_forms = function(fileId) {

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

    //add selected student to page for matching
    $scope.addSelectedStudent = function(student) {

      $scope.selectedStu = student.application.name;
      $scope.selectedStuID = student.user._id;
      selectedStudentName = student.application.name;
      selectedStudent = student.user._id;
      return student;
    };

    //add selected volunteer to page for matching
    $scope.addSelectedVolunteer = function(volunteer) {
      $scope.selectedVol = volunteer.application.name;
      $scope.selectedVolID = volunteer._id;

      selectedVolunteer = volunteer.user._id;
      selectedVolunteerName = volunteer.application.name;
      return volunteer;
    };

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

    //man-match function
    $scope.match = function() {

      var r = confirm('This action will match selected student to selected mentor. Would you like to proceed?');

      if(r === true){

        AutomateService.manMatch($scope.selectedStuID, $scope.selectedVolID).then(function(response){
          console.log(response);
          if(response.data === 'Student already matched'){
            alert('This match cannot be done: student already has a mentor.');
          }
          else{
            alert('Student and mentor have been matched.');
          }
          $state.reload();
          });
        }
    };


    $scope.fillSlots = function() {
      console.log("fillSlots invoked.");
       for(var i = 0; i < $scope.students.length; i++)
       {
          if($scope.students[i].timeSlot.length === 0)
          {
            document.getElementById($scope.students[i].user._id + 'session').value = "NA";
          }
          else
          {
            document.getElementById($scope.students[i].user._id + 'session').value = $scope.students[i].timeSlot[0];
          }
        }
    };

    //list students
    $scope.listStudent = function() {
      $scope.active_students = [];
      //get all the students, then bind it to the scope
      StudentService.studentListActive().then(function(response) {
          $scope.students = response.data;

      }, function(error) {
        //console.log("we have an issue");
        $scope.error = "Unable to retrieve students! \n" + error;
      });
    };


    function getModalVolunteer(id){
      console.log(id);
      console.log("Inside get Modal");
      VolunteersService.read(id).then(function(response){
        console.log("is response data here? :",response.data);
        $scope.modal_volunteer = response.data;
        console.log("modal volunteer: ",$scope.modalv);


        return $scope.modalv;
      }, function(error){
        $scope.error = 'Unable to retrieve volunteer!\n' + error;
      });
    };

    function getModalStudent(id){
      console.log(id); //ISSUE: id is undefined
      console.log("Inside get Modal");
      StudentService.read(id).then(function(response) {
        $scope.modal_student = response.data;
        console.log($scope.modal_student);
        //console.log(response.data);
        console.log("or are we here?");

        return response.data;
      }, function(error) {
        $scope.error = 'Unable to retrieve student!\n' + error;
        console.log("nope");
      });
    };

    $scope.getStudent = function(id) {

      //console.log("we here");
      //var id = $stateParams.user;
      //var id = '59f7f305e58b4010fc1307f4';
      console.log(id); //ISSUE: id is undefined
      StudentService.read(id).then(function(response) {
        $scope.student = response.data;
        console.log($scope.student);
        //console.log(response.data);
        console.log("or are we here?");
      }, function(error) {
        $scope.error = 'Unable to retrieve student!\n' + error;
        console.log("nope");
      });
    };

//File google drive stuff!!! IMPORTANT!!! DO NOT ERASE!
    /*$scope.exportStudents = function() {
      console.log("here");

      StudentService.getAll()
        .then(function(response) {
          var students = response.data;
          var header = "Name, Email, Phone, Address, School, Grade";
          var content = "";

          //console.log(students);
          students.forEach(function(student) {
            content = "\"" + student.application.name + "\"" + "," + "\"" + student.application.email + "\"" + "," +
              "\"" + student.application.phone + "\"" + "," + "\"" + student.application.address + "\"" + "," +
              "\"" + student.application.school + "\"" + "," + "\"" + student.application.grade + "\"" + "\n" + content;
          });

          content = header + "\n" + content;

          var body = {
            name: "students",
            mimeType: "text/csv",
            content: content
          }

          console.log(body);

          googleDriveService.updateDocs(body, "1JPr3KO6Dxt8SJakP9WSYx32fukvY9c3C")
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
            });

          //console.log($scope.students);
        }, function(error) {
          $scope.error = 'Unable to retrieve students!\n' + error;
        });
    };*/



    $scope.exportVolunteers = function() {
      // console.log("here");

      VolunteersService.getAll()
        .then(function(response) {
          var volunteers = response.data;
          var header = "Volunteer Name, Volunteer Email, Volunteer Phone, Session Available, Expertises, Interviewees, URL";
          var content = "";
          var string = "";

          // creates and formats student data on a CSV sheet
          volunteers.forEach(function(volunteer) {
            string = "\"" + volunteer.application.name + "\"" + "," + "\"" + volunteer.application.email + "\"" + "," +
              "\"" + volunteer.application.phone + "\"" + "," + "\""  + volunteer.application.sessions + "\"" + "," + "\""  + volunteer.application.areaofexpertise ;
            for(var i =0; i < volunteer.interviewee.length; i++){
              if (i == 0) string = string + "\"" + "," + "\"" ;
              else string = string + ', ';
              string = string + volunteer.interviewee[i];
            }
            string = string + "\"" + "," + "\"" + volunteer.profileImageURL;
            content = string + "\"" + "," + "\"" + " " + "\"" + "," + "\"" + " " + "\"" + "," + "\"" + " " + "\"" + "\n" + content;
          });

          content = header + "\n" + content;

          var body = {
            name: "all_volunteers",
            mimeType: "text/csv",
            content: content
          }

          console.log(body);


          googleDriveService.createDocs(body).then(function(response){
            console.log("response: ");
            console.log(response);
            var file_id = response.data.id + ".csv";
            // var file_id = "All_Volunteers.csv";

            googleDriveService.getDoc(file_id).then(function(){
              $http.get('./download/'+ file_id, {responseType: 'arraybuffer' })
                .success(function(data) {
                  console.log('data')

                  var file = new Blob([data], {
                    type: 'text/csv'
                  });

                  var url = $window.URL || $window.webkitURL;

                  $scope.fileUrl = $sce.trustAsResourceUrl(url.createObjectURL(file));
                  var link = document.createElement('a');
                  link.href = $scope.fileUrl;
                  link.download = "Accepted_Students.csv";
                  // console.log(link);
                  link.click();
                });
            });
          });
        }, function(error) {
          $scope.error = 'Unable to retrieve students!\n' + error;
        });
    };

    $scope.exportStudents_accepted = function() {

      StudentService.listAccepted()
        .then(function(response) {
          var students = response.data;
          var header = "Student Name, Student Email, Student Phone, Parent Name, Parent Email, Parent Phone, Address, School, Interviewers, Interview Date, Interview Time, Interview DOW";
          var content = "";

          // creates and formats student data on a CSV sheet
          students.forEach(function(student) {
            content = "\"" + student.application.name + "\"" + "," + "\"" + student.application.email + "\"" + "," +
              "\"" + student.application.phone + "\"" + "," + "\"" + student.application.parent.name + "\"" + "," + "\"" + student.application.parent.email + "\"" + "," + "\"" + student.application.parent.phone + "\"" + "," + "\""  + student.application.address.line_1+" "+student.application.address.line_2+", "+student.application.address.city+" , "+student.application.address.state+" "+student.application.address.zipcode + "\"" + "," + "\"" + student.application.address + "\"" + "," +
              "\"" + student.application.school + "\"" + "," + "\"" + student.interviewer[0] +", " + student.interviewer[1] +  "\"" + "," + "\"" + " " + "\"" + "," + "\"" + " " + "\"" + "," + "\"" + " " + "\"" + "\n" + content;
          });

          content = header + "\n" + content;

          var body = {
            name: "all_volunteers",
            mimeType: "text/csv",
            content: content
          }

          console.log(body);


          googleDriveService.createDocs(body).then(function(response){
            console.log("response: ");
            console.log(response);
            var file_id = response.data.id + ".csv";
            // var file_id = "Accepted_Students.csv";

            googleDriveService.getDoc(file_id).then(function(){
              $http.get('./download/'+ file_id, {responseType: 'arraybuffer' })
                .success(function(data) {
                  console.log('data')

                  var file = new Blob([data], {
                    type: 'text/csv'
                  });

                  var url = $window.URL || $window.webkitURL;

                  $scope.fileUrl = $sce.trustAsResourceUrl(url.createObjectURL(file));
                  var link = document.createElement('a');
                  link.href = $scope.fileUrl;
                  link.download = "Accepted_Students.csv"
                  // console.log(link);
                  link.click();
                });
            });
          });
        }, function(error) {
          $scope.error = 'Unable to retrieve students!\n' + error;
        });
    };

    $scope.exportVolunteers = function() {
      // console.log("here");

      VolunteersService.getAll()
        .then(function(response) {
          var volunteers = response.data;
          var header = "Volunteer Name, Volunteer Email, Volunteer Phone, Session Available, Expertises, Interviewees, URL";
          var content = "";
          var string = "";

          // creates and formats student data on a CSV sheet
          volunteers.forEach(function(volunteer) {
            string = "\"" + volunteer.application.name + "\"" + "," + "\"" + volunteer.application.email + "\"" + "," +
              "\"" + volunteer.application.phone + "\"" + "," + "\""  + volunteer.application.sessions + "\"" + "," + "\""  + volunteer.application.areaofexpertise ;
            for(var i =0; i < volunteer.interviewee.length; i++){
              if (i == 0) string = string + "\"" + "," + "\"" ;
              else string = string + ', ';
              string = string + volunteer.interviewee[i];
            }
            string = string + "\"" + "," + "\"" + volunteer.profileImageURL;
            content = string + "\"" + "," + "\"" + " " + "\"" + "," + "\"" + " " + "\"" + "," + "\"" + " " + "\"" + "\n" + content;
          });

          content = header + "\n" + content;

          var body = {
            name: "all_volunteers",
            mimeType: "text/csv",
            content: content
          }

          console.log(body);


          googleDriveService.createDocs(body).then(function(response){
            console.log("response: ");
            console.log(response);
            var file_id = response.data.id + ".csv";
            // var file_id = "All_Volunteers.csv";

            googleDriveService.getDoc(file_id).then(function(){
              $http.get('./download/'+ file_id, {responseType: 'arraybuffer' })
                .success(function(data) {
                  console.log('data')

                  var file = new Blob([data], {
                    type: 'text/csv'
                  });

                  var url = $window.URL || $window.webkitURL;

                  $scope.fileUrl = $sce.trustAsResourceUrl(url.createObjectURL(file));
                  var link = document.createElement('a');
                  link.href = $scope.fileUrl;
                  link.download = "All_Volunteers.csv";
                  // console.log(link);
                  link.click();
                });
            });
          });
        }, function(error) {
          $scope.error = 'Unable to retrieve students!\n' + error;
        });
    };

     $scope.updateFile = function(name, fileId){
         var fil = document.getElementById(name);
         // alert(fil.value);
         var file = {
          fileName : fil.value.substring(12),
          mimeType: 'text/'+fil.value.substring(fil.value.indexOf('.')+1),
         };


         googleDriveService.updateByUpload(file, fileId).then(function(response){
          alert('Updated file: ' + response.data.name);
          alert("Update Successful");
          console.log(response.data);

       });

     }, function(error){
          console.log(error);
      };

      $scope.updateFile = function(name, fileId){
          var fil = document.getElementById(name);
          // alert(fil.value);
          var file = {
           fileName : fil.value.substring(12),
           mimeType: 'text/'+fil.value.substring(fil.value.indexOf('.')+1),
          };


          googleDriveService.updateByUpload(file, fileId).then(function(response){
           alert('Updated file: ' + response.data.name);
           alert("Update Successful");
           console.log(response.data);

        });

      }, function(error){
           console.log(error);
       };


    $scope.listVolunteer = function() {
      VolunteersService.getAll()
        .then(function(response) {
          $scope.volunteers = response.data;
          console.log("All volunteers:", response.data);
        }, function(error) {

          $scope.error = "Unable to retrieve volunteers! \n" + error;
        });
    };

    $scope.getVolunteer = function(id) {

      console.log("We are retrieving a volunteer");

      // var id = $stateParams._id;
      VolunteersService.read(id)
        .then(function(response) {
          $scope.volunteer = response.data;
        }, function(error) {
          $scope.error = 'Unable to retrieve volunteer!\n' + error;
        });
    };

    $scope.unmatch = function(id) {

      var v_id;
      StudentService.read(id).then(function(response){

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

    $scope.autoAssignInterviews = function() {

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
    };

    $scope.manAcceptStudents = function(id, sessionNum) {
      var r;
      //Ask admin to confirm manual acceptance of student.
      if(sessionNum === "NA"){
        r = confirm('This will rescind the acceptance of the selected student. Would you like to proceed?');
      }
      else{
        r = confirm('This will accept selected student into session '+sessionNum+'. Would you like to proceed?');
      }

      //If admin consented, continue with action
      if(r === true){

        if(sessionNum === undefined){
          alert('Please enter a session number.');
          $state.reload();
        }
        else {
          AutomateService.manAcceptStudent(id, sessionNum).then(function(response){
            if(sessionNum === "NA"){
              alert('Student acceptance has been rescinded.');
            }
            else{
              alert('Student has been accepted into session '+sessionNum+'.');
            }
            $state.reload();
          });
        }
      }
    };

    $scope.autoAcceptStudents = function() {

      var r = confirm('Students with a complete application will be automatically accepted and sorted into the best-fit session. Would you like to proceed?');

      if(r === true){
        AutomateService.autoAcceptAllStudents().then(function(res){
          alert('Auto acceptance of students has completed.');
          $state.reload();
        });
      }
    };

    $scope.automatchallsessions = function() {

      var r = confirm('This action will automatically match each active student to the mentor that best suits him/her. Would you like to proceed?');

      if(r === true){
        var sessionNum = 2;
        console.log("A");
         var p1 = Promise.resolve(AutomateService.autoMatch("1"));
         var p2 = Promise.resolve(AutomateService.autoMatch("2"));
         var p3 = Promise.resolve(AutomateService.autoMatch("3"));

         Promise.all([p1, p2, p3]).then(function([p1, p2, p3]){
           alert('Auto match of students has completed.');
           $state.reload();
         });
      }
    };

  $scope.listAllVolunteers = function () {
    VolunteersService.getAllWithDeactivated()
      .then(function (response) {
        $scope.all_volunteers = response.data;
        console.log("All volunteers:", response.data);
      }, function (error) {

        $scope.error = "Unable to retrieve volunteers! \n" + error;
      });
  };

  $scope.listMentors = function () {
    VolunteersService.getMentors()
      .then(function (response) {
        $scope.mentor_volunteers = response.data;
      }, function(error){
        $scope.error = "Unable to retrieve volunteers with mentor role! \n" + error;
      });
  };



  $scope.listDeactivatedVolunteers = function () {
    VolunteersService.getDeactivated()
      .then(function (response) {
        $scope.deactivated_volunteers = response.data;
        console.log("Deactivated volunteers:", response.data);
      }, function (error) {

        $scope.error = "Unable to retrieve volunteers! \n" + error;
      });
  };

  $scope.listDeactivatedStudents = function () {
    console.log("entered Deactivated Students list");
    StudentService.listDeactivated().then(function(response){
      console.log("entered here");
        $scope.deactivated_students = response.data;
        console.log("Deactivated students:", response.data);
      }, function(error){

        $scope.error = "Unable to retrieve students! \n" + error;
      });
  };

  $scope.deactivateVolunteer = function (id) {
    console.log("id to read: ", id);
    var s_ids = [];
    new Promise(function (resolve, reject) {

      VolunteersService.read(id).then(function (response){
        var volunteer = response.data;
        console.log("response data", response.data);

        var r = confirm('You are about to deactivate '+volunteer.application.name+'. Would you like to proceed?');
        console.log("r: ",r);
        if(r === false){
          reject(volunteer);
        }

        resolve(volunteer);
      });
      //$scope.getVolunteer(id);
      //resolve($scope.volunteer);
    }).then(function(volunteer){
      s_ids = volunteer.intervieweeID;
      console.log("s_ids:",s_ids );
      return new Promise(function(resolve,reject){
        if(volunteer.mentee.length > 0){
          var count_unmatches = 0;
          console.log("in mentee section");
          console.log("menteeID: ",volunteer.menteeID);
          volunteer.menteeID.forEach(function(s_id){
            console.log("s_id",s_id);
            StudentService.read(s_id).then(function (response){
              var s = response.data;
              console.log("in here, response data: ",response.data);

                AutomateService.manUnmatch(s.user, s.mentorID).then(function(response){
                  count_unmatches = count_unmatches + 1;
                  console.log("we make it in here");
                  console.log(response);

                  if(count_unmatches === volunteer.menteeID.length){
                    console.log("Unmatched all mentees from volunteer");
                    resolve(volunteer);
                  }
                });
              });
            });
        }
        else{
          console.log("made it here1");
          resolve(volunteer);
        }
      });
    }, function(rejection){
      return;
    }).then(function (volunteer) {
      volunteer.active = false;
      volunteer.interviewee = [];
      volunteer.intervieweeID = [];
      volunteer.interviewee_count = 0;
      volunteer.mentee = [];
      volunteer.menteeID = [];
      volunteer.mentee_count_sess_1 = 0;
      volunteer.mentee_count_sess_2 = 0;
      volunteer.mentee_count_sess_3 = 0;

      console.log("new volunteer: ", volunteer);

      return volunteer;
      }).then(function (volunteer) {
        return new Promise(function(resolve, reject){

          VolunteersService.update(volunteer, volunteer.user).then(function (response) {
            console.log("volunteer was successfully deactivated", response.data);
            $scope.getVolunteer(id);
            console.log(volunteer.active);
            resolve(response.data);
          }, function (err) {
            if (err) throw err;
          });

        });
    }).then(function(volunteer){
      var ind = 0;
      return new Promise(function(resolve, reject){
        if(s_ids.length > 0){
            for(var ind = 0; ind < s_ids.length; ind++ ){
              console.log("ind: ",ind);
              console.log(s_ids[ind]);
              StudentService.read(s_ids[ind]).then(function(response){
                console.log(response.data);
                var s = response.data;

                for(var i=0; i<s.interviewerID.length; i++){
                  if(s.interviewerID[i].toString() === volunteer.user.toString()){
                    s.indivRanks[i] = 'Not Ranked';
                    s.interviewerID.splice(i, 1);
                    s.interviewer.splice(i, 1);

                    StudentService.update(s, s.user).then(function(stu){
                        if(ind === s_ids.length){
                          console.log("RESOLVE TIME");
                          resolve(volunteer);
                        }

                    });

                  }
                }
              });
            }
        }
        else{
          resolve(volunteer);
        }
      });
    }).then(function(volunteer){
      alert('Deactivation of '+volunteer.application.name+' complete.');
      $window.onload($window.location.reload());
    });
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
  }

  $scope.activateVolunteer = function (id) {
    new Promise(function (resolve, reject) {
      VolunteersService.read(id).then(function (response){
        var volunteer = response.data;
        console.log("response data", response.data);

        var r = confirm('You are about to activate '+volunteer.application.name+'. Would you like to proceed?');

        if(r === false){
          reject(volunteer);
        }

        resolve(volunteer);
      });
    }).then(function (volunteer) {
      // volunteer.active = true;
      return volunteer;
    }, function(rejection){
      return;
    }).then(function (volunteer) {
      VolunteersService.update(volunteer, volunteer.user).then(function (response) {
        console.log("volunteer was successfully activated", response.data);
        $scope.getVolunteer(id);
        console.log(volunteer.active);
        alert('Activation of '+volunteer.application.name+' complete.');
        $state.reload();
      }, function (err) {
        if (err) throw err;
      }
      );
      return;
    });
  };


$scope.deactivateStudent = function (id) {
  console.log("id to read: ", id);
  var student;

  new Promise(function (resolve, reject) {
    console.log($scope.volunteer);

    StudentService.read(id).then(function (response){
      console.log("in here, response data: ",response.data);
      student = response.data;

      var r = confirm('You are about to deactivate '+student.application.name+'. Would you like to proceed?');

      if(r === false){
        reject(student);
      }
      student.active = false;

      console.log("student object: ",student);
      if(student.mentor !== ""){
        AutomateService.manUnmatch(id, response.data.mentorID).then(function(response1){

          console.log("we make it in here");
          console.log("unmatch response: ",response);

          VolunteersService.update(response1.data, student.mentorID).then(function(fresponse){
            console.log("updated volunteer: ", fresponse.data);
            resolve(student);
          });
        });
      }
      else resolve(student);
    });
    //$scope.getVolunteer(id);
    //resolve($scope.volunteer);
  }).then(function(student){
    return new Promise(function(resolve, reject){
      student.active = false;
      student.timeSlot = [];
      student.interviewRank = [];
      student.mentor = "";
      student.mentorID = "";
      student.indivRanks = ['Not Ranked', 'Not Ranked', 'Not Ranked'];

      resolve(student);
    });
  }, function(rejection){
    return;
  }).then(function(student){
    console.log("student: ",student);

    if(student.interviewerID.length > 0 || student.interviewer.length > 0){
      console.log("and here we are again");
      console.log("student user id: ",student.user._id);
      console.log("student.user: ",student.user);
    AutomateService.manUnassignInterview(student.user).then(function(response){
      console.log("unassigning interview");

      student.interviewerID = [];
      student.interviewer = [];

      StudentService.update(student, student.user).then(function (response) {
        console.log("student was successfully deactivated", response.data);
        console.log(response.data.active);

        if(response.data.active === false) {
          alert('Deactivation of '+response.data.application.name+' complete.');
          $window.location.reload();
        }
      }, function (err) {
        if (err) throw err;
      });
    });
  }
  else{
    // found this while working on email buttons, I believe the line should be: StudentService.update(student.user, student)
    StudentService.update(student, student.user).then(function (response) {
      console.log("student was successfully deactivated", response.data);
      console.log(response.data.active);

      if(response.data.active === false) {
        alert('Deactivation of '+response.data.application.name+' complete.');
        $window.location.reload();
      }
    }, function (err) {
      if (err) throw err;
    });
  }

  });
};

$scope.activateStudent = function (id) {
  console.log("id to read: ", id);
  new Promise(function (resolve, reject) {
    console.log($scope.volunteer);

    StudentService.read(id).then(function (response){
      var student = response.data;

      var r = confirm('You are about to activate '+student.application.name+'. Would you like to proceed?');

      if(r === false){
        reject(student);
      }

      student.active = true;
      console.log("response data", response.data);

      resolve(student);
    });
    //$scope.getVolunteer(id);
    //resolve($scope.volunteer);
  }).then(function (student) {
    return new Promise(function(resolve, reject){
      console.log("active: ",student.active);

        StudentService.update(student, student.user).then(function (response) {
          console.log("student was successfully activated", response.data);
          console.log(response.data.active);

          resolve(response.data);
        }, function (err) {
          if (err) throw err;
        });
    });
  }, function(rejection){
    return;
  }).then(function(response){
    if(response.active === true) {
      alert('Activation of '+response.application.name+' complete.');
      $window.location.reload();
    }
  });
};
};


}());

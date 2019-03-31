 (function() {
  'use strict';

  // Students controller
  angular
    .module('users')
    .controller('StudentFormsController', StudentFormsController)

  StudentFormsController.$inject = ['$scope', '$state', '$window', 'FileService', 'GoogleCloudService', 'StudentService', 'Authentication', 'Notification', '$http','$sce'];

  function StudentFormsController($scope, $state, $window, FileService, GoogleCloudService, StudentService, Authentication, Notification, $http, $sce) {
    var vm = this;
    vm.student;
    vm.credentials;
    vm.authentication = Authentication;
    vm.createStudent = createStudent;
    vm.updateStudent = updateStudent;

    vm.uploadNDA = uploadNDA;
    vm.uploadWaiver = uploadWaiver;
    vm.uploadLetterOfRecommendation = uploadLetterOfRecommendation;
    vm.uploadResume = uploadResume;

    vm.viewForm = viewForm;
    vm.approveNDA = approveNDA;
    vm.approveWaiver = approveWaiver;
    vm.approveLetterOfRecommendation = approveLetterOfRecommendation;
    vm.approveResume = approveResume;

    $scope.fileNameChangedNDA = fileNameChangedNDA;
    $scope.fileNameChangedWaiver = fileNameChangedWaiver;
    $scope.fileNameChangedLOR = fileNameChangedLOR;
    $scope.fileNameChangedResume = fileNameChangedResume;

    StudentService.getStudentByUsername(vm.authentication.user.username).then(function(data){
      $scope.vm.file = {};
      if(data.message === undefined){
        $scope.vm.credentials = data;
        $scope.vm.submitIsUpdate = true;
      }
      else{
        $scope.vm.credentials = {};
        $scope.vm.credentials.application = {};
        $scope.vm.submitIsUpdate = true;
      }
    });

    function fileNameChangedNDA(){
      var file = document.getElementById('nda_upload').files[0];
      vm.selectedStudentNDA = file.name;
    }

    function fileNameChangedWaiver(){
      var file = document.getElementById('waiver_upload').files[0];
      vm.selectedStudentWaiver = file.name;
    }

    function fileNameChangedLOR(){
      var file = document.getElementById('lor_upload').files[0];
      vm.selectedStudentLOR = file.name;
    }

    function fileNameChangedResume(){
      var file = document.getElementById('resume_upload').files[0];
      vm.selectedStudentResume = file.name;
    }
    // APPROVE NDA
    function approveNDA(student){
	  if(student.isNDASubmitted == true){
		  student.isNDASubmitted = false; 
		  student.areFormsStudentApproved = false;
	  }
	  else{
		  student.isNDASubmitted = true;
		  if(student.isWaiverSubmitted && student.isLetterofRecommendationSubmitted && student.isResumeSubmitted){
			student.areFormsStudentApproved = true; 
		}		
	  }
      StudentService.updateStudent(student.user, student)
        .then(onFormApprovalSuccess)
        .catch(onFormApprovalError);

    }
    // APPROVE WAIVER
    function approveWaiver(student){
	  if(student.isWaiverSubmitted == true){
		  student.isWaiverSubmitted = false;
		  student.areFormsStudentApproved = false; //tell system forms are not correct
	  }
	  else{
		  student.isWaiverSubmitted = true
		  if(student.isNDASubmitted && student.isLetterofRecommendationSubmitted && student.isResumeSubmitted){
			student.areFormsStudentApproved = true; 
		}
	  }
      StudentService.updateStudent(student.user, student)
        .then(onFormApprovalSuccess)
        .catch(onFormApprovalError);
    }
	// APPROVE LETTER
    function approveLetterOfRecommendation(student){
	  if(student.isLetterofRecommendationSubmitted == true){
		  student.isLetterofRecommendationSubmitted = false;
		  student.areFormsStudentApproved = false; // make sure system knows all the forms aren't good
	  }
      else{
		  student.isLetterofRecommendationSubmitted = true; 
   		  if(student.isNDASubmitted && student.isWaiverSubmitted && student.isResumeSubmitted){
			student.areFormsStudentApproved = true; 
		}		  
	  }
      StudentService.updateStudent(student.user, student)
        .then(onFormApprovalSuccess)
        .catch(onFormApprovalError);
    }
	// APPROVE RESUME
    function approveResume(student){
	  if(student.isResumeSubmitted == true){
		 student.isResumeSubmitted = false; 
		 student.areFormsStudentApproved = false;
      }	
	  else{
		student.isResumeSubmitted = true;  
		if(student.isNDASubmitted && student.isWaiverSubmitted && student.isLetterofRecommendationSubmitted){
			student.areFormsStudentApproved = true; 
		}
	  }
      StudentService.updateStudent(student.user, student)
           .then(onFormApprovalSuccess)
           .catch(onFormApprovalError);
	}


    function uploadNDA(file){
      if(file === null || file===undefined){
        Notification.error({ message: 'Please Submit Correct NDA File Type (PDF, Docx, etc.)', title: '<i class="glyphicon glyphicon-remove"></i> View error.', delay: 6000 });
        return;
      }
      vm.credentials.NDAId = `NDA_${vm.credentials.username}.pdf`;
	  vm.credentials.isNDAUploaded = true; 
      $scope.uploading = true;
      FileService.upload($scope.file, vm.credentials.NDAId).then(function(data){
        if(data.data.success){
          $scope.uploading = false;
          vm.selectedStudentNDA = '';

          uploadToGoogleCloud(vm.credentials.NDAId);
        }
      });
    }

    function uploadWaiver(file){
      if(file === null || file===undefined){
        Notification.error({ message: 'Please Submit Correct Waiver File Type (PDF, Docx, etc.)', title: '<i class="glyphicon glyphicon-remove"></i> View error.', delay: 6000 });
        return;
      }
	  vm.credentials.isWaiverUploaded = true; 
      vm.credentials.WaiverId = `waiver_${vm.credentials.username}.pdf`;

      $scope.uploading = true;
      FileService.upload($scope.file, vm.credentials.WaiverId).then(function(data){
        if(data.data.success){
          $scope.uploading = false;
          vm.selectedStudentWaiver = '';

          uploadToGoogleCloud(vm.credentials.WaiverId);
        }
      });
    }

    function uploadLetterOfRecommendation(file){
      if(file === null || file===undefined){
        Notification.error({ message: 'Please Submit Correct Letter of Rec File Type (PDF, Docx, etc.)', title: '<i class="glyphicon glyphicon-remove"></i> View error.', delay: 6000 });
        return;
      }
      vm.credentials.letterOfRecommendationId =`letterOfRecommendation_${vm.credentials.username}.pdf`;
	  vm.credentials.isLetterofRecommendationUploaded = true;
      $scope.uploading = true;
      FileService.upload($scope.file, vm.credentials.letterOfRecommendationId).then(function(data){
        if(data.data.success){
          $scope.uploading = false;
          vm.selectedStudentLOR = '';

          uploadToGoogleCloud(vm.credentials.letterOfRecommendationId);
        }
      });
    }

    function uploadResume(file){
      if(file === null || file===undefined){
        Notification.error({ message: 'Please Submit Correct Resume File Type (PDF, Docx, etc.)', title: '<i class="glyphicon glyphicon-remove"></i> View error.', delay: 6000 });
        return;
      }
	  vm.credentials.isResumeUploaded = true;
      vm.credentials.ResumeId = `resume_${vm.credentials.username}.pdf`;
      $scope.uploading = true;
	  //vm.credentials.isResumeSubmitted = true;

      FileService.upload($scope.file, vm.credentials.ResumeId).then(function(data){
        if(data.data.success){
          $scope.uploading = false;
          vm.selectedStudentResume = '';

          uploadToGoogleCloud(vm.credentials.ResumeId);
        }
      });
    }

    async function uploadToGoogleCloud(fileId){
      console.log('in google cloud land');
      console.log(fileId);

      StudentService.updateStudent(vm.credentials.user, vm.credentials)
        .then(onFormSubmissionSuccess)
        .catch(onFormSubmissionError);

        GoogleCloudService.uploadForm({name: fileId});

    }

    function viewForm(fileId) {
      console.log(fileId);
      if(fileId === null || fileId === "" || fileId===undefined){
        Notification.error({ message: 'This form has not yet been submitted.', title: '<i class="glyphicon glyphicon-remove"></i> View error.', delay: 6000 });
        return;
      }
      else{
        viewForm_downloadFromGCS(fileId);
      }
    }

    async function viewForm_downloadFromGCS(fileId){
      GoogleCloudService.downloadForm(fileId)
        .then(function(response){
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
        })
        .error(function(response){
          Notification.error({ message: 'There was an error retrieving this form. Please try submitting again.', title: '<i class="glyphicon glyphicon-remove"></i> View error.', delay: 6000 });
        });
    }

    function dataURItoBlob(dataURI) {

	// convert base64/URLEncoded data component to raw binary data held in a string
	 var byteString;
	  if (dataURI.split(',')[0].indexOf('base64') >= 0) byteString = atob(dataURI.split(',')[1]);
	   else byteString = unescape(dataURI.split(',')[1]);

	// separate out the mime component
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

	// write the bytes of the string to a typed array
	var ia = new Uint8Array(byteString.length);
	for (var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}

	return new Blob([ia], {type:mimeString});
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

    function onFormSubmissionSuccess(response) {
      // If successful we assign the response to the global user model
      vm.authentication.student = response;
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Form submission successful!.' });
      // And redirect to the previous or home page
      //$state.go($state.previous.state.name || 'home', $state.previous.params);
    }

    function onFormSubmissionError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Form submission error.', delay: 6000 });
    }

    function onFormApprovalSuccess(response) {
      // If successful we assign the response to the global user model
      vm.authentication.student = response;
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Form Updated!' });
      // And redirect to the previous or home page
      //$state.go($state.previous.state.name || 'home', $state.previous.params);
    }

    function onFormApprovalError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Form approval error.', delay: 6000 });
    }
}

}());

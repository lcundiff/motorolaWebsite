 (function() {
  'use strict';

  // Students controller
  angular
    .module('users')
    .controller('StudentFormsController', StudentFormsController)

  StudentFormsController.$inject = ['$scope', '$state', '$window', 'FileService', 'GoogleCloudService', 'StudentService', 'Authentication', 'Notification', '$http','$sce'];

  function StudentFormsController($scope, $state, $window, FileService, GoogleCloudService, StudentService, Authentication, Notification, $http, $sce) {
    var vm = this;
    vm.loading = false;
    vm.student;
    vm.credentials;
    vm.authentication = Authentication;

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
    if(!student.NDAId){
      Notification.error({ message: 'Please submit an NDA before approving.', title: '<i class="glyphicon glyphicon-remove"></i> View error.', delay: 6000 });
      return;
    }

    vm.loading = true;
	  if(student.isNDASubmitted){
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
      if(!student.WaiverId){
        Notification.error({ message: 'Please submit a waiver before approving.', title: '<i class="glyphicon glyphicon-remove"></i> View error.', delay: 6000 });
        return;
      }

      vm.loading = true;
	  if(student.isWaiverSubmitted){
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
      if(!student.letterOfRecommendationId){
        Notification.error({ message: 'Please submit a letter of recommendation before approving.', title: '<i class="glyphicon glyphicon-remove"></i> View error.', delay: 6000 });
        return;
      }

      vm.loading = true;
	  if(student.isLetterofRecommendationSubmitted){
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
      if(!student.ResumeId){
        Notification.error({ message: 'Please submit a resume before approving.', title: '<i class="glyphicon glyphicon-remove"></i> View error.', delay: 6000 });
        return;
      }

      vm.loading = true;
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
      vm.loading = true;

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
      vm.loading = true;

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
      vm.loading = true;

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
      if(!file){
        Notification.error({ message: 'Please Submit Correct Resume File Type (PDF, Docx, etc.)', title: '<i class="glyphicon glyphicon-remove"></i> View error.', delay: 6000 });
        return;
      }
      vm.loading = true;
      $scope.uploading = true;


	  vm.credentials.isResumeUploaded = true;
      vm.credentials.ResumeId = `resume_${vm.credentials.username}.pdf`;
	  //vm.credentials.isResumeSubmitted = true;

      FileService.upload($scope.file, vm.credentials.ResumeId).then(function(data){
        if(data.data.success){
          $scope.uploading = false;
          vm.selectedStudentResume = '';

          uploadToGoogleCloud(vm.credentials.ResumeId);
        }
      });
    }

    function uploadToGoogleCloud(fileId){
      console.log('in google cloud land');
      console.log(fileId);

      StudentService.updateStudent(vm.credentials.user, vm.credentials)
      .then(function(response){
        GoogleCloudService.uploadForm({name: fileId})
        .then(onFormSubmissionSuccess)
        .catch(onFormSubmissionError);
      })
      .catch(onFormSubmissionError);
    }

    function viewForm(fileId) {
      console.log(fileId);
      if(!fileId){
        Notification.error({ message: 'This form has not yet been submitted.', title: '<i class="glyphicon glyphicon-remove"></i> View error.', delay: 6000 });
        return;
      }
      else{
        vm.loading = true;
        viewForm_downloadFromGCS(fileId);
      }
    }

    function viewForm_downloadFromGCS(fileId) {
      if(fileId === null || fileId === '' || fileId === undefined){
        Notification.error({ message: 'Student has not yet uploaded this form.', title: '<i class="glyphicon glyphicon-remove"></i> Error', delay: 6000 });
        return;
      }

      vm.loading = true;

      GoogleCloudService.downloadForm(fileId)
      .then(function(response){
        console.log('google cloud download: ',response);
        FileService.download(fileId)
        .then(function(data){
          var file = new Blob([data.data], {
              type: 'application/pdf'
            });
              $scope.fileUrl = $sce.trustAsResourceUrl(URL.createObjectURL(file));
              var link = document.createElement('a');
                  link.href = $scope.fileUrl;
                  link.download = fileId;
                  link.click();
                  vm.loading = false;
        })
        .catch(function(data){
          vm.loading = false;
          Notification.error({ message: 'There was an error downloading this form. Please try again in a few minutes.', title: '<i class="glyphicon glyphicon-remove"></i> Error', delay: 6000 });

        })
      })
      .catch(onErrorGoogleCloudDownload);
    }

    function onErrorGoogleCloudDownload(){
      vm.loading = false;
      Notification.error({ message: 'There was an error downloading this document. Please try again in a few minutes.', title: '<i class="glyphicon glyphicon-remove"></i> Error', delay: 6000 });
    }

    function onFormSubmissionSuccess(response) {
      // If successful we assign the response to the global user model
      vm.authentication.student = response;
      vm.loading = false;
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Form submission successful!.' });
      // And redirect to the previous or home page
      //$state.go($state.previous.state.name || 'home', $state.previous.params);
    }

    function onFormSubmissionError(response) {
      vm.loading = false;
      Notification.error({ message: 'There was an error downloading this document. Please try again in a few minutes.', title: '<i class="glyphicon glyphicon-remove"></i> Error.', delay: 6000 });
    }

    function onFormApprovalSuccess(response) {
      // If successful we assign the response to the global user model
      vm.authentication.student = response;
      vm.loading = false;
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Form Updated!' });
      // And redirect to the previous or home page
      //$state.go($state.previous.state.name || 'home', $state.previous.params);
    }

    function onFormApprovalError(response) {
      vm.loading = false;
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Form approval error.', delay: 6000 });
    }
}

}());

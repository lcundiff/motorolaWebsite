 (function() {
  'use strict';

  // Students controller
  angular
    .module('users')
    .controller('StudentFormsController', StudentFormsController)

  StudentFormsController.$inject = ['$scope', '$state', '$window', 'GoogleCloudService', 'FileService','StudentService', 'Authentication', 'Notification', '$http','$sce'];

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

    function approveNDA(student){
      student.isNDASubmitted = true;

      StudentService.updateStudent(student.user, student)
        .then(onFormApprovalSuccess)
        .catch(onFormApprovalError);

    }

    function approveWaiver(student){
      student.isWaiverSubmitted = true;

      StudentService.updateStudent(student.user, student)
        .then(onFormApprovalSuccess)
        .catch(onFormApprovalError);
    }

    function approveLetterOfRecommendation(student){
      student.isLetterofRecommendationSubmitted = true;

      StudentService.updateStudent(student.user, student)
        .then(onFormApprovalSuccess)
        .catch(onFormApprovalError);
    }

    function approveResume(student){
      student.isResumeSubmitted = true;

      StudentService.updateStudent(student.user, student)
        .then(onFormApprovalSuccess)
        .catch(onFormApprovalError);
    }

    function uploadNDA(){
      vm.credentials.NDAId = `NDA_${vm.credentials.username}.pdf`;

      $scope.uploading = true;
      FileService.upload($scope.file, vm.credentials.NDAId).then(function(data){
        if(data.upload){
          $scope.uploading = false;
          vm.selectedStudentNDA = '';

          uploadToGoogleCloud(vm.credentials.NDAId);
        }
      });
    }

    function uploadWaiver(){
      vm.credentials.WaiverId = `waiver_${vm.credentials.username}.pdf`;

      $scope.uploading = true;
      FileService.upload($scope.file, vm.credentials.WaiverId).then(function(data){
        if(data.upload){
          $scope.uploading = false;
          vm.selectedStudentWaiver = '';

          uploadToGoogleCloud(vm.credentials.WaiverId);
        }
      });
    }

    function uploadLetterOfRecommendation(){
      vm.credentials.letterOfRecommendationId = `letterOfRecommendation_${vm.credentials.username}.pdf`;

      $scope.uploading = true;
      FileService.upload($scope.file, vm.credentials.letterOfRecommendationId).then(function(data){
        if(data.upload){
          $scope.uploading = false;
          vm.selectedStudentLOR = '';

          uploadToGoogleCloud(vm.credentials.letterOfRecommendationId);
        }
      });
    }

    function uploadResume(){
      vm.credentials.ResumeId = `resume_${vm.credentials.username}.pdf`;
      $scope.uploading = true;

      FileService.upload($scope.file, vm.credentials.ResumeId).then(function(data){
        console.log(data);
        if(data.upload){
          $scope.uploading = false;
          vm.selectedStudentResume = '';

          uploadToGoogleCloud(vm.credentials.ResumeId);
        }
      });
    }

    async function uploadToGoogleCloud(fileId){
      console.log('in google cloud land');
      console.log(fileId);
      //GoogleCloudService.upload({name: fileId});

      StudentService.updateStudent(vm.credentials.user, vm.credentials)
        .then(onFormSubmissionSuccess)
        .catch(onFormSubmissionError);

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
      GoogleCloudService.download(fileId)
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
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Form submission successful.' });
      // And redirect to the previous or home page
      //$state.go($state.previous.state.name || 'home', $state.previous.params);
    }

    function onFormSubmissionError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Form submission error.', delay: 6000 });
    }

    function onFormApprovalSuccess(response) {
      // If successful we assign the response to the global user model
      vm.authentication.student = response;
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Form approval successful.' });
      // And redirect to the previous or home page
      //$state.go($state.previous.state.name || 'home', $state.previous.params);
    }

    function onFormApprovalError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Form approval error.', delay: 6000 });
    }
}

}());

 (function() {
  'use strict';

  // Students controller
  angular
    .module('users')
    .controller('StudentFormsController', StudentFormsController)

  StudentFormsController.$inject = ['$scope', '$state', '$window', 'FileService','StudentService', 'Authentication', 'Notification', '$http','$sce'];

  function StudentFormsController($scope, $state, $window, FileService, StudentService, Authentication, Notification, $http, $sce) {
    var vm = this;
    vm.student;
    vm.credentials;
    vm.authentication = Authentication;
    vm.createStudent = createStudent;
    vm.updateStudent = updateStudent;
    vm.showImage = showImage;

    vm.uploadNDA = uploadNDA;
    vm.uploadWaiver = uploadWaiver;
    vm.uploadLetterOfRecommendation = uploadLetterOfRecommendation;
    vm.uploadResume = uploadResume;

    vm.viewForm = viewForm;
    vm.approveNDA = approveNDA;
    vm.approveWaiver = approveWaiver;
    vm.approveLetterOfRecommendation = approveLetterOfRecommendation;
    vm.approveResume = approveResume;

    StudentService.getStudentByUsername(vm.authentication.user.username).then(function(data){
      $scope.vm.file = {};
      if(data.message === undefined){
        $scope.vm.credentials = data;
        $scope.vm.submitIsUpdate = true;
        console.log("userid check: ",$scope.vm.credentials);
      }
      else{
        $scope.vm.credentials = {};
        $scope.vm.credentials.application = {};
        $scope.vm.submitIsUpdate = true;
      }
    });
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
      console.log($scope.file.upload);
      vm.credentials.NDAId = "NDA" + "_" + vm.credentials.username;

      $scope.uploading = true;
      FileService.upload($scope.file, vm.credentials.NDAId).then(function(data){
        console.log(data);
        if(data.data.success){
          $scope.uploading = false;
        }
      });

      StudentService.updateStudent(vm.credentials.user, vm.credentials)
        .then(onFormSubmissionSuccess)
        .catch(onFormSubmissionError);
    }

    function uploadWaiver(){
      console.log($scope.file.upload);
      vm.credentials.WaiverId = "waiver" + "_" + vm.credentials.username;

      $scope.uploading = true;
      FileService.upload($scope.file, vm.credentials.WaiverId).then(function(data){
        console.log(data);
        if(data.data.success){
          $scope.uploading = false;
        }
      });

      StudentService.updateStudent(vm.credentials.user, vm.credentials)
        .then(onFormSubmissionSuccess)
        .catch(onFormSubmissionError);
    }

    function uploadLetterOfRecommendation(){
      console.log($scope.file.upload);
      vm.credentials.letterOfRecommendationId = "letterOfRecommendation" + "_" + vm.credentials.username;

      $scope.uploading = true;
      FileService.upload($scope.file, vm.credentials.letterOfRecommendationId).then(function(data){
        console.log(data);
        if(data.data.success){
          $scope.uploading = false;
        }
      });

      StudentService.updateStudent(vm.credentials.user, vm.credentials)
        .then(onFormSubmissionSuccess)
        .catch(onFormSubmissionError);
    }

    function uploadResume(){
      console.log($scope.file.upload);
      vm.credentials.ResumeId = "Resume" + "_" + vm.credentials.username;

      $scope.uploading = true;
      FileService.upload($scope.file, vm.credentials.ResumeId).then(function(data){
        console.log(data);
        if(data.data.success){
          $scope.uploading = false;
        }
      });

      StudentService.updateStudent(vm.credentials.user, vm.credentials)
        .then(onFormSubmissionSuccess)
        .catch(onFormSubmissionError);
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

function showImage() {
  console.log("$scope.file: ",$scope.file);

    $scope.extensao = '';
	var imagem = $scope.file.upload.type;

    if (imagem.indexOf('image/jpeg') > 0) {
        $scope.type = 'image/jpeg';
        $scope.extensao = '.jpg';
    } else
        if (imagem.indexOf('image/png') > 0) {
            $scope.type = 'image/png';
            $scope.extensao = '.png';
        } else
            if (imagem.indexOf('application/pdf') > 0) {
                $scope.type = 'application/pdf';
                $scope.extensao = '.pdf';
            } else
                if (imagem.indexOf('application/msword') > 0) {
                    $scope.type = 'application/msword';
                    $scope.extensao = '.doc';
                } else {
                        $scope.type = 'application/octet-stream';
                        $scope.extensao = '.docx';
                    }

    var decodedImage = dataURItoBlob(imagem);
    var blob = new Blob([decodedImage], { type: $scope.type });
    var fileURL = URL.createObjectURL(blob);
    $scope.pdfContent = $sce.trustAsResourceUrl(fileURL);

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

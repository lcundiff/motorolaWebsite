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
    vm.uploadFile = uploadFile;
    vm.showImage = showImage;

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

    function uploadFile(){

      $scope.uploading = true;
      FileService.upload($scope.file).then(function(data){
        console.log(data);
        if(data.data.success){
          $scope.uploading = false;
        }
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
}

}());

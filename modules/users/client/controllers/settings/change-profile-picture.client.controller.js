(function () {
  'use strict';

  angular
    .module('users')
    .controller('ChangeProfilePictureController', ChangeProfilePictureController);

  ChangeProfilePictureController.$inject = ['$timeout', 'StudentService', 'Authentication', 'Upload', 'Notification'];

  function ChangeProfilePictureController($timeout, StudentService, Authentication, Upload, Notification) {
    var vm = this;

    vm.user = Authentication.user;
    vm.progress = 0;

    vm.upload = function (dataUrl) {
		console.log("user profile", vm.user);
      Upload.upload({
        url: '/api/users/picture',
        data: {
          newProfilePicture: dataUrl
        }
      }).then(function (response) {
        $timeout(function () {
          onSuccessItem(response.data);
        });
      }, function (response) {
        if (response.status > 0) onErrorItem(response.data);
      }, function (evt) {
        vm.progress = parseInt(100.0 * evt.loaded / evt.total, 10);
      });
	  
    };

    // Called after the user has successfully uploaded a new picture
    function onSuccessItem(response) {
      // Show success message
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Successfully changed profile picture' });

      // Populate user object
      vm.user = Authentication.user = response;
	  StudentService.getStudentByUsername(vm.user.username)
	  	.then(getStudentSuccess)
	  	.catch(getStudentFailure);
      // Reset form
      vm.fileSelected = false;
      vm.progress = 0;
    }
	function getStudentSuccess(response) { 
	  console.log("resp: ", 	response);
	  console.log("URL profile: ", vm.user.profileImageURL);
	  response.profileImageURL = vm.user.profileImageURL; 
	  StudentService.updateStudent(response.user,response)
	  	.then(updateStudentSuccess)
	  	.catch(getStudentFailure);	  
	}
	function updateStudentSuccess(response) {
		console.log("student has been updated: ", response)
	}
    function getStudentFailure(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Student retrieval failed!' });
    }
    // Called after the user has failed to upload a new picture
    function onErrorItem(response) {
      vm.fileSelected = false;
      vm.progress = 0;

      // Show error message
      Notification.error({ message: response.message, title: '<i class="glyphicon glyphicon-remove"></i> Failed to change profile picture' });
    }
  }
}());

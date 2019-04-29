(function () {
  'use strict';

  angular
    .module('users')
    .controller('SignupController', SignupController);

SignupController.$inject = ['$scope', '$stateParams', 'UsersService', '$location', 'Authentication', 'PasswordValidator', 'Notification'];

  function SignupController($scope, $stateParams, UsersService, $location, Authentication, PasswordValidator, Notification) {
    var vm = this;

    //vm. = resetUserPassword;
    //vm.askForPasswordReset = askForPasswordReset;
    vm.askForSignup = askForSignup;
    vm.authentication = Authentication;
    //vm.getPopoverMsg = PasswordValidator.getPopoverMsg;

    // If user is signed in then redirect back home
    if (vm.authentication.user) {
      $location.path('/');
    }

    // Submit forgotten password account id
    function askForSignup(isValid) {

      if (!isValid) {
        //$scope.$broadcast('show-errors-check-validity', 'vm.forgotPasswordForm');

        return false;
      }

      console.log("askForSignUp credentials: ", vm.credentials);

      UsersService.signupRequest(vm.credentials)
        .then(onRequestSignupSuccess)
        .catch(onRequestSignupError);
    }

    // Change user password
    function signupStu(isValid) {

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.resetPasswordForm');

        return false;
      }

      UsersService.userSignup($stateParams.token, vm.passwordDetails)
        .then(onSignupSuccess)
        .catch(onSignupError);
    }

    // Password Reset Callbacks

    function onRequestSignupSuccess(response) {
      // Show user success message and clear form
      vm.credentials = null;
      Notification.success({ message: response.message, title: '<i class="glyphicon glyphicon-ok"></i> Sign-up requested successfully.' });
    }

    function onRequestSignupError(response) {
      // Show user error message and clear form
      vm.credentials = null;
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Failed to request signup.', delay: 4000 });
    }

    function onSignupSuccess(response) {
      // If successful show success message and clear form
      vm.passwordDetails = null;

      // Attach user profile
      Authentication.user = response;
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Signup successful!' });
      // And redirect to the index page
      //$location.path('/signup/success');
    }

    function onSignupError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Signup failed.', delay: 4000 });
    }
  }
}());

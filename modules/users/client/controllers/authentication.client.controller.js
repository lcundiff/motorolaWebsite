(function () {
  'use strict';

  angular
    .module('users')
    .controller('AuthenticationController', AuthenticationController);

  AuthenticationController.$inject = ['$scope', '$state', 'UsersService', 'StudentService', 'VolunteerService', '$location', '$window', 'Authentication', 'PasswordValidator', 'Notification'];

  function AuthenticationController($scope, $state, UsersService, StudentService, VolunteerService, $location, $window, Authentication, PasswordValidator, Notification) {
    var vm = this;
    vm.appsClosed = false;
    vm.authentication = Authentication;
    vm.appsAreClosed = appsAreClosed;
    vm.appsAreClosed(); // run this on load to find if apps are closed  
    vm.getPopoverMsg = PasswordValidator.getPopoverMsg;
    vm.studentSignUp = studentSignUp;
    vm.signup = signup;
    vm.signin = signin;
    vm.callOauthProvider = callOauthProvider;
    vm.usernameRegex = /^(?=[\w.-]+$)(?!.*[._-]{2})(?!\.)(?!.*\.$).{3,34}$/;
    
    // Get an eventual error defined in the URL query string:
    if ($location.search().err) {
      Notification.error({ message: $location.search().err });
    }

    // If user is signed in then redirect back home
    if (vm.authentication.user) {
      $location.path('/');
    }
    // checks if apps are closed on backend (student controller)
    function appsAreClosed(){
      StudentService.checkAppsClosed().then(function(res){
        console.log("app status: " + res.appsClosed);
        vm.appsClosed = res.appsClosed;
        
      });
      console.log("apps closed boolean: " + vm.appsClosed);
    }
    
	  // volunteer sign up
    function signup(isValid) {
     // var hash = $location.path();
     // hash = hash.replace('/authentication/signup/', '');
     // var p1 = Promise.resolve(vm.credentials.userReqId = hash);
		vm.credentials.roles = ['volunteer'];
    //  Promise.all([p1]).then(function([p1]){
    	if (!isValid) {
       		$scope.$broadcast('show-errors-check-validity', 'vm.userForm');

       		return false;
		}
        //should this be volunteer sign up?
        UsersService.studentSignup(vm.credentials)
          .then(onUserSignupSuccess)
          .catch(onUserSignupError);
     // });
    }
    /*
    / @params 
    / @isValid comes from the angularjs invalid form attribute that checks for validity in the html form
    */
    function studentSignUp(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');

        return false;
      }

      vm.credentials.roles = ['student'];

      UsersService.studentSignup(vm.credentials)
      .then(onUserSignupSuccess)
      .catch(onUserSignupError);
    }
    /*
    / @params 
    / @isValid comes from the angularjs invalid form attribute that checks for validity in the html form
    */
    function signin(isValid) {

      if (!isValid) { // 
        $scope.$broadcast('show-errors-check-validity', 'vm.userForm');
        return false;
      }
      UsersService.userSignin(vm.credentials)
        .then(onUserSigninSuccess)
        .catch(onUserSigninError);
    }

    // OAuth provider request
    function callOauthProvider(url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    }

    // Authentication Callbacks

    function onUserSignupSuccess(response) {
      console.log("response authentication ", response)
      if(response.roles.indexOf('student') !== -1){

        var student = {};
        student.user = response._id;
        student.username = response.username;
        student.firstName = response.firstName;
        student.lastName = response.lastName;
        student.email = response.email;

        StudentService.createStudent(student);
		// If successful we assign the response to the global user model
        vm.authentication.user = response;
		$state.go('student.application', $state.previous.params);
      }
      if(response.roles.indexOf('volunteer') !== -1){

        var volunteer = {};
        volunteer.user = response._id;
        volunteer.username = response.username;
        volunteer.firstName = response.firstName;
        volunteer.lastName = response.lastname;
        volunteer.email = response.email;
        //SYD Is this necessary now that volunteers do not create their own volunteer
        VolunteerService.createVolunteer(volunteer);
		// If successful we assign the response to the global user model
        vm.authentication.user = response;	
		$state.go('volunteer.application', $state.previous.params);
      }
      Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Signup successful!' });
      // And redirect to the previous or home page
    }

    function onUserSignupError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Signup Error!', delay: 6000 });
    }

    function onUserSigninSuccess(response) {
      // If successful we assign the response to the global user model
      vm.authentication.user = response;
      Notification.info({ message: 'Welcome ' + response.firstName });
      // And redirect to the previous or home page
	  if(response.roles.indexOf('admin') !== -1){
		 $state.go('admin.dash', $state.previous.params); 
	  }
	  else if(response.roles.indexOf('student') !== -1){
		  $state.go('student.dash', $state.previous.params);

      }
      else if(response.roles.indexOf('volunteer') !== -1){
		  $state.go('volunteer.application', $state.previous.params);
      }
      else { 
      $state.go($state.previous.state.name || 'home', $state.previous.params);
	  }
    }

    function onUserSigninError(response) {
      Notification.error({ message: response.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Signin Error!', delay: 6000 });
    }
  }
}());

(function () {
  'use strict';

  // Setting up route
  angular
    .module('users.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    // Users state routing
    $stateProvider
      .state('settings', {
        abstract: true,
        url: '/settings',
        templateUrl: '/modules/users/client/views/settings/settings.client.view.html',
        controller: 'SettingsController',
        controllerAs: 'vm',
        data: {
          roles: ['student', 'volunteer', 'admin']
        }
      })
      .state('settings.profile', {
        url: '/profile',
        templateUrl: '/modules/users/client/views/settings/edit-profile.client.view.html',
        controller: 'EditProfileController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Settings'
        }
      })
      .state('settings.password', {
        url: '/password',
        templateUrl: '/modules/users/client/views/settings/change-password.client.view.html',
        controller: 'ChangePasswordController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Settings password'
        }
      })
      .state('settings.accounts', {
        url: '/accounts',
        templateUrl: '/modules/users/client/views/settings/manage-social-accounts.client.view.html',
        controller: 'SocialAccountsController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Settings accounts'
        }
      })
      .state('settings.picture', {
        url: '/picture',
        templateUrl: '/modules/users/client/views/settings/change-profile-picture.client.view.html',
        controller: 'ChangeProfilePictureController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Settings picture'
        }
      })
      .state('authentication', {
        abstract: true,
        url: '/authentication',
        templateUrl: '/modules/users/client/views/authentication/authentication.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm'
      })
      .state('authentication.signup-invalid', {
        url:'/signup/invalid',
        templateUrl: '/modules/users/client/views/authentication/signup-invalid.client.view.html',
        data: {
          pageTitle: 'Signup Link Invalid'
        }
      })
      .state('authentication.student-signup', {
        url: '/signup',
        templateUrl: '/modules/users/client/views/authentication/signup-student.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Signup'
        }
      })
      .state('authentication.volunteer-signup', {
        url: '/signup/vol',
        templateUrl: '/modules/users/client/views/authentication/signup-volunteer.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Signup'
        }
      })
      .state('authentication.signin', {
        url: '/signin?err',
        templateUrl: '/modules/users/client/views/authentication/signin.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Signin'
        }
      })
      .state('password', {
        abstract: true,
        url: '/password',
        template: '<ui-view/>'
      })
      .state('password.forgot', {
        url: '/forgot',
        templateUrl: '/modules/users/client/views/password/forgot-password.client.view.html',
        controller: 'PasswordController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Password forgot'
        }
      })
      .state('password.reset', {
        abstract: true,
        url: '/reset',
        template: '<ui-view/>'
      })
      .state('password.reset.invalid', {
        url: '/invalid',
        templateUrl: '/modules/users/client/views/password/reset-password-invalid.client.view.html',
        data: {
          pageTitle: 'Password reset invalid'
        }
      })
      .state('password.reset.success', {
        url: '/success',
        templateUrl: '/modules/users/client/views/password/reset-password-success.client.view.html',
        data: {
          pageTitle: 'Password reset success'
        }
      })
      .state('password.reset.form', {
        url: '/:token',
        templateUrl: '/modules/users/client/views/password/reset-password.client.view.html',
        controller: 'PasswordController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Password reset form'
        }
      })
      .state('signup', {
        abstract: true,
        url: '/signup',
        template: '<ui-view/>'
      })
      /*.state('signupstudent.form', {
        url: '/signup/student/:token',
        templateUrl: '/modules/users/client/views/authentication/signup-student.client.view.html',
        controller: 'AuthenticationController',
        controllerAs: 'vm'
      })*/
      .state('signup.request', {
        url: '/request_signup',
        templateUrl: '/modules/users/client/views/authentication/request-signup.client.view.html',
        controller: 'SignupController',
        controllerAs: 'vm'
      });
  }
}());

(function () {
  'use strict';

  // Users service used for communicating with the users REST endpoint
  angular
    .module('users.services')
    .factory('UsersService', UsersService);

  UsersService.$inject = ['$resource'];

  function UsersService($resource) {
    var Users = $resource('/api/users', {}, {
      update: {
        method: 'PUT'
      },
      updatePassword: {
        method: 'POST',
        url: '/api/users/password'
      },
      deleteProvider: {
        method: 'DELETE',
        url: '/api/users/accounts',
        params: {
          provider: '@provider'
        }
      },
      sendPasswordResetToken: {
        method: 'POST',
        url: '/api/auth/forgot'
      },
      resetPasswordWithToken: {
        method: 'POST',
        url: '/api/auth/reset/:token'
      },
      signup_Request: {
        method: 'POST',
        url: '/api/auth/signup-request'
      },
      send_signup_link: {
        method: 'POST',
        url: '/api/auth/sendSignup'
      },
      signup_admin: {
        method: 'POST',
        url: '/api/auth/signup_admin'
      },
      signup_student: {
        method: 'POST',
        url: '/api/auth/signup_student/:token'
      },
      signup_volunteer: {
        method: 'POST',
        url: '/api/auth/signup_volunteer'
      },
      signin: {
        method: 'POST',
        url: '/api/auth/signin'
      }
    });

    angular.extend(Users, {
      changePassword: function (passwordDetails) {
        return this.updatePassword(passwordDetails).$promise;
      },
      removeSocialAccount: function (provider) {
        return this.deleteProvider({
          provider: provider // api expects provider as a querystring parameter
        }).$promise;
      },
      requestPasswordReset: function (credentials) {
        return this.sendPasswordResetToken(credentials).$promise;
      },
      resetPassword: function (token, passwordDetails) {
        return this.resetPasswordWithToken({
          token: token // api expects token as a parameter (i.e. /:token)
        }, passwordDetails).$promise;
      },
      signupRequest: function(credentials){
        return this.signup_Request(credentials).$promise;
      },
      sendSignupLink: function(credentials){
        return this.send_signup_link(credentials).$promise;
      },
      userSignup: function (token, credentials) {
        return this.signup_student({
          token: token,
        }, credentials).$promise;
      },
      userSignin: function (credentials) {
        return this.signin(credentials).$promise;
      }
    });

    return Users;
  }

}());

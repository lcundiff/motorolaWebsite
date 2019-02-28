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
      send_form_fix_email: {
        method: 'POST',
        url: '/api/auth/sendFormFixEmail'
      },
      signup: {
        method: 'POST',
        url: '/api/auth/signup'
      },
      student_signup: {
        method: 'POST',
        url: '/api/auth/signup/student'
      },
      signin: {
        method: 'POST',
        url: '/api/auth/signin'
      },
      delete_req: {
        method: 'DELETE',
        url: '/api/users/delete_userreq/:id'
      }
    });

    angular.extend(Users, {
      deleteReq: function(id){
        return this.delete_req({
          id: id
        }).$promise;
      },
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
      sendFormFixEmail: function(credentials){
        console.log("credentials: ",credentials);
        return this.send_form_fix_email(credentials).$promise;
      },
      userSignup: function (credentials) {
        return this.signup(credentials).$promise;
      },
      studentSignup: function (credentials) {
        return this.student_signup(credentials).$promise;
      },
      userSignin: function (credentials) {
        return this.signin(credentials).$promise;
      }
    });

    return Users;
  }

}());

(function () {
  'use strict';

  // TODO this should be Users service
  angular
    .module('users.admin.services')
    .factory('AdminService', AdminService);

  AdminService.$inject = ['$resource'];

  function AdminService($resource) {
    var Admins = $resource('/api/admin/', {}, {
      retrieve_users: {
        method: 'GET',
        url: '/api/users'
      },
      retrieve_user: {
        method: 'GET',
        url: '/api/users/:userId'
      },
      send_signup_link: {
        method: 'POST',
        url: '/api/auth/sendSignup'
      },
      update_user: {
        method: 'PUT',
        url: '/api/users/:userId'
      }
    });

    angular.extend(Admins, {
      retrieveUsers: function () {
        return this.retrieve_users().$promise;
      },
      retrieveUser: function (userId) {
        return this.retrieve_user({
          userId: userId
        }).$promise;
      },
      updateUser: function(userId, user) {
        return this.update_user({
          userId
        }, user).$promise;
      },
      allowSignupRequest: function (credentials) {
        return this.send_signup_link(credentials).$promise;
      }
    });

    return Admins;
  }
}());

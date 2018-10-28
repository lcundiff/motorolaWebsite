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
      update_user: {
        method: 'PUT',
        url: '/api/users/:userId'
      },
      retrieve_userreqs: {
        method: 'GET',
        url: '/api/users/list-userreqs'
      },
      retrieve_userreq: {
        method: 'GET',
        url: '/api/users/get-req/:reqId'
      },
      update_userreq: {
        method: 'PUT',
        url: '/api/users/update-req/:reqId'
      },
      man_accept_student: {
        method: 'PUT',
        url: '/api/automate/manAccept/:sessionNum'
      }
    });

    angular.extend(Admins, {
      updateUserReq: function(reqId, userReq) {
        console.log('here');
        return this.update_userreq({
          reqId: reqId
        }, userReq).$promise;
      },
      retrieveUserReqs: function () {
        return this.retrieve_userreqs().$promise;
      },
      retrieveUserReq: function (reqId) {
        return this.retrieve_userreq({
          reqId: reqId
        }).$promise;
      },
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
          userId: userId
        }, user).$promise;
      },
      manAcceptStudent: function(sessionNum, student) {
        return this.man_accept_student(
          {sessionNum: sessionNum
        }, student).$promise;
      }
    });

    return Admins;
  }
}());

(function () {
  'use strict';

  // Setting up route
  angular
    .module('users.admin.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('admin.users', {
        url: '/users',
        templateUrl: '/modules/users/client/views/admin/list-users.client.view.html',
        controller: 'UserListController',
        controllerAs: 'vm'
      })
      .state('admin.user', {
        url: '/users/:userId',
        templateUrl: '/modules/users/client/views/admin/view-user.client.view.html',
        controller: 'UserController',
        controllerAs: 'vm',
        resolve: {
          userResolve: getUser
        },
        data: {
          pageTitle: '{{ userResolve.displayName }}'
        }
      })
      .state('admin.user-edit', {
        url: '/users/:userId/edit',
        templateUrl: '/modules/users/client/views/admin/edit-user.client.view.html',
        controller: 'UserController',
        controllerAs: 'vm',
        resolve: {
          userResolve: getUser
        },
        data: {
          pageTitle: '{{ userResolve.displayName }}'
        }
      })
      .state('admin.userreqs', {
        url: '/userreqs',
        templateUrl: '/modules/users/client/views/admin/list-userreqs.client.view.html',
        controller: 'ReqListController',
        controllerAs: 'vm'
      })
      .state('admin.userreq', {
        url:'/userreqs/:reqId',
        templateUrl: '/modules/users/client/views/admin/view-userreq.client.view.html',
        controller: 'UserReqController',
        controllerAs: 'vm',
        resolve: {
          userResolve: getUserReq
        }
      })
      .state('admin.students', {
        url:'/students',
        templateUrl: '/modules/users/client/views/admin/applicants-admin.client.view.html',
        controller: 'ApplicantsAdminsController',
        controllerAs: 'vm'
      })
      .state('admin.approveForms', {
        url:'/admin-forms/student-forms',
        templateUrl: '/modules/users/client/views/admin/forms-admin.client.view.html',
        controller: 'FormsAdminsController',
        controllerAs: 'vm'
      })
      .state('admin.updateForms', {
        url:'admin-forms/update-view-forms',
        templateUrl: '/modules/users/client/views/admin/update-forms-admin.client.view.html',
        controller: 'FormsAdminsController',
        controllerAs: 'vm'
      })
      .state('admin.volunteers', {
        url:'/volunteers',
        templateUrl: '/modules/users/client/views/admin/volunteers-admin.client.view.html',
        controller: 'VolunteersAdminsController',
        controllerAs: 'vm'
      });
    /*  .state('admin.student', {

      })
      .state('admin.volunteers', {

      })
      .state('admin.volunteer', {

      })
      .state('admin.match', {

      })
      .state('admin.docs', {

      })
      .state('admin.calendar', {

      });*/


    getUser.$inject = ['$stateParams', 'AdminService'];

    function getUser($stateParams, AdminService) {
      return $stateParams.userId;
      //return AdminService.retrieveUser($stateParams.userId).$promise;
    }

    function getUserReq($stateParams, AdminService) {
      console.log("in client routes, req Id: ",$stateParams.reqId);
      return $stateParams.reqId;
    }
  }
}());

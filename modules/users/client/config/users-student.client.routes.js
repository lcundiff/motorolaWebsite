(function () {
  'use strict';

  // Setting up route
  angular
    .module('users.student.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('student.application', {
        url: '/student/application',
        templateUrl: '/modules/users/client/views/students/application-student-edit.client.view.html',
        controller: 'StudentsController',
        controllerAs: 'vm'
      });
    /*  .state('student.', {
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
      });*/


    getUser.$inject = ['$stateParams', 'StudentService'];

    function getUser($stateParams, StudentService) {
      return $stateParams.userId;
      //return AdminService.retrieveUser($stateParams.userId).$promise;
    }
  }
}());

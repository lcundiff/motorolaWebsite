(function () {
  'use strict';

  // Setting up route
  angular
    .module('users.volunteer.routes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('volunteer.application', {
        url: '/volunteer/application',
        templateUrl: '/modules/users/client/views/volunteers/application-volunteer.client.view.html',
        controller: 'VolunteerController',
        controllerAs: 'vm'
      })
      .state('volunteer.mentorship', {
        url: '/volunteer/mentorship',
        templateUrl: '/modules/users/client/views/volunteers/mentorship-volunteer.client.view.html',
        controller: 'MentorshipVolunteerController',
        controllerAs: 'vm'
      })
      .state('volunteer.interviews', {
        url: '/volunteer/interviews',
        templateUrl: '/modules/users/client/views/volunteers/interview-volunteer.client.view.html',
        controller: 'InterviewVolunteerController',
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


    getUser.$inject = ['$stateParams', 'AdminService'];

    function getUser($stateParams, AdminService) {
      return $stateParams.userId;
      //return AdminService.retrieveUser($stateParams.userId).$promise;
    }
  }
}());

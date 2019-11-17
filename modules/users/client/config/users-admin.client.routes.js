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
      .state('admin.interviews', {
        url:'/interviews',
        templateUrl: '/modules/users/client/views/admin/interviews-admin.client.view.html',
        controller: 'InterviewsAdminsController',
        controllerAs: 'vm'
      })
      .state('admin.match', {
        url:'/match',
        templateUrl: '/modules/users/client/views/admin/match-admin.client.view.html',
        controller: 'MatchAdminsController',
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
      })

      // SYDNEY: the state change has been updated, now route the correct html page
      // for admin to create a new volunteer and specifies the client side
      // controller, AdminAddVolunteerController, that controls the html page
      // volunteers-admin.client.controller.js 
      // the url is just the current url that the html add volunteer page is served to
      .state('admin.createvolunteer', {
        url:'/volunteer/application',
        templateUrl: '/modules/users/client/views/admin/admin-add-volunteer.client.view.html',
        controller: 'AdminAddVolunteerController',
        controllerAs: 'vm'
      })
	  .state('admin.dash', {
        url:'/dash',
        templateUrl: '/modules/users/client/views/admin/dashboard-admin.client.view.html',
        controller: 'DashboardAdminsController',
        controllerAs: 'vm'
      })
      .state('admin.csv', {
        url:'/csv',
        templateUrl: '/modules/users/client/views/admin/csv-admin.client.view.html',
        controller: 'ApplicantsAdminsController',
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

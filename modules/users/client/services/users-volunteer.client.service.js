(function () {
  'use strict';

  // TODO this should be Users service
  angular
    .module('users.volunteer.services')
    .factory('VolunteerService', VolunteerService);

  VolunteerService.$inject = ['$resource'];

  function VolunteerService($resource) {
    var Volunteers = $resource('/api/volunteers/', {}, {
        get_volunteers: {
          method: 'GET',
          isArray: true,
          url: '/api/volunteers'
        },
        create_volunteer: {
          method: 'POST',
          url: '/api/volunteers'
        },
        get_all_volunteers: {
          method: 'GET',
          isArray: true,
          url: '/api/volunteers/all'
        },
        list_deactivated: {
          method: 'GET',
          isArray: true,
          url: '/api/volunteers/deactivated'
        },
        get_volunteer: {
          method: 'GET',
          url: '/api/volunteers/:userId'
        },
        update_volunteer: {
          method: 'PUT',
          url: '/api/volunteers/:userId'
        },
        delete_volunteer: {
          method: 'DELETE',
          url: '/api/volunteers/:userId'
        }
      });


    angular.extend(Volunteers, {
      getVolunteers: function(userId) {
        return this.get_volunteers({
          userId: userId
        }).$promise;
      },
      createVolunteer: function(volunteer) {
        return this.create_volunteer(volunteer).$promise;
      },
      getAllVolunteers: function() {
        return this.get_all_volunteers().$promise;
      },
      listDeactivated: function() {
        return this.list_deactivated().$promise;
      },
      getVolunteer: function(userId) {
        return this.get_volunteer({
          userId: userId
        }).$promise;
      },
      updateVolunteer: function(userId) {
        return this.update_volunteer({
          userId: userId
        }).$promise;
      },
      deleteVolunteer: function(userid) {
        return this.delete_volunteer({
          userId: userId
        }).$promise;
      }
    });

    return Volunteers;
  }
}());

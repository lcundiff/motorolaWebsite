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
        get_volunteer_by_username: {
          method: 'GET',
          url: '/api/volunteers/getByUser/:username'
        },
        update_volunteer: {
          method: 'PUT',
          url: '/api/volunteers/update/:username'
        },
        delete_volunteer: {
          method: 'DELETE',
          url: '/api/volunteers/:userId'
        },
        get_interviewees: {
          method: 'GET',
          url: '/api/volunteers/:username/interviews/interviewees'
        },
        get_mentees: {
            method: 'GET',
            url: '/api/volunteers/:username/mentorship/mentees'
        }
      });


    angular.extend(Volunteers, {
      getInterviewees: function(username) {
        return this.get_interviewees({username: username}).$promise;
      },
      getMentees: function(username) {
        return this.get_mentees({username: username}).$promise;
      },
      getVolunteers: function(userId) {
        return this.get_volunteers().$promise;
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
      getVolunteerByUsername: function(username) {
        console.log("username: ",username);
        return this.get_volunteer_by_username({
          username: username
        }).$promise;
      },
      updateVolunteer: function(username, volunteer) {
        console.log("username: ",username);
        return this.update_volunteer({
          username: username,
        }, volunteer).$promise;
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

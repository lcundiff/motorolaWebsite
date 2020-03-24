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
        url: '/api/users/user/:userId'
      },
      delete_user: {
        method: 'DELETE',
        url: '/api/users/user/:userId'
      },
      update_user: {
        method: 'PUT',
        url: '/api/users/user/:userId'
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
      delete_userreq: {
        method: 'DELETE',
        url: '/api/users/delete-userreq'
      },
      man_accept_student: {
        method: 'PUT',
        url: '/api/automate/manAccept/:sessionNum'
      },
      auto_accept: {
        method: 'PUT',
        url: '/api/automate/autoAcceptAllStudents'
      },
      auto_assign_interviews: {
        method: 'PUT',
        url: '/api/automate/autoAssignInterviews'
      },
      auto_match: {
        method: 'PUT',
        url: '/api/automate/autoMatch/:sessionNum'
      },
      get_new_student_activity: {
        method: 'GET',
        url: '/api/analytics/newStudentActivity'
      },
      get_completed_student_apps: {
        method: 'GET',
        url: '/api/analytics/completedStudentApps'
      },
      get_completed_student_forms: {
        method: 'GET',
        url: '/api/analytics/completedStudentForms'
      },
      get_new_volunteer_activity: {
        method: 'GET',
        url: '/api/analytics/newVolunteerActivity'
      },
      get_new_mentor_activity: {
        method: 'GET',
        url: '/api/analytics/newMentorActivity'
      },
      get_new_interviewer_activity: {
        method: 'GET',
        url: '/api/analytics/newInterviewerActivity'
      },
      get_completed_volunteer_apps: {
        method: 'GET',
        url: '/api/analytics/completedVolunteerApps'
      },
      update_schools: {
        method: 'PUT',
        url: '/api/updateSchools'
      },
      send_thank_you: {
        method: 'PUT',
        url: '/api/sendThankYou'
      },
      send_correction: {
        method: 'PUT',
        url: '/api/sendCorrection'
      },
      

    });

    angular.extend(Admins, {
      completedVolunteerApps: function() {
        return this.get_completed_volunteer_apps().$promise;
      },
      newVolunteerActivity: function() {
        return this.get_new_volunteer_activity().$promise;
      },
      newMentorActivity: function() {
        return this.get_new_mentor_activity().$promise;
      },
      newInterviewerActivity: function() {
        return this.get_new_interviewer_activity().$promise;
      },
      completedStudentForms: function() {
        return this.get_completed_student_forms().$promise;
      },
      completedStudentApps: function() {
        return this.get_completed_student_apps().$promise;
      },
      newStudentActivity: function() {
        return this.get_new_student_activity().$promise;
      },
      autoMatch: function (sessionNum) {
        return this.auto_match({sessionNum: sessionNum}, null).$promise;
      },
      autoAssignInterviews: function () {
        return this.auto_assign_interviews().$promise;
      },
      autoAccept: function () {
        return this.auto_accept().$promise;
      },
      updateUserReq: function(reqId, userReq) {
        return this.update_userreq({
          reqId: reqId
        }, userReq).$promise;
      },
      deleteUserReq: function(userReq) {
        console.log("userReq: ",userReq);
        return this.delete_userreq(userReq).$promise;
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
        console.log("Admin.retriede: ",userId);
        return this.retrieve_user({
          userId: userId
        }).$promise;
      },
      updateUser: function(userId, user) {
        return this.update_user({
          userId: userId
        }, user).$promise;
      },
      deleteUser: function(userId, user) {
        return this.delete_user({
          userId: userId
        }, user).$promise;
      },
      manAcceptStudent: function(sessionNum, student) {
        return this.man_accept_student(
          {sessionNum: sessionNum
        }, student).$promise;
      },
      updateSchools: function (schoolName) {
         return this.update_schools(
          {name: schoolName
        }).$promise;
      },
      sendThankYou: function (credentials) {
        return this.send_thank_you({
          credentials: credentials
       }).$promise;
     },
     sendCorrection: function (credentials) {
        return this.send_correction({
          credentials: credentials
        }).$promise;
     },
     
      
    });

    return Admins;
  }
}());

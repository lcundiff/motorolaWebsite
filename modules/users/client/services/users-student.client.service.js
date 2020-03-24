(function () {
  'use strict';

  // TODO this should be Users service
  angular
    .module('users.student.services')
    .factory('StudentService', StudentService);

  StudentService.$inject = ['$resource'];

  function StudentService($resource) {
    var Students = $resource('/api/student/', {}, {
        get_student: {
          method: 'GET',
          url: '/api/students/read/:userId'
        },
        get_student_by_username: {
          method: 'GET',
          url: '/api/students/getByUsername/:username'
        },
        create_student: {
          method: 'PUT',
          url: '/api/students/create'
        },
        update_student: {
          method: 'PUT',
          url: '/api/students/update/:userId'
        },
        delete_student: {
          method: 'DELETE',
          url: '/api/students/delete/:userId'
        },
        list: {
          method: 'GET',
          isArray: true,
          url: '/api/students/list'
        },
        list_deactivated: {
          method: 'GET',
          isArray: true,
          url: '/api/students/listDeactivated'
        },
        list_active: {
          method: 'GET',
          isArray: true,
          url: '/api/students/listActive'
        },
        list_old: {
          method: 'GET',
          isArray: true,
          url: '/api/students/listOld'
        },
        list_accepted: {
          method: 'GET',
          isArray: true,
          url: '/api/students/listAccepted'
        },
        list_forms_not_approved: {
          method: 'GET',
          isArray: true,
          url: '/api/students/listFormsNotApproved'
        },
        active_no_forms: {
          method: 'GET',
          isArray: true,
          url: '/api/students/listActiveWithoutForms'
        },
        non_active_no_forms: {
          method: 'GET',
          isArray: true,
          url: '/api/students/listNonActiveWithoutForms'
        },
        close_apps: {
          method: 'GET',
          url: '/api/students/closeApps'
        },
        check_apps_closed: {
          method: 'GET',
          url: '/api/students/checkApps'
        },
      get_schools: {
        method:'GET',
        url: '/api/getSchools'
      }
      });

    angular.extend(Students, {
      checkAppsClosed: function() {
        return this.check_apps_closed().$promise;
      },
      closeStudentApps: function() {
        return this.close_apps().$promise;
      },
      getStudent: function(userId) {
        return this.get_student({
          userId: userId
        }).$promise;
      },
      getStudentByUsername: function(username) {
        return this.get_student_by_username({
          username: username
        }).$promise;
      },
      createStudent: function(student){
        return this.create_student(student).$promise;
      },
      updateStudent: function(userId, student){
        return this.update_student({
          userId: userId
        }, student).$promise;
      },
      deleteStudent: function(userId){
        return this.delete_student({
          userId: userId
        }).$promise;
      },
      studentList: function(){
        return this.list().$promise;
      },
      studentListDeactivated: function(){
        return this.list_deactivated().$promise;
      },
      studentListActive: function(){
        return this.list_active().$promise;
      },
      studentListAccepted: function(){
        return this.list_accepted().$promise;
      },
      studentlistFormsNotApproved: function(){
        return this.list_forms_not_approved
      },
      studentListActiveWithoutForms: function(){
        return this.active_no_forms().$promise;
      },
      studentListNonActiveWithoutForms: function(){
        return this.non_active_no_forms().$promise;
      },
     oldStudentList: function(){
        return this.list_old().$promise;
      },
      getSchools: function () {
         return this.get_schools().$promise;
      }
    });

    return Students;
  }
}());

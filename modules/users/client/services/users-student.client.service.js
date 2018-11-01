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
        list_accepted: {
          method: 'GET',
          isArray: true,
          url: '/api/students/listAccepted'
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
        }
      });


    angular.extend(Students, {
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
      studentListActiveWithoutForms: function(){
        return this.active_no_forms().$promise;
      },
      studentListNonActiveWithoutForms: function(){
        return this.non_active_no_forms().$promise;
      }
    });

    return Students;
  }
}());

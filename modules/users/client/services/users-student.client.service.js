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
        create_student: {
          method: 'PUT',
          url: '/api/students/create'
        },

        update_student: {
          method: 'PUT',
          url: '/api/students/updates/:userId'
        },
        delete_student: {
          method: 'DELETE',
          url: '/api/students/delete/:userId'
        },
        list: {
          method: 'GET',
          url: '/api/students/list'
        },
        list_deactivated: {
          method: 'GET',
          url: '/api/students/listDeactivated'
        },
        list_accepted: {
          method: 'GET',
          url: '/api/students/listAccepted'
        }
      });


    angular.extend(Students, {
      getStudent: function(userId) {
        return this.get_student({
          userId: userId
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
        return this.list_accepted().$promise;
      }
    });

    return Students;
  }
}());

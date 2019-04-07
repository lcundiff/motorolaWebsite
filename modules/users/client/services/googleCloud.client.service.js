(function () {
  'use strict';

  // TODO this should be Users service
  angular
    .module('users.services')
    .factory('GoogleCloudService', GoogleCloudService);

  GoogleCloudService.$inject = ['$http','$resource'];

  function GoogleCloudService($http) {
  /*  var GoogleCloud = $resource('/api/student/', {}, {
        put_file: {
          method: 'PUT',
          url: '/api/files/cloud-storage/:filename/:file',
        },
        get_file: {
          method: 'GET',
          url: '/api/files/cloud-storage/:filename',
        },
      });*/
    var methods = {
      uploadForm: function(filename, file) {
        console.log(file);
        var fd = new FormData();
        fd.append("NDA", file);

        console.log('YO');
        console.log(fd);
        console.log('Here upload GCS!!');

        return $http.put(`/api/files/cloud-storage/${filename}`, fd, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined }
      });
      }
      /*(downloadForm: function(filename) {
        return this.get_file({
          filename: filename
        }).$promise;
      },*/
    };

    return methods;
  }
}());

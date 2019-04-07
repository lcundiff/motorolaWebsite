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
        fd.append("file", file);

        return $http.put(`/api/files/cloud-storage/${filename}`, fd, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined }
      });
    },
      downloadForm: function(filename) {
        return $http.get(`/api/files/cloud-storage/${filename}`, { responseType: 'arraybuffer' });
      }
    };

    return methods;
  }
}());

(function () {
  'use strict';
  // Users service used for communicating with the users REST endpoint
  angular
    .module('users.files.services')
    .factory('FileService', FileService);

  FileService.$inject = ['$http'];

  function FileService($http) {
    var methods = {
      upload: function(file) {
        var fd = new FormData();
        fd.append("myFile", file.upload);

        console.log('Here upload!!');

        return $http.post('/api/files/upload', fd, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined }
        });
      },
      download: function(filename) {

        return $http.get('/api/files/get/' + filename, { responseType: 'arraybuffer' });
      }
    };

    return methods;
  }

}());

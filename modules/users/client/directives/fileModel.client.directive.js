(function () {
  'user strict';

  angular
    .module('users')
    .directive('fileModel', ['$parse', function($parse) {
      return {
        restrict: 'A',
        link: function(scope, element, attr) {
          var parsedFile = $parse(attr.fileModel);
          var parsedFileSetter = parsedFile.assign;

          element.bind('change', function() {
            scope.$apply(function (){
              parsedFileSetter(scope, element[0].files[0]);
            });
          });
        }
      }
    }]);
}());

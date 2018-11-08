(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$scope', '$state', '$location', '$window',  'Notification'];

  function HomeController($scope, $state, $location, $window, Notification) {
    var vm = this;
    console.log("$state: ",$state);
    if(!$window.user){
      vm.authentication = {};
      vm.authentication.roles = "none";
    }
    else{
      vm.authentication = $window.user;
    }

    console.log("vm: ",vm);

    console.log(vm.authentication.roles.toString());
  }
}());

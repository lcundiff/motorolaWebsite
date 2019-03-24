(function () {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  HeaderController.$inject = ['$scope', '$state', 'Authentication', 'menuService'];

  function HeaderController($scope, $state, Authentication, menuService) {
    var vm = this;

    vm.accountMenu = menuService.getMenu('account').items[0];
    vm.authentication = Authentication;
    vm.isCollapsed = false;
    vm.menu = menuService.getMenu('topbar');
    vm.dashboardOrHome = dashboardOrHome;

    $scope.$on('$stateChangeSuccess', stateChangeSuccess);

    function stateChangeSuccess() {
      // Collapsing the menu after navigation
      vm.isCollapsed = false;
    }

    function dashboardOrHome() {
      if(vm.authentication.user === null){
        $state.go('home', $state.previous.params);
      }
      else if(vm.authentication.user.roles.indexOf('admin') !== -1){
        $state.go('admin.dash', $state.previous.params);
      }
      else if(vm.authentication.user.roles.indexOf('student') !== -1){
        $state.go('student.application', $state.previous.params);
      }
      else if(vm.authentication.user.roles.indexOf('volunteer') !== -1){
        $state.go('volunteer.application', $state.previous.params);
      }
    }
  }
}());

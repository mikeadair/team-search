var mainApp = angular.module("mainApp", ['ngRoute']);

mainApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.

    when('/register', {
        templateUrl: 'register.html'
    }).

    when('/', {
        templateUrl: 'login.html'
    }).

    otherwise({
        redirectTo: '/'
    });
}]);


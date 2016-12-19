var mainApp = angular.module("mainApp", ['ngRoute']);
         
         mainApp.config(['$routeProvider', function($routeProvider) {
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
         
   mainApp.controller('FormCtrl', function ($scope, $http) {
    
    $scope.data = {
        email: "default",
        summonerName: "default",
        password: "default"
    };
    $scope.submitForm = function() {
        $http.post('/register', JSON.stringify(data)).success(function(data){
           console.log(data);
           
        });
    };
});

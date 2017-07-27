
(function(){
    'use strict';

    angular
        .module('gofarModule.gofarServices', []);
    /*    .service('authSrvc', authSrvc);
    
    authSrvc.$inject = ['$rootScope'];
    

    function authSrvc($rootScope){
    };

        Appacitive.initialize({ 
            apikey: "WdqX2mawYXcuBk+3nu5vqgVMdB0FDNfcXTT9m6nw+Lc=",
            env: "sandbox",     
            appId: "118985769945792967"   
        });
        
        var vm = this;
        vm.login = login;
        vm.register = register;
        vm.logout = logout;
        
        function login(loginCredentials){
            var promise = Appacitive.User.login(loginCredentials.username, loginCredentials.password);
            promise.then(function(authResult) {
                console.log(authResult);
                console.log('Logged succesfully , id: ' + authResult.user.get('__id'));
                $rootScope.$apply(function() {
                    $rootScope.IsLoggedIn = true;
                    $rootScope.templatePath = 'profile.html';
                });
            }, function(error) {
                console.log('Failed: ' + error.message);
                $rootScope.$apply(function() {
                    $rootScope.templatePath = 'login.html';
                });
            });
        }
        
        function register(userDetails){
            var promise = Appacitive.User.signup(userDetails);
            promise.then(function(authResult) {
                console.log(authResult);
                console.log('Saved successfully, id: ' + authResult.user.get('__id'));
                $rootScope.$apply(function() {
                    $rootScope.IsLoggedIn = true;
                    $rootScope.templatePath = 'profile.html';
                });
            }, function(error) {
                console.log('Failed: ' + error.message);
                $rootScope.$apply(function() {
                    $rootScope.templatePath = 'login.html';
                });
            });
        }
        
        function logout(){
            var makeAPICall = true;
            var promise = Appacitive.User.logout(makeAPICall);
            promise.then(function() {
                var cUser = Appacitive.User.current();
                console.log('User logged out : ' + cUser);
                $rootScope.$apply(function() {
                    $rootScope.IsLoggedIn = false;
                    $rootScope.templatePath = 'login.html';
                });
            }, function(error) {
                console.log('Error logging out : ' + error.message);
            });
        }
        
        return vm;
    };*/
    


})();
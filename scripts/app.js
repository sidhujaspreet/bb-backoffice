
(function() {
    'use strict';

    angular
        .module('gofarModule', [
            //'ngRoute',
            'ui.router',
            'ngCookies',
            'base64',   
            'btorfs.multiselect',
            'gofarModule.gofarControllers',
            'gofarModule.gofarDirectives',
            'gofarModule.gofarServices',
            'gofarModule.gofarFactories'
        ])
    
        .config(function($stateProvider, $urlRouterProvider, $httpProvider) {
            $httpProvider.interceptors.push('AuthInterceptor');
            $stateProvider            
                .state('home', {
                    url: '/',
                    templateUrl: 'templates/home.html',
                    controller: 'homeCtrl',
                    controllerAs: 'homeC'
                })
                .state('home.login', {
                    url: 'login',
                    views: {
                        "auth": {
                            templateUrl: 'templates/login.html',
                            controller: 'loginCtrl',
                            controllerAs: 'loginC'
                        }
                    }
                })
                .state('home.register', {
                    url: 'register',
                    views: {
                        "auth": {
                            templateUrl: 'templates/register.html',
                            controller: 'registerCtrl',
                            controllerAs: 'registerC'
                        }
                    }
                })
                .state('portal', {
                    url: '/portal',
                    templateUrl: 'templates/portal.html',
                    controller: 'portalCtrl',
                    controllerAs: 'portalC'
                })
                .state('portal.users', {
                    url: '/users',
                    params: {
                        tableName: 'users'
                    },
                    views: {
                        "content": {
                            templateUrl: 'tables/users/home.html',
                            controller: 'tableCtrl',
                            controllerAs: 'tableC'
                        }
                    }
                })
                .state('portal.cities', {
                    url: '/cities',
                    params: {
                        tableName: 'cities'
                    },
                    views: {
                        "content": {
                            templateUrl: 'tables/cities/home.html',
                            controller: 'cityCtrl',
                            controllerAs: 'tableC'
                        }
                    }
                })
                .state('portal.packages', {
                    url: '/packages',
                    params: {
                        tableName: 'packages'
                    },
                    views: {
                        "content": {
                            templateUrl: 'tables/packages/home.html',
                            controller: 'packageCtrl',
                            controllerAs: 'packageC'
                        }
                    }
                })
                //=============================
                .state('portal.users.list', {
                    url: '/list',
                    views: {
                        "crud": {
                            templateUrl: 'tables/users/list.html'
                        }
                    }
                })
                .state('portal.users.edit', {
                    url: '/edit/:userid',
                    views: {
                        "crud": {
                            templateUrl: 'tables/users/edit.html'
                        }
                    }
                })
                .state('portal.users.view', {
                    url: '/view/:userid',
                    views: {
                        "crud": {
                            templateUrl: 'tables/users/view.html'
                        }
                    }
                })
                .state('portal.users.add', {
                    url: '/add',
                    views: {
                        "crud": {
                            templateUrl: 'tables/users/add.html'
                        }
                    }
                })
                //=======================
               //=============================
                .state('portal.cities.list', {
                    url: '/list',
                    views: {
                        "crud": {
                            templateUrl: 'tables/cities/list.html'
                        }
                    }
                })
                .state('portal.cities.edit', {
                    url: '/edit/:cityid',
                    views: {
                        "crud": {
                            templateUrl: 'tables/cities/edit.html'
                        }
                    }
                })
                .state('portal.cities.view', {
                    url: '/view/:cityid',
                    views: {
                        "crud": {
                            templateUrl: 'tables/cities/view.html'
                        }
                    }
                })
                .state('portal.cities.add', {
                    url: '/add',
                    views: {
                        "crud": {
                            templateUrl: 'tables/cities/add.html'
                        }
                    }
                })
                .state('portal.cities.add.hotel', {
                    url: '/hotel',
                    views: {
                        "sub@portal.cities.add": {
                            templateUrl: 'tables/cities/helpers/addHotel.html'
                        }
                    }
                })
                .state('portal.cities.add.hotel.addroom', {
                    url: '/addRoom',
                    views: {
                        "subcontent@portal.cities.add": {
                            templateUrl: 'tables/cities/helpers/addRoom.html'
                        }
                    }
                })
                //=======================
               //=============================
                .state('portal.packages.list', {
                    url: '/packages',
                    views: {
                        "crud": {
                            templateUrl: 'tables/packages/list.html'
                        }
                    }
                })
                .state('portal.packages.edit', {
                    url: '/edit/:packageid',
                    views: {
                        "crud": {
                            templateUrl: 'tables/packages/edit.html'
                        }
                    }
                })
                .state('portal.packages.view', {
                    url: '/view/:packageid',
                    views: {
                        "crud": {
                            templateUrl: 'tables/packages/view.html'
                        }
                    }
                })
                .state('portal.packages.add', {
                    url: '/add',
                    views: {
                        "crud": {
                            templateUrl: 'tables/packages/add.html'
                        }
                    }
                })
                //=======================
            
                .state('unauthorized', {
                    url: '/unauthorized',
                    templateUrl: 'templates/unauthorized.html',
                    controller: 'unauthoCtrl',
                    controllerAs: 'unauthoC'
                });
            
            $urlRouterProvider.otherwise('/');
        })
    
        .run(['$rootScope', '$location', '$http', '$state', '$cookies', 'Permission', function($rootScope, $location, $http, $state, $cookies, Permission) {
            // keep user logged in after page refresh

            $rootScope.$on('$locationChangeStart', function (event, next, current) {
                // redirect to login page if not logged in and trying to access a restricted page
                //var canAccess = 
                if (($state.current.params && ($state.current.params &&$state.current.params.roles.indexOf(Permission.permissionA()) == -1)) || $state.current.name == 'unauthorized') {
                    $state.go('unauthorized');
                }
                var restrictedPage = ['', '/', '/login', '/register'].indexOf($location.path()) === -1;//can use $location.path() as well
                //var loggedIn = $rootScope.globals.currentUser;
                var loggedIn = $cookies['loggedIn'];//$rootScope.isLoggedIn;
                if (restrictedPage && loggedIn == 'false'){
                    $state.go('home');
                    console.log('User not logged in.');
                }
                else {
                    console.log('User logged in.');
                }
            });
        }]);
})();


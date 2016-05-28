angular.module('MyMovieManager')
    .config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlProvider) {
            $urlProvider.otherwise('/');
            $stateProvider
                .state('/', {
                    url: '/',
                    templateUrl: './pages/Views/Display/startup.html'
                })
                .state('Configuration', {
                    url: '/Configuration',
                    templateUrl: './pages/Views/Configuration/index.html'
                })
                .state('Configuration.InitialSetup', {
                    url: '/Configuration/InitialSetup',
                    templateUrl: './pages/Views/Configuration/initialSetup.html'
                })
                .state('Home', {
                    url: '/Home',
                    templateUrl: './pages/Views/Display/thumbnailView.html'
                });
        }]);
(function(){
    "use strict";
    var miniApp=angular.module("miniApp",["ui.router","ngResource","ui.bootstrap","ngCookies","ngStorage"]);
    miniApp.config(["$stateProvider","$urlRouterProvider", "$locationProvider",miniAppConf]);
    function miniAppConf($stateProvider,$urlRouterProvider,$locationProvider){
        $urlRouterProvider.otherwise("/")
        $stateProvider
            .state("welcome",{
                url:"",
                templateUrl:"../templates/login.html",

                controller:"LoginCtrl as vm"
            })
            .state("sendMail",{
                url:"/sendMail/:code",
                templateUrl:"../templates/sendMail.html",
                controller:"SendMailCtrl as vm"
            })
            
            /*.state("welcome.listPublic",{
                url:"/list",
                templateUrl:"app/publicList/list.html",
                controller:"ListCtrl as vm",
                resolve:{
                    Resources:"Resources"

                }
            })
            .state("welcome.favorites",{
                url:"/favorites",
                templateUrl:"app/favoriteList/list.html",
                controller:"FavoriteCtrl as vm"
            })
            .state('welcome.login',{
                url:"/login",
                templateUrl:"app/login/login.html",
                controller:"LoginCtrl as vm"


            })*/


    }
}());
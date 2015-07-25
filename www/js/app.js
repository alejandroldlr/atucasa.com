//***********************************************************************
// Atucasa.com
// Diplomado aplicaciones móviles
// Enrique Vargas Flores
// Alejandro López de La Rosa
// Julio - 2015
//***********************************************************************

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

//***********************************************************************
// Global variable db to manage the internal database of the application
//***********************************************************************

var db = null;

//*********************************************************************************
// Application atucasa.com uses firebase,ngcordova,sqllite,splashscreen,whitelists
//*********************************************************************************

angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova'])

.run(function($ionicPlatform, $ionicLoading, $rootScope, $window, $cordovaSQLite, $state,$cordovaSplashscreen,$ionicPopup) {
  
setTimeout(function() {
    $cordovaSplashscreen.hide()
}, 5000);

$ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
if (window.cordova && window.cordova.plugins.Keyboard) {
  cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
}
if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }


  /// Check for network connection
  if(window.Connection) {
    if(navigator.connection.type == Connection.NONE) {
      $ionicPopup.alert({ 
        title: 'Sin Conexion a Internet',
        content: 'Lo sentimos, no tiene conexion a Internet. Por favor reconectese e intentelo de nuevo.',
        okText: 'Aceptar',
        okType: 'button-assertive'
      })
      .then(function(result) {
        ionic.Platform.exitApp();
      });
    }
  }

    db = $cordovaSQLite.openDB("atucasa.db"); //Cordova sqllite database to register addresses and orders 
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS shippingaddress (id integer primary key autoincrement, street text, number text, refStreet1 text, refStreet2 text, building text, refPhone text, lat text, long text)");
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS menuorder (id integer primary key autoincrement, menu_id text, image text, service text, description text, quantity text, price text, rest_id text, addr_id text, order_number text, nit text, inv_name text, date text, rest_img text, rest_name text)");
    $rootScope.show = function(text) {
      $rootScope.loading = $ionicLoading.show({
        template: text ? text : 'Loading..',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
    };


    $rootScope.hide = function() {
      $ionicLoading.hide();
    };

    $rootScope.notify = function(text) {
      $rootScope.show(text);
      $window.setTimeout(function() {
        $rootScope.hide();
      }, 1999);
    };

//**********************************************
//Block backbutton on the confirm order screen
//**********************************************

$ionicPlatform.registerBackButtonAction(function (event) {
        if ($state.$current.name=="app.shippingAddressClean") {
              ionic.Platform.exitApp();
        }
        if ($state.$current.name=="app.orderComplete"
            ){
                // H/W BACK button is disabled for these states (these views)
                // Do not go to the previous state (or view) for these states. 
                // Do nothing here to disable H/W back button.
            } else {
                // For all other states, the H/W BACK button is enabled
                navigator.app.backHistory();
            }
        }, 100);


  });
})

//********************************************
//Router administration of the application
//********************************************

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {


  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.restaurantList', {
    url: "/restaurantList/:addressId",
    views: {
      'menuContent': {
        templateUrl: "templates/restaurantList.html",
        controller: 'restCtrl'
      }
    }
  })

  .state('app.restaurantListClean', {
    url: "/restaurantListClean",
    views: {
      'menuContent': {
        templateUrl: "templates/restaurantList.html",
        controller: 'restCtrl'
      }
    }
  })

  .state('app.restaurantMap', {
    url: "/restaurantMap/:productId",
    views: {
      'menuContent': {
        templateUrl: "templates/restaurantMap.html",
        controller: 'restMapCrtl'
      }
    }
  })

  .state('app.shippingAddress', {
    url: "/shippingAddress/:mainStreet/:lat/:long",
    views: {
      'menuContent': {
        templateUrl: "templates/shippingAddress.html",
        controller: 'shippingAddressCtrl'
      }
    }
  })

  .state('app.shippingAddressClean', {
    url: "/shippingAddressClean", 
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/shippingAddress.html",
        controller: 'shippingAddressCtrl'
      }
    }
  })


  .state('app.addressList', {
    url: "/addressList",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/addressList.html",
        controller: 'addressListCtrl'
      }
    }
  })

    .state('app.orderList', {
    url: "/orderList",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/orderList.html",
        controller: 'orderListCtrl'
      }
    }
  })

  .state('app.addressMap', {
    url: "/addressMap",
    views: {
      'menuContent': {
        templateUrl: "templates/addressMap.html",
        controller: 'addressMapCtrl'
      }
    }
  })

  .state('app.menuOrder', {
    url: "/menuOrder",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/menuOrder.html",
        controller: 'menuOrderCtrl'
      }
    }
  })

  .state('app.orderComplete', {
    url: "/orderComplete/:orderNumber",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/orderComplete.html",
        controller: 'orderCompleteCtrl'
      }
    }
  })

  .state('app.orderDetail', {
    url: "/orderDetail/:orderNumber",
    cache: false,
    views: {
      'menuContent': {
        templateUrl: "templates/orderDetail.html",
        controller: 'orderDetailCtrl'
      }
    }
  })        

  .state('app.restaurantMenu', {
    url: "/restaurantMenu/:productId/:addressId",
    views: {
      'menuContent': {
        templateUrl: "templates/restaurantMenu.html",
        controller: 'restMenuCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/shippingAddressClean');
});

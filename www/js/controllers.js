//***********************************************************************
// Atucasa.com
// Diplomado aplicaciones móviles
// Enrique Vargas Flores
// Alejandro López de La Rosa
// Julio - 2015
//***********************************************************************

angular.module('starter.controllers', ["ionic", "firebase","ngCordova", "starter.services"])

//**********************************************************************
//1. Restaurants list controller user interface
//   restaurantList.html
//**********************************************************************

.controller('restCtrl', function($scope, $firebaseArray, $stateParams, $window) {
  $scope.ref = new Firebase("https://atucasa.firebaseio.com");
  $scope.restaurants = $firebaseArray($scope.ref);
  $scope.addressId = $stateParams.addressId;
  $scope.go_map = function() {
     $window.location.href = ('#/app/restaurantListMap');
  }

})

//**********************************************************************
//2. Restaurants products controller user interface
//   restaurantMenu.html
//**********************************************************************

.controller('restMenuCtrl', function($scope, $timeout,$ionicPopup, $stateParams, $firebaseObject, $cordovaGeolocation, $cordovaSQLite, $window) {
  var ref = new Firebase("https://atucasa.firebaseio.com/"+$stateParams.productId);
  $scope.restaurant = $firebaseObject(ref);
  $scope.cantidad = 0;
  $scope.total = 0;

  $scope.add = function(menu) {
    $scope.cantidad = $scope.cantidad + 1;
    $scope.restaurant.menu[menu.id].quantity=$scope.restaurant.menu[menu.id].quantity+1;
    $scope.total = $scope.total+(1*$scope.restaurant.menu[menu.id].price); 
  };
  
  $scope.delete = function(menu) {
    if ($scope.restaurant.menu[menu.id].quantity>0) {
      $scope.cantidad = $scope.cantidad - 1;
      $scope.restaurant.menu[menu.id].quantity=$scope.restaurant.menu[menu.id].quantity-1;
      $scope.total = $scope.total-(1*$scope.restaurant.menu[menu.id].price); 
    }
  };

  $scope.goToRestMap = function() {
   $window.location.href = ('#/app/restaurantMap/'+$stateParams.productId);
 };

 $scope.commit = function(menu) {
  if ($scope.cantidad==0) {
   var alertPopup = $ionicPopup.alert({
     title: 'Atención',
     template: 'Debes seleccionar un menú antes de confirmar',
     okText: 'Aceptar',
     okType: 'button-assertive'});
 } else {

  var query = "DELETE FROM menuorder WHERE order_number IS NULL";
  $cordovaSQLite.execute(db, query, []).then(function(res) { 

    for (var i = 0; i < $scope.restaurant.menu.length; i++) { 
      if ($scope.restaurant.menu[i].quantity>0){ 
       var menu_id = $scope.restaurant.menu[i].id;
       var service = $scope.restaurant.menu[i].service;
       var description = $scope.restaurant.menu[i].description;
       var quantity = $scope.restaurant.menu[i].quantity;
       var price = $scope.restaurant.menu[i].price;
       var image = $scope.restaurant.menu[i].image;
       var rest_id = $stateParams.productId;
       var addr_id = $stateParams.addressId;
       var rest_img = $scope.restaurant.image;
       var rest_name = $scope.restaurant.name;


       var query = "INSERT INTO menuorder (menu_id, image, service, description, quantity, price, rest_id, addr_id, rest_img, rest_name) VALUES (?,?,?,?,?,?,?,?,?,?)";
       $cordovaSQLite.execute(db, query, [menu_id, image, service, description, quantity, price, rest_id, addr_id, rest_img, rest_name]).then(function(res) {

       }, function (err) {
         var alertPopup = $ionicPopup.alert({
           title: 'Atención',
           template: 'Error al registrar la orden de pedido',
           okText: 'Aceptar',
           okType: 'button-assertive'});
       });
     }

   }
   var timer=false;
   $scope.modelName='NaNa';
   $scope.$watch('modelName', function(){
    if(timer){
    // Ignore this change
    $timeout.cancel(timer)
  }  
  timer= $timeout(function(){
    // Run code
    $window.location.href = ('#/app/menuOrder');
  }, 1000);
  
});

 }, function (err) {
   var alertPopup = $ionicPopup.alert({
     title: 'Atención',
     template: 'Error en el registro de pedidos',
     okText: 'Aceptar',
     okType: 'button-assertive'});
 });
}
};
})

//**********************************************************************
//3. Products selection controller user interface
//   menuOrder.html
//**********************************************************************

.controller('menuOrderCtrl', function($scope, $cordovaSQLite, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $window, $rootScope, $stateParams, $state, $ionicHistory) {

  $scope.cantidad = 0;
  $scope.total = 0;
  $scope.invoiceData = {
    nit: "",
    invoiceName: ""
  };
  $scope.orderList = [];

  var v_street = "";
  var v_refStreet1 = ""; 
  var v_refStreet2 = "";
  var v_number = "";
  var v_refPhone = "";
  var order = [];                  
  
  var query = "SELECT * FROM menuorder WHERE order_number IS NULL ORDER BY id";
  $cordovaSQLite.execute(db, query, []).then(function(res) {
    var ref = new Firebase("https://atucasa.firebaseio.com/"+res.rows.item(0).rest_id);
    $scope.restaurant = $firebaseObject(ref);

    if(res.rows.length > 0) {

      for(var i = 0; i < res.rows.length; i++) {
        order.push({
          "id" : res.rows.item(i).menu_id,
          "image" : res.rows.item(i).image,
          "service" : res.rows.item(i).service,
          "description" : res.rows.item(i).description,
          "quantity" : res.rows.item(i).quantity,
          "price" : res.rows.item(i).price,
          "rest_id": res.rows.item(i).rest_id,
          "addr_id": res.rows.item(i).addr_id
        });
      };
      $scope.orderList = order;
      for (var i = 0; i < $scope.orderList.length; i++) { 
       $scope.cantidad  = $scope.cantidad   + Number($scope.orderList[i].quantity);
       $scope.total = $scope.total  + Number($scope.orderList[i].quantity)*Number($scope.orderList[i].price);
     };

     var query2 = "SELECT * FROM shippingaddress WHERE id = ?";
     $cordovaSQLite.execute(db, query2, [res.rows.item(0).addr_id]).then(function(resaddr) {
      // Get address data
      v_street = resaddr.rows.item(0).street;
      v_refStreet1 = resaddr.rows.item(0).refStreet1;
      v_refStreet2 = resaddr.rows.item(0).refStreet2;
      v_number = resaddr.rows.item(0).number;
      v_refPhone = resaddr.rows.item(0).refPhone;
      v_latitude =  resaddr.rows.item(0).lat;
      v_longitude = resaddr.rows.item(0).long;

    }, function (err) {
     var alertPopup = $ionicPopup.alert({
       title: 'Atención',
       template: 'Error al obtener dirección registrada',
       okText: 'Aceptar',
       okType: 'button-assertive'});
   });

   } else {
     alert("No hay ordenes de pedido registrdas");
     return false;
   }

 }, function (err) {
  var alertPopup = $ionicPopup.alert({
   title: 'Atención',
   template: 'Error al obtener ordenes de pedido',
   okText: 'Aceptar',
   okType: 'button-assertive'});
});

$scope.commit = function() {
  var confirmPopup = $ionicPopup.confirm({
   title: 'Atención',
   template: '¿Confirma su pedido?',
   okText: 'Aceptar',
   okType: 'button-balanced',
   cancelText: 'Cancelar',
   cancelType: 'button-assertive'
 });
  confirmPopup.then(function(res) {
    if(res) {

    //Insert address data
    order.push({
      "street": v_street,
      "refStreet1": v_refStreet1,
      "refStreet2": v_refStreet2,
      "number": v_number,
      "refPhone": v_refPhone,
      "latitude": v_latitude,
      "longitude": v_longitude
    });
    
    // Insert invoice data
    order.push({
      "nit" : $scope.invoiceData.nit,
      "invoiceName" : $scope.invoiceData.invoiceName
    });
    
    $rootScope.show("Procesando...")
    var orderRef = new Firebase("https://atucasaorders.firebaseio.com/");
    var newOrderRef = orderRef.push(order,function(error) {
     if (error) {
      $rootScope.hide();
      var alertPopup = $ionicPopup.alert({
        title: 'Atención',
        template: 'Su pedido no pudo ser procesado por favor intente nuevamente',
        okText: 'Aceptar',
        okType: 'button-assertive'});  
      orderToSave = [];     
    } else {
      $rootScope.hide();
      var postID = newOrderRef.key();
      $ionicHistory.clearCache();

     var query = "UPDATE menuorder SET order_number = ?, nit = ?, inv_name = ?, date = date('now') WHERE order_number IS NULL";
     $cordovaSQLite.execute(db, query, [postID,$scope.invoiceData.nit,$scope.invoiceData.invoiceName]).then(function(resaddr) {
         $state.go('app.orderComplete',{orderNumber: postID});
     }, function (err) {
      var alertPopup = $ionicPopup.alert({
        title: 'Atención',
        template: 'Error al actualizar pedidos realizados',
        okText: 'Aceptar',
        okType: 'button-assertive'});
      });
      
    }
  });
  } else { 
  }
});
}

})


//**********************************************************************
//3. Products orders controller user interface
//   orderDetail.html
//**********************************************************************

.controller('orderDetailCtrl', function($scope, $cordovaSQLite, $firebaseArray, $firebaseObject, $ionicPopup, $ionicLoading, $window, $rootScope, $stateParams, $state, $ionicHistory) {

  $scope.cantidad = 0;
  $scope.total = 0;
  $scope.orderList = [];
  $scope.addressData = [];
    
  var order_number = $stateParams.orderNumber;
  var order = [];
  var address = [];                 
  
  var query = "SELECT * FROM menuorder WHERE order_number = ? ORDER BY id";
  $cordovaSQLite.execute(db, query, [order_number]).then(function(res) {
    var ref = new Firebase("https://atucasa.firebaseio.com/"+res.rows.item(0).rest_id);
    $scope.restaurant = $firebaseObject(ref);

    if(res.rows.length > 0) {

      for(var i = 0; i < res.rows.length; i++) {
        order.push({
          "id" : res.rows.item(i).menu_id,
          "image" : res.rows.item(i).image,
          "service" : res.rows.item(i).service,
          "description" : res.rows.item(i).description,
          "quantity" : res.rows.item(i).quantity,
          "price" : res.rows.item(i).price,
          "rest_id": res.rows.item(i).rest_id,
          "addr_id": res.rows.item(i).addr_id,
          "order_number": res.rows.item(i).order_number,
          "nit": res.rows.item(i).nit,
          "inv_name": res.rows.item(i).inv_name,
          "date": res.rows.item(i).date
        });
      };
      $scope.orderList = order;
      for (var i = 0; i < $scope.orderList.length; i++) { 
       $scope.cantidad  = $scope.cantidad   + Number($scope.orderList[i].quantity);
       $scope.total = $scope.total  + Number($scope.orderList[i].quantity)*Number($scope.orderList[i].price);
     };
    
     var query2 = "SELECT * FROM shippingaddress WHERE id = ?";
     $cordovaSQLite.execute(db, query2, [res.rows.item(0).addr_id]).then(function(resaddr) {
      // Get address data
      address.push({
      "street" : resaddr.rows.item(0).street,
      "refStreet1" : resaddr.rows.item(0).refStreet1,
      "refStreet2" : resaddr.rows.item(0).refStreet2,
      "number" : resaddr.rows.item(0).number,
      "refPhone" : resaddr.rows.item(0).refPhone,
      "latitude": resaddr.rows.item(0).lat,
      "longitude": resaddr.rows.item(0).long
       });
      $scope.addressData = address;

    }, function (err) {
     var alertPopup = $ionicPopup.alert({
       title: 'Atención',
       template: 'Error al obtener dirección registrada',
       okText: 'Aceptar',
       okType: 'button-assertive'});
   });

   } else {
     alert("No hay ordenes de pedido registrdas");
     return false;
   }

 }, function (err) {
     var alertPopup = $ionicPopup.alert({
     title: 'Atención',
     template: 'Error al obtener ordenes de pedido',
     okText: 'Aceptar',
     okType: 'button-assertive'});
});

})





//**********************************************************************
//4. Products confirm selection controller user interface
//   orderComplete.html
//**********************************************************************

.controller('orderCompleteCtrl', function($scope, $ionicPopup, $window, $rootScope, $stateParams, $state, $ionicHistory) {
  $scope.orderNumber = $stateParams.orderNumber;
  $scope.quit = function() {

    $ionicHistory.nextViewOptions({
      disableBack: true
    });
    $state.go('app.shippingAddressClean');
    
  }

})

//**********************************************************************
//5. Restaurant geolocation in maps controller user interface
//   restaurantMap.html
//**********************************************************************

.controller('restMapCrtl', function($scope, $stateParams, $firebaseObject, $cordovaGeolocation) {

  var ref = new Firebase("https://atucasa.firebaseio.com/"+$stateParams.productId);
  $scope.restaurant = $firebaseObject(ref);
  var myLatlng = new google.maps.LatLng(-17.37, -66.15);
  var mapOptions = {
    center: myLatlng,
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("rest_map"), mapOptions);
  $scope.restaurant.$loaded().then(function () {
    map.setCenter(new google.maps.LatLng($scope.restaurant.lat, $scope.restaurant.long));
    var infowindow = new google.maps.InfoWindow();
    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng($scope.restaurant.lat, $scope.restaurant.long);
    geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[1]) {
          map.setZoom(16);
          marker = new google.maps.Marker({
            position: latlng,
            title:  $scope.restaurant.name,
            map: map,
            animation: google.maps.Animation.BOUNCE,
            options: { draggable: false }
          });
          infowindow.setContent(results[0].formatted_address);
          infowindow.open(map, marker);
        } else {
          alert('No se encontro dirección');
        }
      } else {
        alert('Geocoder failed due to: ' + status);
      }
    });
  });
  var infowindow2 = new google.maps.InfoWindow();
  var marker2 = new google.maps.Marker({
    position: new google.maps.LatLng($scope.restaurant.lat, $scope.restaurant.long),
    map: map,
    title:  "Mi ubicación"
  });
  infowindow2.setContent("Mi ubicación");
  infowindow2.open(map, marker2);

  var posOptions = {timeout: 10000, enableHighAccuracy: false};

  $cordovaGeolocation
  .getCurrentPosition(posOptions)
  .then(function (position) {
   $scope.lat = position.coords.latitude
   marker2.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
 }, function(err) {
   alert("Error al acceder a maps");
 });

})

//**********************************************************************
//5. Shipping Address controller user interface
//   shipingAddress.html
//**********************************************************************

.controller('shippingAddressCtrl',function($scope, $rootScope, $ionicPopup, $window, $cordovaSQLite, $state, $stateParams) {

  var aux_street = $stateParams.mainStreet;
  var v_latitude = $stateParams.lat;
  var v_longitude = $stateParams.long;
  
  if(aux_street==":mainStreet"){
    aux_street ="";
  }

  $scope.addressForm = {
    street: aux_street,
    number: "",
    refPhone: "",
    latitude: v_latitude,
    longitude: v_longitude
  };


  $scope.validateAddress = function() {

    var street = $scope.addressForm.street;
    var number = $scope.addressForm.number;
    var refPhone = $scope.addressForm.refPhone;

    if (!street || !number || !refPhone) {
     var alertPopup = $ionicPopup.alert({
       title: 'Atención',
       template: 'Por favor ingrese los datos obligatorios: Calle/Avenida, # domicilio, Teléfono referencia',
       okText: 'Aceptar',
       okType: 'button-assertive'});
     return false;
   };

   return true;  
 }

 $scope.insertAddress = function() {
  var street = $scope.addressForm.street;
  var number = $scope.addressForm.number;
  var refStreet1 = $scope.addressForm.refStreet1;
  var refStreet2 = $scope.addressForm.refStreet2;
  var building = $scope.addressForm.building;
  var refPhone = $scope.addressForm.refPhone;
  var latitude = $scope.addressForm.latitude;
  var longitude = $scope.addressForm.longitude;


  var query = "INSERT INTO shippingaddress (street, number, refStreet1, refStreet2, building, refPhone, lat, long) VALUES (?,?,?,?,?,?,?,?)";
  $cordovaSQLite.execute(db, query, [street, number, refStreet1, refStreet2, building, refPhone, latitude, longitude]).then(function(res) {
   $state.go('app.restaurantList',{addressId: res.insertId});
 }, function (err) {
  var alertPopup = $ionicPopup.alert({
   title: 'Atención',
   template: 'No se pudo registrar su dirección, intente nuevamente',
   okText: 'Aceptar',
   okType: 'button-assertive'});
});
}

$scope.saveAddress = function() {
 if ($scope.validateAddress()) {
   $scope.insertAddress(); 
 }
}  

})

//**********************************************************************
//6. User address list controller user interface
//   addressList.html
//**********************************************************************

.controller('addressListCtrl',function($scope, $cordovaSQLite) {

  $scope.listCanSwipe = true;
  $scope.addressList = [];
  //$scope.addressList = AddressService.all();
  
  var query = "SELECT * FROM shippingaddress ORDER BY id";
  $cordovaSQLite.execute(db, query, []).then(function(res) {
    if(res.rows.length > 0) {

      for(var i = 0; i < res.rows.length; i++) {
        $scope.addressList.push({
          "id": res.rows.item(i).id,
          "street" : res.rows.item(i).street,
          "number" : res.rows.item(i).number,
          "refStreet1" : res.rows.item(i).refStreet1,
          "refStreet2" : res.rows.item(i).refStreet2,
          "building" : res.rows.item(i).building,
          "refPhone" : res.rows.item(i).refPhone,
          "latitude": res.rows.item(i).lat,
          "longitude": res.rows.item(i).long
        });
      }
    } else {
      var alertPopup = $ionicPopup.alert({
       title: 'Atención',
       template: 'No se dispone direcciones registradas',
       okText: 'Aceptar',
       okType: 'button-assertive'});
    }
  }, function (err) {
    alert("Error al obtener direcciones registradas");
  });

  $scope.delete = function(output,index) {
    var query = "DELETE FROM shippingaddress WHERE id = ?";
    $cordovaSQLite.execute(db, query, [output.id]).then(function(res) {
     $scope.addressList.splice(index, 1);
   }, function (err) {
     var alertPopup = $ionicPopup.alert({
       title: 'Atención',
       template: 'Error al eliminar dirección',
       okText: 'Aceptar',
       okType: 'button-assertive'});
   });

  };

})

//**********************************************************************
//7. User address map location register controller user interface
//   addressMap.html
//**********************************************************************

.controller('addressMapCtrl',function($scope, $ionicLoading, $rootScope, $ionicLoading, Geo, $window, $state) {

  $scope.latitute="";
  $scope.longitude="";

  $scope.confirmMapAddress = function() {
    $scope.paramStreet="";
    Geo.reverseGeocode($scope.latitute,$scope.longitude).then(function(parts){
      $state.go('app.shippingAddress',{mainStreet: parts[0], lat:$scope.latitute, long:$scope.longitude});
    },function(){
     var alertPopup = $ionicPopup.alert({
       title: 'Atención',
       template: 'Error obteniendo datos del mapa',
       okText: 'Aceptar',
       okType: 'button-assertive'});
     $state.go('app.shippingAddressClean');
   });

  }  

  $scope.initialise = function () {
    var myLatlng = new google.maps.LatLng(-17.37, -66.15);
    var mapOptions = {
      center: myLatlng,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    var infowindow = new google.maps.InfoWindow();
    Geo.getLocation().then(function(pos) {
      $scope.latitute=pos.coords.latitude;
      $scope.longitude=pos.coords.longitude;
      map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      var myLocation = new google.maps.Marker({
        position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
        map: map,
        title: "Mi ubicacion",
        options: { draggable: true }
      });

      google.maps.event.addListener(myLocation, 'dragend', function() {
        $scope.$apply(function(){
          //Stop listening changes
          var pos = myLocation.getPosition();
          $scope.latitute  = pos.A;
          $scope.longitude = pos.F;
       
        });
    });

      infowindow.setContent("Mi ubicación");
      infowindow.open(map, myLocation);




    }, function() { alert ("No se pudo encontrar la ubicacion");});

    $scope.map = map;
  

  

  };
 


  google.maps.event.addDomListener(document.getElementById("map"), 'load', $scope.initialise());




})

//**********************************************************************
//8. User order list controller user interface
//   orderList.html
//**********************************************************************

.controller('orderListCtrl',function($scope, $cordovaSQLite) {

  $scope.listCanSwipe = true;
  $scope.orderList = [];
  //$scope.addressList = AddressService.all();
  
  var query = "SELECT DISTINCT rest_img, rest_name, order_number, date FROM menuorder WHERE order_number IS NOT NULL ORDER BY date DESC";
  $cordovaSQLite.execute(db, query, []).then(function(res) {
    if(res.rows.length > 0) {

      for(var i = 0; i < res.rows.length; i++) {
        $scope.orderList.push({
          "rest_img" : res.rows.item(i).rest_img,
          "rest_name" : res.rows.item(i).rest_name,
          "order_number": res.rows.item(i).order_number,
          "date" : res.rows.item(i).date
        });
      }
    } else {
      var alertPopup = $ionicPopup.alert({
       title: 'Atención',
       template: 'No se dispone ordenes de pedido registradas',
       okText: 'Aceptar',
       okType: 'button-assertive'});
    }
  }, function (err) {
     alert("Error al obtener ordernes de pedido registradas");
  });

  $scope.delete = function(output,index) {
    var query = "DELETE FROM menuorder WHERE order_number = ?";
    $cordovaSQLite.execute(db, query, [output.order_number]).then(function(res) {
    $scope.orderList.splice(index, 1);
   }, function (err) {
     var alertPopup = $ionicPopup.alert({
       title: 'Atención',
       template: 'Error al eliminar el pedido realizado',
       okText: 'Aceptar',
       okType: 'button-assertive'});
   });

  };

})

//**********************************************************************
//9. General login application controler
//   login.html
//**********************************************************************

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    //console.log('Doing login', $scope.loginData);
    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
});
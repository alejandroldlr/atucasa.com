//***********************************************************************
// Atucasa.com
// Diplomado aplicaciones móviles
// Enrique Vargas Flores
// Alejandro López de La Rosa
// Julio - 2015
//***********************************************************************
var appService = angular.module('starter.services', ['ngCordova']);

//************************
//1. Product order service
//************************

appService.factory('menuOrderService', function($cordovaSQLite) {

  var order = [];                  
  var query = "SELECT * FROM menuorder ORDER BY id";
  $cordovaSQLite.execute(db, query, []).then(function(res) {
    if(res.rows.length > 0) {

      for(var i = 0; i < res.rows.length; i++) {
        order.push({
          "id" : res.rows.item(i).menu_id,
          "image" : res.rows.item(i).image,
          "service" : res.rows.item(i).service,
          "description" : res.rows.item(i).description,
          "quantity" : res.rows.item(i).quantity,
          "price" : res.rows.item(i).price
        });
      }
    } else {
      console.log("No results found");
      return false;
    }
  }, function (err) {
    console.error(err);
  });


  return {
    all: function() {
      return order;
    }
  }
});

//**************************
//2. Return geolocation data
//**************************

 appService.factory('Geo', function($q) {
  return {
    reverseGeocode: function(lat, lng) {
      //console.log("GEO FACTORY");
      var q = $q.defer();
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        'latLng': new google.maps.LatLng(lat, lng)
      }, function(results, status) {
         //console.log("status:"+status);
         if (status == google.maps.GeocoderStatus.OK) {
          console.log('formatted_address[0]:', results[0].formatted_address);

          if(results.length > 0) {
            var r = results[0];
            var a, types;
            var parts = [];
            var streetMap;
            var foundStreetAddress = false;
            var foundRoute = false;
            var foundIntersection = false;
            for(var i = 0; i < r.address_components.length; i++) {
              a = r.address_components[i];
              types = a.types;
              for(var j = 0; j < types.length; j++) {
                if(!foundStreetAddress && types[j] == 'street_address') { 
                  foundStreetAddress = true;
                  parts.push(a.long_name);
                  console.log('street_address:', a.long_name);
                } else if(!foundRoute && types[j] == 'route') {
                  foundRoute = true;
                  parts.push(a.long_name);
                  console.log('route', a.long_name);
                }else if(!foundIntersection && types[j] == 'intersection'){
                  foundIntersection = true;
                  parts.push(a.long_name);
                  console.log('intersection', a.long_name);
                }
              }
            }
            console.log('Reverse', parts);
            q.resolve(parts);
          }
        } else {
          console.log('reverse fail', results, status);
          q.reject(results);
        }
      })

return q.promise;
},
getLocation: function() {
      //console.log("Geo.getLocation");
      var q = $q.defer(); 
      navigator.geolocation.getCurrentPosition(function(position) {
        q.resolve(position);
      }, function(error) {
        q.reject(error);
      });

      return q.promise;
    }
  };
});

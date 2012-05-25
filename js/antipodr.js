(function() {
  'use strict';
  
  var getQueryStringVar = function(sVar) {
    return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(sVar).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
  };

  var Antipodr = function() {    
    this.settings = {
      'addressNode': document.getElementById('addr'),
      'submitNode': document.getElementById('submit')
    };
    
    this.originMap = null;
    this.destinationMap = null;
    
    this.initialize();
  };
  
  Antipodr.prototype.initialize = function() {
    var addrQueryStringVar = getQueryStringVar('l');
    
    this.geocoder = new google.maps.Geocoder();
    this.initializeEvents();
  
    if (addrQueryStringVar) {
      document.getElementById('addr').value = addrQueryStringVar.replace(/\+/g, " ");
      this.geolocate(addrQueryStringVar);
    }
  };
  
  Antipodr.prototype.initializeEvents = function() {
    this.settings.addressNode.addEventListener('keydown', this.onAddressChange.bind(this), false);
    this.settings.submitNode.addEventListener('click', this.onSubmitClick.bind(this), false);
  };
  
  Antipodr.prototype.onAddressChange = function(e) {    
    if (e.which === 13) {
      this.geolocate(e.target.value);
    }
  };
  
  Antipodr.prototype.onSubmitClick = function(e) {
    this.geolocate(this.settings.addressNode.value);
  };
  
  Antipodr.prototype.calculateAntipodes = function(lat, lon) {
    if (lon > 0) {
      return [
        lat * -1,
        lon - 180
      ];
    } else {
      return [
        lat * -1,
        lon + 180
      ];
    }
  };
  
  Antipodr.prototype.geolocate = function(addr) {
    this.geocoder.geocode({ 'address': addr }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        var coordinates = results[0].geometry.location;
        var antipode = this.calculateAntipodes(coordinates.lat(), coordinates.lng());
        
        console.log(coordinates.lat(), coordinates.lng());
        console.log(antipode);
        this.drawMap('home_map', this.originMap, coordinates.lat(), coordinates.lng(), this.settings.addressNode.value);
        this.drawMap('dest_map', this.destinationMap, antipode[0], antipode[1], 'The Other Side of the World!');
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    }.bind(this));
  };
  
  Antipodr.prototype.drawMap = function(container, map, lat, lon, title) {
    var latlng = new google.maps.LatLng(lat, lon),
        mapOptions = {
          zoom: 3,
          center: latlng,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };    
    
    map = new google.maps.Map(document.getElementById(container), mapOptions);
    var marker = new google.maps.Marker({
      position: latlng,
      map: map,
      title: title
    });
    document.getElementById(container).style.display = 'block';
  };
  
  var antipodr = new Antipodr();
}());


/*
 * gMapList v1 - jQuery plugin for creating Google Map from an HTML List
 *
 * Copyright (c) 2010 Nicholas G. Maloney, Bentley University
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 *
 */ 
(function($) {
  $.fn.gmaplist = function(gmap, options) {
    this.gmap = gmap; //Instance of the GMap2 Object
    
    //Setup Gmap vars
    this.gmap.setCenter(new GLatLng(0,0), 0);
    this.gmapBounds = new GLatLngBounds();
    this.geocoder = new GClientGeocoder(); //Gclient instance TODO: add error messaging

    //Setup other instance vars  
    this.listElem = this.selector;
    this.waypoints = []; //Stores instance addresses
    this.addresses = []; //Stores addresses to goecode
    
    //Setup default options
    var defaults = {
      delay: 250, //Delay is needed to throttle geocode requests to prevent the dreaded 620 error
      loadingGraphic: 'loader.gif',
      debug: false //Debugging logs the geocoding lookups to the console
    }
    
    this.options = $.extend(defaults, options);    
    
    // Psuedo validate
    // Validate the list container element
    if($(this.selector).length != 1 || $(this.selector)[0].tagName != 'UL') {
      var invalidGMapListElementError = new Error ("gmaplist list container must be a valid UL element.")
      throw invalidGMapListElementError;
    }
    
    // Validate the presence of elements in the address list
    if($(this.listElem + "> li").length == 0) {
      var nullGMapListElementsError = new Error ("gmaplist list container must contain LI elements.")
      throw nullGMapListElementsError;
    }
        
    /**
    * Function for fetching location values from an LI
    **/
    this.getListPoints = function() {
      var _this = this;
      var address = false; //Holds individual addresses
      $(this.listElem  + "> li").each(function() {
        address = $(this).html();
        if(address) {
          _this.addresses.push(address);
        }
      });
    }
    
    this.waypointHandler = function(self) {
      if(self.waypoints.length >= self.addresses.length) {
        self.renderPoints();    
      }
      else {
        self.geoCode(self.addresses[self.waypoints.length]);
      }
    }
    
    /**
     * Function for handling GEOCoding
    **/
    this.geoCode = function(address) {
      var _this = this;
     // this.geocoder.getLocations(address, function(point) {
      this.geocoder.getLatLng(address, function(point) {
        if(_this.options.debug) {
          //Ugh. IE Code
          if(typeof(console) != "undefined") {
            console.log(point);  
          }          
        }
        if(point) {
          _this.waypoints.push(point);
        }
        // Hack for settimeout scoping issue
        var wphandler = function() {
          _this.waypointHandler(_this);
        }
        window.setTimeout(wphandler,_this.options.delay);
      });
    }
    
    /**
     * Function for rendering points
    **/
    this.renderPoints = function() {
     //Iterate through each of the poings and add a marker
     for(i in this.waypoints) {
       var point = this.waypoints[i];
       var marker = new GMarker(point);
       this.gmap.addOverlay(marker);
       this.gmapBounds.extend(marker.getPoint());     
     }
     $('#gmaplistLoader').remove(); //Remove Loading Graphic. TODO: make this a unique instance var
     $(this.gmap.getContainer()).show(); //Show Map
     this.gmap.checkResize(); //Fix Size
     this.centerMap(); //Recenter Map
    }

    /**
     * Function for centering a map
    **/
    this.centerMap = function() {
      var _this = this;
      _this.gmap.setZoom(_this.gmap.getBoundsZoomLevel(_this.gmapBounds));
      _this.gmap.setCenter(_this.gmapBounds.getCenter());
    }
    
    /**
     * Helper function for adding loading graphic
    **/
    this.addLoadingGraphic = function() {
      //TODO: make this a "real" DOM element
      var imgOutput = "<img src=\"" + this.options.loadingGraphic + "\" id=\"gmaplistLoader\">";
      $(this.gmap.getContainer()).after(imgOutput);
    }
    
    /**
     * Function for running plugin
    **/
    this.init = function() {
      $(this.gmap.getContainer()).hide(); //Hide the map
      this.addLoadingGraphic(); //Add Loading Graphic
      this.getListPoints(); //Grab all the points
      this.waypointHandler(this); //Geocode and add to map
    }

    //Fire off this bad Larry!
    this.init();    
  }  
}) (jQuery);
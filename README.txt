# JQuery Google Maps List

** Overview **

This plugin generates a Google Map from an HTML list. It performs a geocoding lookup on each of the <li>'s and adds the resulting point to the map. Because each element requires a geocode lookup, lists with many elements may take a while to render. A loading animation is displayed while the points are being looked up.

It was developed to be simple and require no dependencies, aside from Google Maps. Because of the overhead required for looking up each address this plugin is not suitable for large data sets. The optimal size seems to be about ~10.

** Basic Usage **

(as reference only. See example1.html for functional code)

//The Script takes a GMap2 instance as an argument. I chose not to have the plugin generate the GMap2 object to allow for more flexibility in customizing the map.
<script>
  gmap = new GMap2(document.getElementById('map'));
  gmap.setCenter(new GLatLng(0, 0), 13);
  $('#newEngland').gmaplist(gmap);
</script>
  
  <div id="map" style="display:none"></div>    
  <ul id="newEngland">
    <li>Connecticut</li>
    <li>Maine</li>
    <li>Massachusetts></li>
    <li>New Hampshire</li>
    <li>Rhode Island</li>
    <li>Vermont</li>
  </ul>
  
** Options **
The plugin accepts an options object. The following variables are accepted:

- delay: The lookup delay in milliseconds. 
    Geocoding lookups need to be throttled to prevent 602 errors. The default value of 100ms is typically good enough.

- loadingGraphic: Path to a loading graphic
    The map is not displayed until all geocoding has been performed. This option is the path to a loading graphic
    
- debug: Logs some debugging info to the console
    Currently logs each point result from the Google gatLatLng() hook.

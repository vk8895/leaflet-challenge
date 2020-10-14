// Plot all earthquakes worldwide with magnitude > 1 from the previous day

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_day.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + "Earthquake Magnitude: " + feature.properties.mag + "</p>");
}

// Function to size circleMarker on EQ magnitude
function circleMarker(magnitude) {
	return magnitude*2000;
}

// Function to color circleMarker on EQ magnitude
function circleColor(magnitude) {
	
	if (magnitude < 2) {
		return "green"
	}
	
	else if (magnitude < 4) {
		return "blue"
	}
	
	else if (magnitude < 6) {
		return "purple"
	}
	
	else {
		return "red"
	}
}

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.mag*10,
                color: circleColor(feature.properties.mag)
            })

        },
        onEachFeature: onEachFeature
    });
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      0, 0
    ],
    zoom: 2,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

function getColor(color) {
	return color > 6 ? 'red':
		   color > 4 ? 'purple':
		   color > 2 ? 'blue':
		   			   'green';
}	

var legend = L.control({position: 'bottomright'});
	
	legend.onAdd = function(myMap) {
	
		var div = L.DomUtil.create('div','info legend'),
			magnitudes = [0,2,4,6],
			labels = [],
			from, to;
	
		for (var i=0; i < magnitudes.length; i++) {
			from = magnitudes[i];
			to = magnitudes[i+1];
			
			labels.push(
			
				'<i style="background:' + getColor(from + 1) + '"></i> ' +
				from + (to ? '&ndash;' + to : '+'));
	}
	
	div.innerHTML = labels.join('<br>');
	return div;
};

legend.addTo(myMap);
 
}


		
module.exports = () => {};

if (typeof window != 'undefined') {

const Mappedin = require('lib/mappedin-v1.50.1.js');

module.exports = (clientId, clientSecret, venue) => {
var mapView
var venue
var search
var analytics

// For the demo animation
var polygonedLocations = []

// Track which polygon belongs to which location
var locationsByPolygon = {}

var mapList = document.getElementById("mapList")
var mapsSortedByElevation = []
var div = document.getElementById( 'mapView' )
var mapExpanded = false

// This is your main function. It talks to the mappedin API and sets everything up for you
function init() {

		Mappedin.initialize({
			// Options for the MapView constructor
			mapview: {
				antialias: "AUTO",
				mode: Mappedin.modes.TEST,
				onFirstMapLoaded: function () {
					console.log("First map fully loaded. No more pop in.");
				},
				onDataLoaded: function() {
					console.log("3D data loaded, map usable. Could hide loading screen here, but things will be popping in. Now you can do things that interact with the 3D scene")
					onDataLoaded()
				}
			},
			// options for Mappedin.getVenue
			// You will need to customize this with the data provided by Mappedin. Ask your representative if you don't have a key, secret, and slug.
			venue: {
				baseUrl: "https://apiv1.mappedin.com/1/",
				clientId: clientId,
				clientSecret: clientSecret,
				perspective: "Website",
				things: {
					venue: ['slug', 'name'],
					locations: ['name', 'type', 'description', 'icon', 'logo', 'sortOrder'],
					categories: ['name'],
					maps: ['name', 'elevation', 'shortName']
				},
				venue: venue,
			},
			// Options for search
			search: {
				key: "",
				secret: ""
			}
		}, div).then(function (data) {
			mapView = data.mapview
			venue = data.venue
			search = data.search
			analytics = data.analytics

		},function (error) {
			window.alert("Mappedin " + error)
		});
}

function onPolygonClicked (polygonId) {
	mapView.removeAllMarkers();
	mapView.clearAllPolygonColors()
	mapView.setPolygonColor(polygonId, mapView.colors.select)
	mapView.focusOnPolygon(polygonId, true)
	console.log(polygonId + " clicked")
	var location = locationsByPolygon[polygonId]
	if (location != null) {
		console.log(location.name + " was selected.", location)
		analytics.locationSelected(location)
	}
	let logo = '';
	if (location.logo && location.logo.original) logo = location.logo.original;
	let categoryBlock = '';
	if (location.categories[0] && venue._categoriesById[location.categories[0]] && venue._categoriesById[location.categories[0]].name) categoryBlock = `<div class='category'>↳<span class='label'>${venue._categoriesById[location.categories[0]].name}</span></div>`;
	var marker = mapView.createMarker(`<div class='logo-container container'><img class='logo' src='${logo}'/></div><div class='info-container container'><div class='location'><span class='label'>${location.name}</span></div>${categoryBlock}<div class='button-container container'><button class='directions'>Get Directions</button></div></div>`, mapView.getPositionPolygon(polygonId), 'marker');
	console.log('marker', marker);
	document.querySelector('.marker .button-container .directions').onclick = () => {
		mapView.removeAllMarkers();
		mapView.drawPath(location.nodes[0].directionsTo());
	};
	return false
}

function onNothingClicked() {
	console.log("onNothingClicked")
	// TODO: remove markers if there are any, iff there AREN'T, clear polygon colours
	mapView.removeAllMarkers();
	mapView.clearAllPolygonColors()
}

// Changes the map and updates the Map List
function setMap(map) {
	mapList.selectedIndex = mapList.namedItem(map).index
	mapView.setMap(map)
}

// Changes the map in response to a Map List selection
function changeMap() {
	mapView.setMap(mapList.value, function () {
		console.log("Map changed to " + mapList.value)
	})
}

// Convenience function to help us get random array items
function getRandomInArray(array) {
	return array[Math.floor(Math.random() * array.length)]
}

// Returns list of maps used in directions, sorted by elevation
function getMapsInJourney(directions) {
	var uniqueMapHash = {}
	directions.instructions.forEach((direction) => {
		uniqueMapHash[direction.node.map] = true
	})
	var mapIds = new Array();
	for (var key in uniqueMapHash) {
	  mapIds.push(key);
	}
	var sortedMapIds = mapsSortedByElevation.filter(map => mapIds.indexOf(map.id) !== -1)
	return sortedMapIds
}


// Draws a random path (single or multi floor), highlighting the locations and focusing on the path and polygons
// Draws another random path after 9000 ms
function drawRandomPath() {
	var startLocation = getRandomInArray(polygonedLocations)
	var startPolygon = getRandomInArray(startLocation.polygons)
	var startNode = getRandomInArray(startPolygon.entrances)

	var endLocation = getRandomInArray(polygonedLocations)
	var endPolygon = getRandomInArray(endLocation.polygons)
	var endNode = getRandomInArray(endPolygon.entrances)

	//Options for drawing paths
	var pathOptions = {
		drawConnectionSegigments: true,
		connectionPathOptions: {
			color: mapView.colors.path
		}
	};

	var expandOptions = {
		focus: true,
		rotation: 0,
		duration: 600
	};

	// Some polygons don't have entrance nodes, need to check before getting directions
	if (startNode != null && endNode != null) {
		startNode.directionsTo(endNode, { accessible: false, directionsProvider: "offline" }, function(error, directions) {
			if (error || directions.path.length == 0) {
				drawRandomPath()
				return
			}

			mapView.clearAllPolygonColors()
			if (mapView.navigator.overviewVisible === true) {
				mapView.navigator.hideOverview()
			}

			mapView.setPolygonColor(startPolygon, mapView.colors.path)
			mapView.setPolygonColor(endPolygon, mapView.colors.select)

			try {
				mapView.navigator.setScale(1);
				mapView.navigator.showOverview(directions, {pathOptions, expandOptions})
					.catch(e => console.error(e))
			} catch (e) {
				console.error(e)
			}

		new Promise((resolve) => setTimeout(resolve, 9000))
			.then(() => {
				drawRandomPath()
			})
			.catch(e => {console.log(e)})
		})
	} else {
		drawRandomPath()
	}
}

function onDataLoaded() {

	mapView.onPolygonClicked = onPolygonClicked
	mapView.onNothingClicked = onNothingClicked
	var locations = venue.locations;
	for (var j = 0, jLen = locations.length; j < jLen; ++j) {
		var location = locations[j];

		if (location.polygons.length > 0) {
			polygonedLocations.push(location)
		}

		var locationPolygons = location.polygons;
		for (var k = 0, kLen = locationPolygons.length; k < kLen; ++k) {
			var polygon = locationPolygons[k];
			mapView.addInteractivePolygon(polygon)

			// A polygon may be attached to more than one location. If that is the case for your venue,
			// you will need some way of determinng which is the "primary" location when it's clicked on.
			var oldLocation = locationsByPolygon[polygon.id]
			if (oldLocation == null || oldLocation.sortOrder > location.sortOrder) {
				locationsByPolygon[polygon.id] = location
			}
		}
	}
	var maps = venue.maps;
	for (var m = 0, mLen = maps.length; m < mLen; ++m) {
		var map = maps[m];
		var mapId = map.id;
		var item = document.createElement("option")
		item.text = map.shortName
		item.value = map.id
		item.id = map.id
		if (mapId == mapView.currentMap) {
			item.selected = true
		}
		mapList.add(item)
	}
	mapsSortedByElevation = venue.maps.sort((a, b) => b.elevation - a.elevation);

	mapView.labelAllLocations({
		excludeTypes: [] // If there are certain Location types you don't want to have labels (like amenities), exclude them here)
	})

	// Shows off the pathing
	//drawRandomPath()
}

// Start up the mapview

// Uncomment the service worker stuff for an offline fallback. Only works on very modern browsers, but it should fail gracefully.
// This uses the Service Workers API, and relies on the fact that the MapView downloads everything it needs ahead of time.
// Directions, search, and analytics will not function offline, and any images from the Mappedin platform (logos, etc)
// that aren't baked into the map will not be downloaded automatically, you should make sure you do that in init.
// This is really for a kiosk type application.

// if ('serviceWorker' in navigator) {
// 	window.addEventListener('load', function() {
// 		navigator.serviceWorker.register('service-worker.js').then(function(registration) {
// 			// Registration was successful
//     	  	console.log('ServiceWorker registration successful with scope: ', registration.scope);
//       		init();
// 		}).catch(function(err) {
// 			// registration failed :(
// 			console.log('ServiceWorker registration failed: ', err);
// 			init();
// 		});
// 	})
// } else {
	// Otherwise, just init
	init();
// }

mapList.addEventListener("change", changeMap)
};
}

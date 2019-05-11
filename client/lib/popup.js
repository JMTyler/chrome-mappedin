
module.exports = async (mapViewRef, mapListRef, clientId, clientSecret, venueSlug) => {
	if (typeof window == 'undefined') return;

	// TODO: Should be able to switch to @mappedin/mappedin-js, yes?
	const Mappedin = require('lib/mappedin-v1.50.1.js');

	let mapView;
	let venue;
	let search;
	let analytics;

	const options = {
		mapview: {
			antialias: 'AUTO',
			mode: Mappedin.modes.TEST,
			onFirstMapLoaded() {
				console.log('First map fully loaded. No more pop in.');
			},
			onDataLoaded() {
				console.log('3D data loaded, map usable. Could hide loading screen here, but things will be popping in. Now you can do things that interact with the 3D scene', arguments);

				// For the demo animation
				const polygonedLocations = [];

				// Track which polygon belongs to which location
				const locationsByPolygon = {};

				const locations = venue.locations;
				for (let j = 0, jLen = locations.length; j < jLen; ++j) {
					const location = locations[j];

					if (location.polygons.length > 0) {
						polygonedLocations.push(location);
					}

					const locationPolygons = location.polygons;
					for (let k = 0, kLen = locationPolygons.length; k < kLen; ++k) {
						const polygon = locationPolygons[k];
						mapView.addInteractivePolygon(polygon);

						// A polygon may be attached to more than one location. If that is the case for your venue,
						// you will need some way of determinng which is the "primary" location when it's clicked on.
						const oldLocation = locationsByPolygon[polygon.id];
						if (oldLocation == null || oldLocation.sortOrder > location.sortOrder) {
							locationsByPolygon[polygon.id] = location;
						}
					}
				}

				const maps = venue.maps;
				const mapList = mapListRef;
				for (let m = 0, mLen = maps.length; m < mLen; ++m) {
					const map = maps[m];
					const mapId = map.id;
					const item = document.createElement('option');
					item.text = map.shortName;
					item.value = map.id;
					item.id = map.id;
					if (mapId == mapView.currentMap) {
						item.selected = true;
					}
					mapList.add(item);
				}
				mapList.addEventListener('change', () => {
					mapView.setMap(mapList.value, () => {
						console.log('Map changed to ' + mapList.value);
					});
				});

				mapView.labelAllLocations({
					excludeTypes: [], // If there are certain Location types you don't want to have labels (like amenities), exclude them here)
				});

				mapView.onPolygonClicked = (polygonId) => {
					mapView.removeAllMarkers();
					mapView.clearAllPolygonColors();
					mapView.setPolygonColor(polygonId, mapView.colors.select);
					mapView.focusOnPolygon(polygonId, true);
					console.log(polygonId + ' clicked');
					const location = locationsByPolygon[polygonId];
					if (location != null) {
						console.log(location.name + ' was selected.', location);
						analytics.locationSelected(location);
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
					return false;
				};

				mapView.onNothingClicked = () => {
					console.log('onNothingClicked');
					// TODO: remove markers if there are any, iff there AREN'T, clear polygon colours
					mapView.removeAllMarkers();
					mapView.clearAllPolygonColors();
				};

				// Shows off the pathing
				// Draws a random path (single or multi floor), highlighting the locations and focusing on the path and polygons
				// Draws another random path after 9000 ms
				const drawRandomPath = () => {
					try {
						const getRandomInArray = (array) => {
							return array[Math.floor(Math.random() * array.length)];
						};

						const startLocation = getRandomInArray(polygonedLocations);
						const startPolygon = getRandomInArray(startLocation.polygons);
						const startNode = getRandomInArray(startPolygon.entrances);

						const endLocation = getRandomInArray(polygonedLocations);
						const endPolygon = getRandomInArray(endLocation.polygons);
						const endNode = getRandomInArray(endPolygon.entrances);

						//Options for drawing paths
						const pathOptions = {
							drawConnectionSegigments: true,
							connectionPathOptions: {
								color: mapView.colors.path,
							},
						};

						const expandOptions = {
							focus: true,
							rotation: 0,
							duration: 600,
						};

						// Some polygons don't have entrance nodes, need to check before getting directions
						if (startNode != null && endNode != null) {
							startNode.directionsTo(endNode, { accessible: false, directionsProvider: 'offline' }, (error, directions) => {
								if (error || directions.path.length == 0) {
									drawRandomPath();
									return;
								}

								mapView.clearAllPolygonColors();
								if (mapView.navigator.overviewVisible === true) {
									mapView.navigator.hideOverview();
								}

								mapView.setPolygonColor(startPolygon, mapView.colors.path);
								mapView.setPolygonColor(endPolygon, mapView.colors.select);

								try {
									mapView.navigator.setScale(1);
									mapView.navigator.showOverview(directions, { pathOptions, expandOptions })
										.catch(console.error);
								} catch (e) {
									console.error(e);
								}

								setTimeout(drawRandomPath, 9000);
							});
						} else {
							drawRandomPath();
						}
					} catch (err) {
						console.error(err);
					}
				};
				// drawRandomPath();
			},
		},
		venue: {
			baseUrl: 'https://apiv1.mappedin.com/1/',
			clientId: clientId,
			clientSecret: clientSecret,
			perspective: 'Website',
			things: {
				venue: ['slug', 'name'],
				locations: ['name', 'type', 'description', 'icon', 'logo', 'sortOrder'],
				categories: ['name'],
				maps: ['name', 'elevation', 'shortName'],
			},
			venue: venueSlug,
		},
		search: {
			key: '',
			secret: '',
		}
	};

	try {
		const data = await Mappedin.initialize(options, mapViewRef);

		mapView = data.mapview;
		venue = data.venue;
		search = data.search;
		analytics = data.analytics;
	} catch (err) {
		alert('Mappedin ' + err);
		return;
	}
};

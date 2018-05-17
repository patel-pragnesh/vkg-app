var map, bookmarks;
	  var geocoder;
	  var findTask, findParams;
	  var resultExtent;
	  var ymin = 9999999;
	  var ymax = 0;
	  var xmin = 5555555;
	  var xmax = 0;
	  var featLayer1, featLayer2;
	  var gp;
	  var pointSymbol;

      require([
        "esri/map",
		"esri/SpatialReference",
		"esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/layers/ImageParameters",
		"esri/dijit/OverviewMap",
		"esri/dijit/Geocoder",
		"esri/dijit/BasemapGallery",
		"esri/dijit/Bookmarks", 
		"/javascripts/modules/Map_Book.js", 
		"esri/dijit/HomeButton",
		"esri/geometry/webMercatorUtils",
		"esri/tasks/ProjectParameters",
		"esri/tasks/FindTask",
		"esri/tasks/FindParameters",
		"esri/symbols/SimpleFillSymbol",
		"esri/symbols/SimpleLineSymbol",
		"esri/symbols/SimpleMarkerSymbol",
		"esri/tasks/Geoprocessor",
		"esri/symbols/Font",
		"esri/symbols/TextSymbol",
		"esri/tasks/IdentifyTask",
		"esri/tasks/IdentifyParameters",
		"esri/graphicsUtils",
		"esri/graphic",
		"esri/geometry/Polygon",
		"esri/InfoTemplate",
		"esri/dijit/Popup",
		"dojo/_base/array",
		"esri/Color",
		"dojo/dom-construct",
		"dojo/_base/connect",
		"dojo/dom", 
		"dojo/parser",
		"dojo/on", 
		"dojo/_base/Color",
        "dojo/_base/json",
        "esri/config",
        "esri/request",
        "esri/layers/FeatureLayer",
		"esri/dijit/InfoWindow",
		"esri/tasks/query",
        "dijit/registry",
		"dojo/domReady!",
		"dijit/layout/BorderContainer",
		"dijit/layout/ContentPane",
        "dijit/form/HorizontalSlider",
        "dijit/form/HorizontalRuleLabels"

      ], function (
        Map, SpatialReference, ArcGISDynamicMapServiceLayer, ImageParameters, OverviewMap, Geocoder, BasemapGallery, Bookmarks, modBookmarks, HomeButton, webMercatorUtils, ProjectParameters, FindTask, FindParameters, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, Geoprocessor, Font, TextSymbol, IdentifyTask, IdentifyParameters, graphicsUtils, Graphic, Polygon, InfoTemplate, Popup, arrayUtils, esri_Color, domConstruct, connect, dom, parser, on, Color, dojoJson, esriConfig, esriRequest, FeatureLayer, InfoWindow, Query, registry) {

		esriConfig.defaults.io.corsEnabledServers.push("tasks.arcgisonline.com");
//		esriConfig.defaults.io.proxyUrl = "/proxy";
//		esriConfig.defaults.io.alwaysUseProxy = false;

//		parser.parse();
		var identifyTask, identifyParams;

		var popup = new Popup({
		  fillSymbol: new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
			new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
			  new esri_Color([255, 0, 0]), 2), new esri_Color([255, 255, 0, 0.25]))
		}, domConstruct.create("div"));

		var infoWindow = new InfoWindow({}, domConstruct.create("div"));
		infoWindow.startup();

		map = new Map("map", {
			basemap: "topo",
			center: [20.500, 47.108],
			zoom: 8,
//            infoWindow: popup,
			spatialReference:new esri.SpatialReference({ "wkid": 3857 })	//4326
        });

		//add the overview map           
		esri.bundle.widgets.overviewMap.NLS_drag = "Teljes";
		esri.bundle.widgets.overviewMap.NLS_hide = "Elrejt";
		esri.bundle.widgets.overviewMap.NLS_show = "Mutat";
		esri.bundle.widgets.overviewMap.NLS_maximize = "Maximum";
		esri.bundle.widgets.overviewMap.NLS_restore = "Vissza";

		var overviewMapDijit = new OverviewMap({
			map: map,
			width: 250,
			heigth: 100,
			attachTo: "bottom-left",
			visible: true
		});
		overviewMapDijit.startup();

			//add the basemap gallery, in this case we'll display maps from ArcGIS.com including bing maps
		var basemapGallery = new BasemapGallery({
		  showArcGISBasemaps: true,
		  map: map
		}, "basemapGallery");
		basemapGallery.startup();

		// Create the bookmark widget
		bookmarks = new Bookmarks({
			map: map,
			bookmarks: modBookmarks.list
		}, dom.byId('bookmarks'));

		var home_button = new HomeButton({
			map: map
		}, "HomeButton");
		home_button.startup();

		gp = new Geoprocessor("http://geoportal.vizugy.hu/arcgis/rest/services/Honlap/Linrefpoint/GPServer/Lin_ref_point");

		//wire an event handler for the dojo slider
		map.on("load", mapReady);

		var imageParameters = new ImageParameters();
        imageParameters.format = "PNG32"; //set the image type to PNG24, note default is PNG8.
		imageParameters.layerIds = [0,1,2,3,4,5];
		imageParameters.layerOption = ImageParameters.LAYER_OPTION_SHOW;
		imageParameters.transparent = true;

		var imageParameters1 = new ImageParameters();
        imageParameters1.format = "PNG32"; //set the image type to PNG24, note default is PNG8.
		imageParameters1.layerIds = [6];
		imageParameters1.layerOption = ImageParameters.LAYER_OPTION_SHOW;
		imageParameters1.transparent = true;

		var imageParameters2 = new ImageParameters();
        imageParameters2.format = "PNG32"; //set the image type to PNG24, note default is PNG8.
		imageParameters2.layerIds = [7];
		imageParameters2.layerOption = ImageParameters.LAYER_OPTION_SHOW;
		imageParameters2.transparent = true;

        //Takes a URL to a non cached map service.
        var dynamicMapServiceLayer = new ArcGISDynamicMapServiceLayer("https://geoportal.vizugy.hu/arcgis/rest/services/VKG/VKG_modellteruletek/MapServer", {
          "opacity" : 1,
          "imageParameters" : imageParameters
        });

		featLayer1 = new ArcGISDynamicMapServiceLayer("https://geoportal.vizugy.hu/arcgis/rest/services/VKG/VKG_modellteruletek/MapServer", {
          "opacity" : 0,
          "imageParameters" : imageParameters1
		});

		featLayer2 = new ArcGISDynamicMapServiceLayer("https://geoportal.vizugy.hu/arcgis/rest/services/VKG/VKG_modellteruletek/MapServer", {
          "opacity" : 0,
          "imageParameters" : imageParameters2
		});

		map.addLayers([featLayer1, featLayer2, dynamicMapServiceLayer]);

//        map.addLayer(dynamicMapServiceLayer);
		map.infoWindow.resize(340, 300);
		map.infoWindow.set("anchor", "top");

		dojo.connect(map, "onLoad", function(map) {
			geocoder = new Geocoder({ 
				maxLocations: 10,
				map: map,
				autocomplete: true,
				zoomScale: 8,
				arcgisGeocoder: {
					url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer",
					name: "Esri World Geocoder",
					postfix: "Budapest",
					placeholder:   "Hely keres",
					sourceCountry: "Hungary"
				},
				value: "Budapest" //How do I make this a box for user to type in parcel number?
			},"search");
			geocoder.startup();

			on(registry.byId('sliderOpacity'), 'change', changeOpacity);
			on(registry.byId('sliderOpacity1'), 'change', changeOpacity1);
		});

		var urlObject = esri.urlToObject(document.location.href);
		if (urlObject.query) {
			var markerSymbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_SQUARE, 14, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 1), new dojo.Color([0, 255, 0, 0.25]));
			var lineSymbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,0,0]), 4);
			var polygonSymbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 4), new dojo.Color([255, 255, 0, 0.25]));

			if (urlObject.query.river) {
				queryTask = new esri.tasks.QueryTask("https://geoportal.vizugy.hu/arcgis/rest/services/VKG/VKG_modellteruletek/MapServer/2");
				query = new esri.tasks.Query();
				query.returnGeometry = true;
				query.outFields = ["*"];
				query.where = "VIZFOLYAS = '" + urlObject.query.river + "'";
				query.outSpatialReference = {"wkid": 3857};
				queryTask.execute(query, function(featureSet) {
					if (featureSet.features.length != 0) {
 						map.graphics.clear();
					    var InfoTemplate = new esri.InfoTemplate("Keresett objektum","Neve:" + urlObject.query.river);
					    var attr = {"Neve:":urlObject.query.river};
					    var graphic = featureSet.features[0];
					    graphic.setInfoTemplate(InfoTemplate);
					    graphic.setSymbol(lineSymbol);
					    graphic.setAttributes(attr);

						resultExtent = esri.graphicsExtent(featureSet.features).expand(1);
						if (resultExtent==false) {		// itt direkt nem hasznalom!!....
							if(resultExtent.ymin < ymin) ymin = resultExtent.ymin;
							if(resultExtent.ymax > ymax) ymax = resultExtent.ymax;
							if(resultExtent.xmin < xmin) xmin = resultExtent.xmin;
							if(resultExtent.xmax > xmax) xmax = resultExtent.xmax;
							resultExtent.ymin = ymin - 5000;
							resultExtent.ymax = ymax + 5000;
							resultExtent.xmin = xmin - 5000;
							resultExtent.xmax = xmax + 5000;
						}
						map.setExtent(resultExtent,new esri.SpatialReference({ "wkid": 3857}));
						map.graphics.add(graphic);
					}
				});
			}

			if (urlObject.query.river && urlObject.query.fkm){
				Fkm_re(urlObject.query.river, parseFloat(urlObject.query.fkm));
			}

			if (urlObject.query.river_stat) {
				queryTask = new esri.tasks.QueryTask("https://geoportal.vizugy.hu/arcgis/rest/services/VKG/VKG_modellteruletek/MapServer/0");
				query = new esri.tasks.Query();
				query.returnGeometry = true;
				query.outFields = ["*"];
				query.where = "River_stat_n = " + urlObject.query.river_stat;
				query.outSpatialReference = {"wkid": 3857};
				queryTask.execute(query, function(featureSet) {
					if (featureSet.features.length != 0) {
 						map.graphics.clear();
					    var InfoTemplate = new esri.InfoTemplate("Keresett objektum","Neve:" + urlObject.query.river);
					    var attr = {"Neve:":urlObject.query.river};
					    var graphic = featureSet.features[0];

						graphic.setSymbol(markerSymbol);
					    graphic.setInfoTemplate(InfoTemplate);
					    graphic.setAttributes(attr);

						resultExtent = esri.graphicsExtent(featureSet.features);
						if (resultExtent) {
							if(resultExtent.ymin < ymin) ymin = resultExtent.ymin;
							if(resultExtent.ymax > ymax) ymax = resultExtent.ymax;
							if(resultExtent.xmin < xmin) xmin = resultExtent.xmin;
							if(resultExtent.xmax > xmax) xmax = resultExtent.xmax;
							resultExtent.ymin = ymin - 1000;
							resultExtent.ymax = ymax + 1000;
							resultExtent.xmin = xmin - 1000;
							resultExtent.xmax = xmax + 1000;
						}
						map.setExtent(resultExtent,new esri.SpatialReference({ "wkid": 3857}));
						map.graphics.add(graphic);
					}
				});
			}	  
		}

		function Fkm_re(river, fkm) {
//			alert(river + fkm);
//			map.graphics.clear();
			var params = { "Folyonev": river, "fkm": fkm};
			pointSymbol = new esri.symbol.SimpleMarkerSymbol();
			pointSymbol.setOutline = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 1);
			pointSymbol.setSize(14);
			pointSymbol.setColor(new Color([255, 0, 0, 0.5]));
//			alert("HI");

			gp.submitJob(params, gpJobComplete);
			function gpJobComplete(jobinfo) {
				gp.getResultData(jobinfo.jobId, "kimenet", function (result) {
					var points = result.value.features[0].geometry;
					var point = points.points[0];
					point = new esri.geometry.Point(point[0], point[1], map.spatialReference);
					var graphic = new esri.Graphic(point, pointSymbol);
//			alert("HI1");
					map.graphics.add(graphic);
							map.centerAndZoom(point, 16);
				});
			}
		}

		function showCoordinates(evt) {
			//get mapPoint from event
			//The map is in web mercator - modify the map point to display the results in geographic
			var mp = webMercatorUtils.webMercatorToGeographic(evt.mapPoint);
			//display mouse coordinates
			dojo.byId("info").innerHTML = mp.x.toFixed(3) + ", " + mp.y.toFixed(3);
		}

		function mapReady() {
			map.on("click", executeIdentifyTask);
			//create identify tasks and setup parameters
			identifyTask = new IdentifyTask("https://geoportal.vizugy.hu/arcgis/rest/services/VKG/VKG_modellteruletek/MapServer");
			identifyParams = new IdentifyParameters();
			map.on("mouse-move", showCoordinates);
			map.on("mouse-drag", showCoordinates);
		}

		function changeOpacity(op) {
			var newOp = (op / 100);
			featLayer1.setOpacity(newOp);
		}

		function changeOpacity1(op) {
			var newOp = (op / 100);
			featLayer2.setOpacity(newOp);
		}

		function executeIdentifyTask(event) {
			var layers = map.getLayersVisibleAtScale(map.getScale());
			identifyParams.width = map.width;
			identifyParams.height = map.height;
			identifyParams.geometry = event.mapPoint;
			identifyParams.mapExtent = map.extent;
//			identifyParams.layerIds = [0];
			identifyParams.tolerance = 6;
			identifyParams.returnGeometry = true;
			var deferred = identifyTask
			  .execute(identifyParams)
			  .addCallback(function (response) {
			  // response is an array of identify result objects
			  // Let's return an array of features.
			  return arrayUtils.map(response, function (result) {
					var feature = result.feature;
					var layerName = result.layerName;
					feature.attributes.layerName = layerName;
					var InfTemplate = new InfoTemplate(layerName, feature.attributes.qSpecies);
					feature.setInfoTemplate(InfTemplate);
					return feature;
			  });
			});
			map.infoWindow.setFeatures([deferred]);
			map.infoWindow.show(event.mapPoint);
		}
	});
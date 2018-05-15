var map;
    var geocoder;
    var findTask, findParams;
    var meparid = "";
    var telepules_re = "";
    var graphic1;
    var graphic2;
    var input_kut;
    var obj_id = "";
    var inlat1, inlon1;

      require([
        "esri/map",
    "esri/SpatialReference",
    "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/layers/ImageParameters",
    "esri/dijit/OverviewMap",
    "esri/dijit/Geocoder",
    "esri/dijit/BasemapGallery",
    "esri/dijit/HomeButton",
    "esri/geometry/webMercatorUtils",
    "esri/tasks/ProjectParameters",
    "esri/tasks/FindTask",
    "esri/tasks/FindParameters",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleMarkerSymbol",
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
    "dojo/domReady!",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane"

      ], function (
        Map, SpatialReference, ArcGISDynamicMapServiceLayer, ImageParameters, OverviewMap, Geocoder, BasemapGallery, HomeButton, webMercatorUtils, ProjectParameters, FindTask, FindParameters, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, Font, TextSymbol, IdentifyTask, IdentifyParameters, graphicsUtils, Graphic, Polygon, InfoTemplate, Popup, arrayUtils, esri_Color, domConstruct, connect, dom, parser, on, Color, dojoJson, esriConfig, esriRequest, FeatureLayer, InfoWindow, Query) {

    esriConfig.defaults.io.corsEnabledServers.push("tasks.arcgisonline.com");
//    esriConfig.defaults.io.proxyUrl = "/proxy";
//    esriConfig.defaults.io.alwaysUseProxy = false;

//    parser.parse();
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
      //center: [20.500, 47.108],
      center: [21.110, 48.280],
      // zoom: 8,
      zoom: 9,
//            infoWindow: popup,
      spatialReference:new esri.SpatialReference({ "wkid": 3857 })  //4326
        });

    //add the overview map           
    esri.bundle.widgets.overviewMap.NLS_drag = "Teljes";
    esri.bundle.widgets.overviewMap.NLS_hide = "Elrejt";
    esri.bundle.widgets.overviewMap.NLS_show = "Mutat";
    esri.bundle.widgets.overviewMap.NLS_maximize = "Maximum";
    esri.bundle.widgets.overviewMap.NLS_restore = "Vissza";

    var overviewMapDijit = new OverviewMap({
      map: map,
      width: 150,
      heigth: 50,
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

    var home_button = new HomeButton({
      map: map
    }, "HomeButton");
    home_button.startup();

    //wire an event handler for the dojo slider
    map.on("load", mapReady);

    var imageParameters = new ImageParameters();
        imageParameters.format = "PNG32"; //set the image type to PNG24, note default is PNG8.

        //Takes a URL to a non cached map service.
        var dynamicMapServiceLayer = new ArcGISDynamicMapServiceLayer("https://geoportal.vizugy.hu/arcgis/rest/services/VKG/VKG_modellteruletek/MapServer", {
          "opacity" : 1,
          "imageParameters" : imageParameters
        });

        map.addLayer(dynamicMapServiceLayer);
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
    });

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

    function executeIdentifyTask(event) {
      $("div.profile_info").html('');
      var layers = map.getLayersVisibleAtScale(map.getScale());
      identifyParams.width = map.width;
      identifyParams.height = map.height;
      identifyParams.geometry = event.mapPoint;
      identifyParams.mapExtent = map.extent;
//      identifyParams.layerIds = [0];
      identifyParams.tolerance = 6;
      identifyParams.returnGeometry = true;
      var deferred = identifyTask
        .execute(identifyParams)
        .addCallback(function (response) {
        // response is an array of identify result objects
        // Let's return an array of features.
        return arrayUtils.map(response, function (result) {
          var feature = result.feature;
          //console.log(feature.attributes.River_Stat);
          var layerName = result.layerName;
          feature.attributes.layerName = layerName;
          var InfTemplate = new InfoTemplate(layerName, feature.attributes.qSpecies);
          feature.setInfoTemplate(InfTemplate);

          //Profil választó beállítása
          updateProfileSelect(feature.attributes.River_Stat);

          return feature;
        });
      });
      map.infoWindow.setFeatures([deferred]);
      map.infoWindow.show(event.mapPoint);
    }

    $("#map_btn").on("click", function(){
      console.log('Map btn click...');
      // iTaskMap();
    });

    function updateProfileSelect(river_stat){      
      console.log(river_stat);
      console.log(typeof(river_stat));
      var river_stat_float = parseFloat(river_stat).toFixed(1);
      console.log(river_stat_float);

      var dd = document.getElementById('profile');
      //console.log('dd hossz: '+dd.length);
      console.log(dd);
      if(dd){
        var findOption = false;
        for (var i = 0; i < dd.options.length; i++) {
          var option_text_float = parseFloat(dd.options[i].text).toFixed(1);
          if (option_text_float === river_stat_float) {
              dd.selectedIndex = i;
              findOption = true;
              break;
          }
        }
        if(!findOption){
          console.log('Nincs adat a kiválasztott profilhoz...');
          $("div.profile_info").html('Nincs adat a kiválasztott profilhoz.');
        }else{
          $("div.profile_info").html('');
        }
      }else{
        console.log('Nincs profil select...');
      }
      
    }

  });
// require([
//       "esri/Map",
//       "esri/views/MapView",
//       "dojo/domReady!"
//     ], function(Map, MapView) {

//       var map = new Map({
//         basemap: "streets"
//       });

//       var view = new MapView({
//         container: "map",
//         map: map,
//         zoom: 8,
//         center: [20.672682, 47.330135] // longitude, latitude
//       });

//     });
//##############################################################################
// dojo.require("esri.map");
// dojo.require("esri.tasks.query");

// var map;

// function init() {
//   map = new esri.Map("map",{
//     basemap: "streets",
//     center: [20.672682, 47.330135],
//     zoom: 8
//   });
//   //dojo.connect(map, "onLoad", initFunctionality);
// }

// dojo.ready(init);
//##############################################################################
var map;
require([
  "esri/map", 
  "esri/layers/ArcGISDynamicMapServiceLayer",
  "esri/tasks/QueryTask",
  "esri/tasks/query",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/InfoTemplate",
  "dojo/_base/Color",
  "dojo/dom",
  "dojo/on",
  "dojo/domReady!"
  ], function(Map, ArcGISDynamicMapServiceLayer, QueryTask, Query, SimpleMarkerSymbol, InfoTemplate, Color, dom, on) {
    // code to create the map and add a basemap will go here
    map = new Map("map", {
      basemap: "topo",
      center: [20.672682, 47.330135],
      zoom: 8
    });

    var layer = new ArcGISDynamicMapServiceLayer(
    "https://geoportal.vizugy.hu/arcgis/rest/services/KOTIVIZIG/IW_02_02_csatornak_megjelenitese/MapServer");
    map.addLayer(layer);
  });
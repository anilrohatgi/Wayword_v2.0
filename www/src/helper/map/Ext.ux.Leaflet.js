Ext.ux.Leaflet = Ext.extend(Ext.Map, {
	initComponent : function() {
		this.mapOptions = this.mapOptions || {};
		
		this.scroll = false;
		
		if(!(window.L || {}).Map){
			this.html = 'Leaflet API is required';	 
		} else if (this.useCurrentLocation) {
		/*	this.geo = this.geo || new Ext.util.GeoLocation({autoLoad: false});
			this.geo.on({
				locationupdate : this.onGeoUpdate,
				locationerror : this.onGeoError, 
				scope : this
			});*/
		}
	
		Ext.Map.superclass.initComponent.call(this);
				
		this.addEvents ( 
			/**
			 * @event maprender
			 * @param {Ext.Panel} this
			 * @param {google.maps.Map} map The rendered google.map.Map instance
			 */		
			'maprender',
		
			/**
			 * @event centerchange
			 * @param {Ext.Panel} this
			 * @param {google.maps.Map} map The rendered google.map.Map instance
			 * @param {google.maps.LatLong} center The current LatLng center of the map
			 */		
			'centerchange',
			
			/**
			 * @event typechange
			 * @param {Ext.Panel} this
			 * @param {google.maps.Map} map The rendered google.map.Map instance
			 * @param {Number} mapType The current display type of the map
			 */		
			'typechange',
			
			/**
			 * @event zoomchange
			 * @param {Ext.Panel} this
			 * @param {google.maps.Map} map The rendered google.map.Map instance
			 * @param {Number} zoomLevel The current zoom level of the map
			 */		
			'zoomchange',
			'click'
		);
		
		L.DefaultIcon = L.Icon.extend({
			iconUrl		: 'Media/leaflet/marker.png',
			shadowUrl	: 'Media/leaflet/marker-shadow.png',
			iconSize	: new L.Point(25, 41),
			shadowSize	: new L.Point(41, 41),
			iconAnchor	: new L.Point(13, 41),
			popupAnchor	: new L.Point(0, -33)
		});

	},
  
	// @private	   
	onRender : function(container, position) {
		Ext.Map.superclass.onRender.apply(this, arguments);
		this.el.setVisibilityMode(Ext.Element.OFFSETS);		   
	},
	
	 // @private
	afterRender : function() {
		Ext.Map.superclass.afterRender.apply(this, arguments);
		this.renderMap();
	},
	renderMap : function() {
		console.log('map options', this.mapOptions);
		
		var zoomControl = Ext.is.Android ? true : false;
		var el = this.el.dom;
        
        var map = new L.Map(el, {
            zoomControl	: zoomControl,
            trackResize : false
        });
        this.map = map;
        
        this.map.on('click', ActiveSupport.bind(function (e) {
			this.fireEvent('click', this, this.parentView, e);
		}, this));

		Ext.applyIf(this.mapOptions, {
			center		: new L.LatLng(37.381592, -122.135672),
			zoom		: 12,
			follow		: false,
			offlineTiles: false
		});

		if (Ext.isArray(this.mapOptions.center)) {
			this.mapOptions.center = new L.LatLng(this.mapOptions.center[0], this.mapOptions.center[1]);
		}
		
		if (this.mapOptions.offlineTiles) {
			var cloudmadeAttrib = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade';

			var mapLayer = new L.TileLayer("geo_images/{z}/{x}/{y}.png", {
				maxZoom		: 18, 
				attribution	: cloudmadeAttrib
			});
			mapLayer.on('tileerror', function (e) {
				var url = 'http://a.tile.cloudmade.com/10d6be86248443949fd2f2848af24c7f/997/256';

				var fragment = e.url.substr(e.url.indexOf('/' + e.target._map.getZoom() + '/'), e.url.length);
				e.tile.src = url + fragment;
			});
		} else {
			var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/10d6be86248443949fd2f2848af24c7f/997/256/{z}/{x}/{y}.png',
				cloudmadeAttrib = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
				mapLayer = new L.TileLayer(cloudmadeUrl, {maxZoom: 18, attribution: cloudmadeAttrib});
		}
		
		
		map.setView(this.mapOptions.center, this.mapOptions.zoom).addLayer(mapLayer);
	
		if (this.markers) this.addMarkers(map, this.markers);
		geoControl = new L.Control.GeoLocateControl({
			follow	: this.mapOptions.follow,
			log		: this.mapOptions.log
		});
		
		map.addControl(geoControl);
	},
	onResize : function(w, h){
		Ext.Map.superclass.onResize.call(this, w, h);
		if (this.map) {
			if (Ext.is.Android) {
				this.map._onResize.call(this.map);
				this.map.on('invalidateSizeEnd', ActiveSupport.bind(function () {
					this.zoomToMarkers();
				}, this));
			}
		}
	},
	addMarkers : function (map, markers) {
		console.log('markers', markers);
		// find the field in the model that contains the lat long info
	
		
		// Group markers in a different layers based on their locType (if it exists)
		var locType, locTypeName;
		var groups = {};
		markers.data.each(function(item) {
			locType = item.get(this.markers.typeField);
			console.log('type', locType, this.markers.typeField);
			if (locType) {
				if (!groups[locTypeName]) groups[locType] = {
					type	: locType,
					markers	: []
				};
				groups[locType].markers.push(item);
			} else {
				if (!groups.standard) groups.standard = {
					type	: 'standard',
					markers	: []
				};
				groups.standard.markers.push(item);
			}
		}, this);
	
		console.log('groups', groups);
		var gl, info;
		var layers = {};
		var layer_count = 0;
		this.markerList = [];
		for (var group in groups) {
			gl = new L.LayerGroup();
			layer_count++;
			info = groups[group].markers;
			var icon = this._getMarkerIcon(groups[group].type);
			gl.icon = icon.iconUrl;
			for (var i = 0, len = info.length; i < len; i++){
				var position = {
					lat	: info[i].get(this.markers.latField),
					lng	: info[i].get(this.markers.lngField)
				};
                
				if (position.lat && position.lng) {
					var marker = new L.Marker(new L.LatLng(position.lat, position.lng), {
						icon	: icon
					});
					var popup = new L.Popup({
						closeButton	: false
					});
					popup.setContent(info[i].get(this.markers.titleField), ActiveSupport.curry(this.onMarkerClick, info[i]));
					marker._popup = popup;
				
					marker.on('click', marker.openPopup, marker);
					marker.model = info[i];
					this.markerList.push(marker);
					gl.addLayer(marker);
				}
			}
			map.addLayer(gl);
			layers[group] = gl;
			
		}
		if (layer_count > 1) {
			layerControl = new L.Control.LayerControl(undefined, layers);
			map.addControl(layerControl);
			
		}
	//	this.zoomToMarkers();
	},
	zoomToMarkers : function () {
		var bound = new L.LatLngBounds();
		for (var i = 0, len = this.markerList.length; i < len; i++){
			bound.extend(this.markerList[i].getLatLng());
		}
		this.map.setView(bound.getCenter(), this.map.getBoundsZoom(bound));
		
	},
	onMarkerClick : function (marker) {
		console.log('empty marker click');
	},
	getMarkerImage : function (type) {
		return 'Media/leaflet/marker.png';
	},
	_getMarkerIcon : function (type) {
		if (this.markers.iconSize) {
			var w = this.markers.iconSize.w;
			var h = this.markers.iconSize.h;
		} else {
			var w = 25;
			var h = 41;
		}
	
		if (type == 'standard') {
			var mapIcon = L.Icon.extend({
				iconUrl		: this.getMarkerImage(type),
				shadowUrl	: 'Media/leaflet/marker-shadow.png',
				iconSize	: new L.Point(w, h),
				shadowSize	: new L.Point(w * 1.8, h),
				iconAnchor	: new L.Point(13, 41),
				popupAnchor	: new L.Point(0, -33)
			});
		} else {
			// TODO: Let the app override the size
			var mapIcon = L.Icon.extend({
				iconUrl		: this.getMarkerImage(type),
				shadowUrl	: 'Media/leaflet/marker-shadow.png',
				iconSize	: new L.Point(w, h),
				shadowSize	: new L.Point(w * 1.8, h),
				iconAnchor	: new L.Point(13, 41),
				popupAnchor	: new L.Point(0, -33)
			});
		}
		return new mapIcon();
		
	},
	getLocType : function (model) {
		return false;
	},
	selectMarker : function (id) {
		for (var i = 0, len = this.markerList.length; i < len; i++){
			if (this.markerList[i].model.get('id') == id) {
				this.markerList[i].openPopup.call(this.markerList[i]);
			}
		};
	}
});
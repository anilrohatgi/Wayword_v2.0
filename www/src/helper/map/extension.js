
L.Control.GeoLocateControl = L.Class.extend({
	options: {
		follow: false,
	},
	following	: false,
	initialize: function(options) {
		L.Util.setOptions(this, options);
	},
	onAdd: function(map) {
		this._map = map;
		this._container = L.DomUtil.create('div', 'leaflet-control-geo');
		
		this._geoButton = this._createButton(
				'Find Me', 'leaflet-control-geo-icon', this.doAction, this);
	
		this._map.on('locationfound', this.onLocationFound, this);
		this._map.on('locationerror', this.onLocationError, this);

		this._container.appendChild(this._geoButton);
	},
	onLocationError : function (e) {
		if (this.options.log) this.options.log.call(this.options.log, 'error', e);
		Ext.get(this._geoButton).removeCls('processing');
		alert(e.message);
	},
	onLocationFound : function (e) {
		if (this.options.log) this.options.log.call(this.options.log, 'found', {
			message	: e.latlng + ' (a: ' + e.accuracy + ')'
		});

		var radius = e.accuracy / 2;

		var marker = new L.Marker(e.latlng, {
			icon	: new L.DefaultIcon()
		});
		if (this.lastLocation) {
			this._map.removeLayer(this.lastLocation);
		}
		this.lastLocation = marker;
		this._map.addLayer(marker);		
	},
	doAction : function () {
		if (this.options.follow) {
			if (this.following) {
				this.following = false;
				Ext.get(this._geoButton).removeCls('processing');
				this._map.stopLocating();
			} else {
				this.following = true;
				Ext.get(this._geoButton).addCls('processing');
				this._map.locateAndSetView(this._map._zoom, {
					follow	: true
				});
			}
		} else {
			Ext.get(this._geoButton).addCls('processing');
			this._map.locateAndSetView(this._map._zoom);
		}
	},
	getContainer: function() { 
		return this._container; 
	},
	
	getPosition: function() {
		return L.Control.Position.TOP_LEFT;
	},
	
	_createButton: function(title, className, fn, context) {
		var link = document.createElement('a');
		link.href = '#';
		link.title = title;
		link.className = className;

		L.DomEvent.disableClickPropagation(link);
		L.DomEvent.addListener(link, 'click', L.DomEvent.preventDefault);
		L.DomEvent.addListener(link, 'click', fn, context);
		
		return link;
	}
});


L.Popup = L.Class.extend({
	includes: L.Mixin.Events,

	options: {
		minWidth: 50,
		maxWidth: 300,
		autoPan: true,
		closeButton: true,
		offset: new L.Point(-17, -85),
		autoPanPadding: new L.Point(5, 5)
	},

	initialize: function(options) {
		L.Util.setOptions(this, options);
	},

	onAdd: function(map) {
		this._map = map;
		if (!this._container) {
			this._initLayout();
		}
		this._updateContent();

		this._container.style.opacity = '0';

		this._map._panes.popupPane.appendChild(this._container);
		this._map.on('viewreset', this._updatePosition, this);
		if (this._map.options.closePopupOnClick) {
			this._map.on('preclick', this._close, this);
		}
		this._update();

		this._container.style.opacity = '1'; //TODO fix ugly opacity hack

		this._opened = true;
	},

	onRemove: function(map) {
		map._panes.popupPane.removeChild(this._container);
		map.off('viewreset', this._updatePosition, this);
		map.off('click', this._close, this);

		this._container.style.opacity = '0';

		this._opened = false;
	},

	setLatLng: function(latlng) {
		this._latlng = latlng;
		if (this._opened) {
			this._update();
		}
		return this;
	},

	setContent: function(content, callback) {
		this._content = this.createLabel(content, callback);
		if (this._opened) {
			this._update();
		}
		return this;
	},

	_close: function() {
		if (this._opened) {
			this._map.removeLayer(this);
		}
	},

	_initLayout: function() {

		L.DomEvent.disableClickPropagation(this._content);

		this._container = L.DomUtil.create('div','leaflet-popup');
		this._contentNode = L.DomUtil.create('div', 'leaflet-popup-content', this._container);
		/*this._container = L.DomUtil.create('div', 'leaflet-popup');

		if (this.options.closeButton) {
			this._closeButton = L.DomUtil.create('a', 'leaflet-popup-close-button', this._container);
			this._closeButton.href = '#close';
			L.DomEvent.addListener(this._closeButton, 'click', this._onCloseButtonClick, this);
		}

		this._wrapper = L.DomUtil.create('div', 'leaflet-popup-content-wrapper', this._container);
		L.DomEvent.disableClickPropagation(this._wrapper);
		this._contentNode = L.DomUtil.create('div', 'leaflet-popup-content', this._wrapper);

		this._tipContainer = L.DomUtil.create('div', 'leaflet-popup-tip-container', this._container);
		this._tip = L.DomUtil.create('div', 'leaflet-popup-tip', this._tipContainer);*/
	},

	_update: function() {
		this._container.style.visibility = 'hidden';

		this._updateContent();
		this._updateLayout();
		this._updatePosition();

		this._container.style.visibility = '';

		this._adjustPan();
	},

	_updateContent: function() {
		if (!this._content) return;

		if (typeof this._content == 'string') {
			this._contentNode.innerHTML = this._content;
		} else {
			this._contentNode.innerHTML = '';
			this._contentNode.appendChild(this._content);
		}
	},

	_updateLayout: function() {
		this._container.style.width = '';
		this._container.style.whiteSpace = 'nowrap';

		var width = this._container.offsetWidth;

		this._container.style.width = (width > this.options.maxWidth ? this.options.maxWidth : (width < this.options.minWidth ? this.options.minWidth : width ) ) + 'px';
		this._container.style.whiteSpace = '';

		this._containerWidth = this._container.offsetWidth;
	},

	_updatePosition: function() {
		var pos = this._map.latLngToLayerPoint(this._latlng);

		this._containerBottom = -pos.y - this.options.offset.y;

	//		this._containerLeft = pos.x - Math.round(this._containerWidth/2) + this.options.offset.x;
		this._containerLeft = pos.x - Math.round(this._content.width/2) + this.options.offset.x;

		this._container.style.bottom = this._containerBottom + 'px';
		this._container.style.left = this._containerLeft + 'px';
	},

	_adjustPan: function() {
		if (!this.options.autoPan) { return; }

		var containerHeight = this._container.offsetHeight,
			layerPos = new L.Point(
				this._containerLeft,
				-containerHeight - this._containerBottom),
			containerPos = this._map.layerPointToContainerPoint(layerPos),
			adjustOffset = new L.Point(0, 0),
			padding = this.options.autoPanPadding,
			size = this._map.getSize();

		if (containerPos.x < 0) {
			adjustOffset.x = containerPos.x - padding.x;
		}
		if (containerPos.x + this._containerWidth > size.x) {
			adjustOffset.x = containerPos.x + this._containerWidth - size.x + padding.x;
		}
		if (containerPos.y < 0) {
			adjustOffset.y = containerPos.y - padding.y;
		}
		if (containerPos.y + containerHeight > size.y) {
			adjustOffset.y = containerPos.y + containerHeight - size.y + padding.y;
		}

		if (adjustOffset.x || adjustOffset.y) {
			this._map.panBy(adjustOffset);
		}
	},

	_onCloseButtonClick: function(e) {
		this._close();
		L.DomEvent.stop(e);
	},
	createLabel : function (label, arrowFunc) {
		var width = 25;
		var height = 45;


		var drawRect = function(context, x, y, width, height) {
		  var radius = 10;
		  context.beginPath();
		  context.moveTo(x + radius, y);
		  context.lineTo(x + width - radius, y);
		  context.quadraticCurveTo(x + width, y, x + width, y + radius);
		  context.lineTo(x + width, y + height - radius);
		  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
		  context.lineTo(x + radius, y + height);
		  context.quadraticCurveTo(x, y + height, x, y + height - radius);
		  context.lineTo(x, y + radius);
		  context.quadraticCurveTo(x, y, x + radius, y);
		  context.closePath();
		};


		var range = 99;
		var canvas = document.createElement("canvas");
		canvas.height = height;
		canvas.style.cssText = 'position: absolute;';
		canvas.style.cursor = 'pointer';
		canvas.style.zIndex = 1000;
		//canvas.position = 'absolute';
		//canvas.left = 100;

		var context = canvas.getContext("2d");
		context.font = "bold 12pt Arial";
		var textWidth = context.measureText(label);

		var buffer = 50;
		width = textWidth.width + buffer;
		canvas.width = width;


	//	var context = canvas.getContext("2d");


		var grad = context.createLinearGradient(0, 0, 0, height);

		var color0 = 'black';
		grad.addColorStop(0, color0);
		grad.addColorStop(1, '#171717');

		context.fillStyle = grad;
		context.strokeStyle = color0;

		drawRect(context, 0, 0, width, height - 10);



		//context.fill();


		context.fill();
		context.stroke();
		context.textAlign = 'center';
		context.fillStyle = "white";
		context.strokeStyle = "black";

		// Render Label
		context.font = "bold 12pt Arial";
		context.textBaseline	= "top";

	//	var textWidth = context.measureText(label);
		// centre the text.
		context.fillText(label,
			Math.floor((width / 2)) - 15,
			(height) / 2 - 15
		);

		// Add the triangle
		context.beginPath();
		context.moveTo(Math.floor(width / 2) - 10, height - 10);
		context.lineTo(Math.floor(width / 2) + 10, height - 10);
		context.lineTo(Math.floor(width / 2), height);
		context.closePath();
		context.fillStyle = "black";
		context.fill();


		// Now add a more info icon
		context.beginPath();
		context.arc(textWidth.width + buffer - 20, (height - 10)/ 2, 12, 0, 360);
		context.fillStyle = 'white';
	//	context.closePath();
		context.fill();
		context.beginPath();
		context.fillStyle = 'blue';
		grad = context.createLinearGradient(0, 0, 0, 10);

		grad.addColorStop(0, '#669AE4');
		grad.addColorStop(1, '#236ED8');

		context.fillStyle = grad;

		context.arc(textWidth.width + buffer - 20, (height - 10) / 2, 10, 0, 360);
		context.fill();
		// add the arrow
		context.beginPath();
		context.moveTo(textWidth.width + buffer - 22, (height - 10) / 2 - 6);
		context.lineTo(textWidth.width + buffer - 15, (height - 10) / 2);
		context.lineTo(textWidth.width + buffer - 22, (height - 10) / 2 + 6);
		context.strokeStyle = 'white';
		context.lineWidth = 3;
		context.stroke();

		if (typeof arrowFunc != 'undefined') {
			if ('ontouchstart' in document.documentElement) {
				canvas.addEventListener('touchstart', arrowFunc);
			} else {
				canvas.addEventListener('mousedown', arrowFunc);	
			}
		}

		return canvas;
	}

});

L.Control.LayerControl = L.Control.Layers.extend({
	onAdd: function(map) {
		this._map = map;
		this._container = L.DomUtil.create('div', 'leaflet-control-layers');
	
		this._layerButton = this._createButton(
				'Layers', 'leaflet-control-layers-toggle', this.doAction, this);

		this._container.appendChild(this._layerButton);
		this._initLayout();
	},
	_initLayout : function () {
		var items = [];
		for (var i in this._layers) {
			if (this._layers.hasOwnProperty(i)) {
				items.push({
					title		: this._layers[i].name,
					imgName		: this._layers[i].layer.icon || IMG_PATH + 'check-round-green.png',
					visibility	: true, 
					action		: ActiveSupport.curry(function (layer, map, record) {
						var id = L.Util.stamp(layer.layer);
						if (map._layers[id]) {
							map.removeLayer(layer.layer);
							record.set('visibility', false);
						} else {
							map.addLayer(layer.layer);
							record.set('visibility', true);
						}
					}, this._layers[i], this._map)
				});
			}
		}
		Ext.regModel('LayerListItem', {
			fields: [
				{name: 'title', type: 'string'},
				{name: 'action'},
				'visibility', 'imgName'
			]
		});
		var list = new Ext.Panel({
			floating		: true,
			modal			: true,
			centered		: true,
			hideOnMaskTap	: true,
			width			: 240,
			height			: 220,
			items			: [{
				xtype			: 'list',
				store			: new Ext.data.Store({
					model			: 'LayerListItem',
					data			: items,
					proxy			: {
						type			: 'memory'
					}
				}),
				itemTpl			: new Ext.XTemplate(
					'<img width="20" src="{imgName}">', 
					'<span style="margin-left: 10px;<tpl if="visibility==false"> color: #DBDBDB</tpl>">{title}</span>'
				),
				listeners		: {
					selectionchange : function (e, records) {
						if (records[0] !== undefined) {
							record = records[0];
							record.data.action.call(this, record);
						}
						this.getSelectionModel().deselectAll();
					}
				}
			}]
		});
	//	list.list.store.sort('title');
		this.list = list;
	},
	doAction : function () {
		this.list.showBy(this._container);
	},
	_createButton: function(title, className, fn, context) {
		var link = document.createElement('a');
		link.href = '#';
		link.title = title;
		link.className = className;

		L.DomEvent.disableClickPropagation(link);
		L.DomEvent.addListener(link, 'click', L.DomEvent.preventDefault);
		L.DomEvent.addListener(link, 'click', fn, context);
	
		return link;
	},
	addOverlay : function () {
		console.error(E_INFO, 'addOverlay on L.Control.LayerControl is unsupported');
	},
	removeOverlay : function () {
		console.error(E_INFO, 'removeOverlay on L.Control.LayerControl is unsupported');
	},
	_update : function () {
		console.error(E_INFO, '_update on L.Control.LayerControl is unsupported');
	},
	_addItem : function () {
		console.error(E_INFO, '_addItem on L.Control.LayerControl is unsupported');
	},
	_onInputClick : function () {
		console.error(E_INFO, '_onInputClick on L.Control.LayerControl is unsupported');
	},
	_expand : function () {
		console.error(E_INFO, '_expand on L.Control.LayerControl is unsupported');
	},
	_collapse : function () {
		console.error(E_INFO, '_collapse on L.Control.LayerControl is unsupported');
	}
});

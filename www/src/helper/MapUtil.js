
///////////////////////////////////////////////////////////////////////
//                        Map Util Functions
///////////////////////////////////////////////////////////////////////

function MapUtils()
{
    this.create      = CreateLeafletMap;
    this.getMapPanel = GetMapPanel;
    this.center      = CenterMap;
    this.addMarker   = AddLeafletMarker;
    
    this.create();
}

///////////////////////////////////////////////////////////////////////

function CreateLeafletMap()
{
    this.gmap = Ext.create('Ext.Map', 
    {
        hidden : true,
        mapOptions : 
        {
            center : new google.maps.LatLng(MainApp.app.locationUtil.curlat, 
                                            MainApp.app.locationUtil.curlon),  
            zoom : 12,
            mapTypeId : google.maps.MapTypeId.ROADMAP,
            navigationControl: true,
            navigationControlOptions: 
            {
                style: google.maps.NavigationControlStyle.DEFAULT
            }
        },

    });
    
    this.map = Ext.create('Ext.Leaflet', {});
    this.screen = Ext.create('Ext.Panel', 
    {
        flex : 7,
        layout: 'fit',
        items: [this.map],
        
        listeners: 
        {
			painted: function() 
            {
				if (MainApp.app.mapUtil.map)
                {
                    MainApp.app.mapUtil.map.map.invalidateSize(true);
                }
            }
        }
    });

    this.map.renderMap();
}

///////////////////////////////////////////////////////////////////////

function GetMapPanel()
{
    if (this.map && this.screen)
    {
        return this.screen;
    }
    else
    {
        //create the google map to use the places with.
        MainApp.app.mapUtil.create();
        return this.screen;
    }
}

///////////////////////////////////////////////////////////////////////

function CenterMap(lat, lon, zoom)
{
    this.map.map.panTo(new L.LatLng(lat, lon), zoom, true);
    this.gmap.getMap().setCenter(new google.maps.LatLng(lat,lon));
}

///////////////////////////////////////////////////////////////////////

function AddLeafletMarker(lat, lon, data, callback)
{
    var marker = L.marker([lat, lon]);
    marker.addTo(this.map.map).bindPopup(data).openPopup();
    
    if (callback)
    {
        marker.on('click', callback);
    }
}

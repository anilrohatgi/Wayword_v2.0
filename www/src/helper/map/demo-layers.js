
demos.LayerStore = new Ext.data.Store({
    model   : 'Marker',
    data    : [{
        title   : 'Regatta Point',
        lat     : -35.290271,
        lng     : 149.130435,
        type    : 'Restaurant'
    },{
        title   : 'War Memorial',
        lat     : -35.281596,
        lng     : 149.147987,
        type    : 'Monument'
    }]
});

/**
 * This example is the same as the marker version, but 
 * it groups the markers into layers that can be turned 
 * on and off (via a menu control)
 *
 * @author Joel Nation
 **/
demos.Leaflet.layers = new Ext.Panel({
    layout: 'fit',
    items   : [
        new Ext.ux.Leaflet({
            mapOptions  : {
                center          : [-35.2892154, 149.1307269],
                zoom            : 14
            },
            markers         : {
                data            : demos.LayerStore,
                latField        : 'lat',
                lngField        : 'lng',
                titleField      : 'title',
                typeField       : 'type',
                iconSize        : {
                    w               : 32,
                    h               : 37
                }
            },
            getMarkerImage : function (type) {
                if (type == 'Monument') return 'src/demos/leaflet/images/marker-monument.png';
                else if (type == 'Restaurant') return 'src/demos/leaflet/images/marker-restaurant.png';
                else return 'src/demos/leaflet/images/marker.png';
            }
        })
    ]
});

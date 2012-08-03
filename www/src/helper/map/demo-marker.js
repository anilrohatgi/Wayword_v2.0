Ext.regModel('Marker', {
    fields  : ['title', 'lat', 'lng', 'type']
});

/**
 * Our markers are built from here. Provide whatever
 * store you need
 *
 **/
demos.MarkerStore = new Ext.data.Store({
    model   : 'Marker',
    data    : [{
        title   : 'Regatta Point',
        lat     : -35.290271,
        lng     : 149.130435
    },{
        title   : 'War Memorial',
        lat     : -35.281596,
        lng     : 149.147987
    }]
});

/**
 * This example shows how to display markers on the screen.
 * You pass in the field configs below so that the system
 * knows how to read your model. We use our own modified 
 * version of the Sencha model system and thus don't have to 
 * do this, but you will have to. 
 *
 * @author Joel Nation
 **/
demos.Leaflet.markers = new Ext.Panel({
    layout: 'fit',
    items   : [
        new Ext.ux.Leaflet({
            mapOptions  : {
                center          : [-35.2892154, 149.1307269],
                zoom            : 14
            },
            // Our marker data is provided through the markers config object
            markers         : {
                data            : demos.MarkerStore,
                latField        : 'lat', // The name of the field that contains the lat info
                lngField        : 'lng', // The name of the field that contains the lng info
                titleField      : 'title' // The name of the field that contains the title info
            }
        })
    ]
});

/**
 * This example shows how to use offline tiles. This is only
 * useful if you are building the app in phonegap. With this
 * the tiles will be loaded from the geo_images folder (if they
 * can't be found it will attempt to get them off the internet)
 *
 * You can download tiles using your own map server or a service
 * like cloud made. For our applications we generally just grab the 
 * tiles that are in the focus area, and let the system download other
 * tiles if the user is outside that area. 
 **/
demos.Leaflet.offline = new Ext.Panel({
    layout: 'fit',
    items   : [
        new Ext.ux.Leaflet({
            mapOptions  : {
                offlineTiles    : true, // True to ue the tiles saved in /geo_images.
                center          : [-35.2892154, 149.1307269],
                zoom            : 16
            }
        })
    ]
});

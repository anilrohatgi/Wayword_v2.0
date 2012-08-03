/**
 * This example shows the use of continuous geo location
 * The map will continually update with your position until
 * you press the geolocate button again to turn it off
 *
 * @author Joel Nation
 **/
demos.Leaflet.geo = new Ext.Panel({
    layout: 'fit',
    items   : [
        new Ext.ux.Leaflet({
            mapOptions  : {
                follow      : true
            }
        })
    ]
});


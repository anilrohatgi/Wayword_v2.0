/* 
A simple wrapper for Cloudmade Leaflet for use with Sencha Touch 2.

Example usage: 

    Ext.application({
        name: 'Sencha',
        launch: function () {
            var map = Ext.create('Ext.Leaflet', {});
            Ext.create('Ext.Panel', {
                fullscreen: true,
                layout: 'fit',
                items: [map]
            });
        }
    });
*/

Ext.define('Ext.Leaflet', {
    extend: 'Ext.Component',
    map: null,
    config: 
    {
        map: null
    },
    
    constructor: function () 
    {
        this.callParent(arguments);
        this.element.setVisibilityMode(Ext.Element.OFFSETS);
        this.on('painted', this.renderMap, this);
        
        this.map = L.map(this.element.dom).setView([51.505, -0.09], 13);

        //add a CloudMade tile layer with style #997
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
        {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
        }).addTo(this.map);

    },
    
    renderMap: function () 
    {
        if (this.map) 
        {
            return true;
        }
        
    },
    
    onUpdate: function (map, e, options) {
        this.setHtml((options || {}).data);
    },


    onDestroy: function () {
        this.callParent();
    }

}, function () {

});


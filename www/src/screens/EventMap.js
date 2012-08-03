
var form;
var map;

///////////////////////////////////////////////////////////////////////
//                        Event Screen Class
///////////////////////////////////////////////////////////////////////

function EventMap()
{
    //Create event board...
    this.create         = CreateEventMap;
    this.createAutoComp = CreateAutoComplete;
    this.goTo           = GoToEventMap;
    this.addMarker      = LoadNewMarker;
    
    this.ready          = false;
    this.lat            = MainApp.app.locationUtil.curlat, 
    this.lon            = MainApp.app.locationUtil.curlon;
    
    this.screen     = this.create();
 }

///////////////////////////////////////////////////////////////////////
//                        CREATE GUI SCREENS
///////////////////////////////////////////////////////////////////////

function CreateEventMap()
{
    this.backButton =  Ext.create('Ext.Button', 
    { 
        text: 'BACK',
        ui  : 'back',
        handler: function()
        {
            if (MainApp.app.eventMap.back)
            {
                MainApp.app.eventMap.back.goTo(DIR_BACK)
            }
        }
    });
    
    this.localHeader  = new Ext.Toolbar(
    {
        title   : 'MAP',
        docked: 'top',
        layout: 
        {
            pack: 'justify',
            align: 'center'
        },

        defaults:
        {
            iconMask: true,
            xtype:'button',
        },

        items : [this.backButton,
        {
            text : 'OK',
            ui   : 'action',
            handler : function()
            {
                MainApp.app.eventMap.ready = true;
                if (MainApp.app.eventMap.back)
                {
                    MainApp.app.eventMap.back.goTo(DIR_BACK);
                }
            }
        }]
    });
    
    this.searchField = new Ext.field.Text(
    {
        name : 'searchloc',
        placeHolder: 'Search location',
        
        poll : function()
        {
            if (MainApp.app.eventMap.autocomplete)
            {
                if (MainApp.app.eventMap.autocomplete.getPlace())
                {
                    console.log("FOUND PLACE!");
                }
            }
            
            setTimeout(MainApp.app.eventMap.searchField.poll, 1000/50);
        }
    });
    
    this.map = Ext.create('Ext.Map', 
    {
        flex : 7,
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

        listeners: 
        {
            maprender: function(comp, map) 
            {
                setTimeout(function() 
                {
                }, 1000);
            }

        }
    });
    
    var screen = new Ext.Panel(
    {
        fullscreen: true,
        layout: 'vbox',
        
        items: 
        [this.localHeader,
        {
            flex : 1,
            xtype: 'toolbar',
            items:[this.searchField]
        }, 
        this.map],

        listeners:
        {
            activate:function()
            {
                MainApp.app.eventMap.createAutoComp();
            },
        },
    });
    
    return screen;
}

///////////////////////////////////////////////////////////////////////
//                        MAP FUNCTIONS
///////////////////////////////////////////////////////////////////////

function CreateAutoComplete()
{
    var input = document.getElementsByName('searchloc')[0]; 
    this.autocomplete = new google.maps.places.Autocomplete(input);
    this.autocomplete.bindTo('bounds', this.map.getMap());
    
    google.maps.event.addListener(this.autocomplete, 'place_changed', 
    function() 
    {
        var place = MainApp.app.eventMap.autocomplete.getPlace();
        if (place.geometry.viewport) 
        {
            MainApp.app.eventMap.map.getMap().fitBounds(place.geometry.viewport);
        } 
        else 
        {
            MainApp.app.eventMap.map.getMap().setCenter(place.geometry.location);
            MainApp.app.eventMap.map.getMap().setZoom(17);
        }
        
        MainApp.app.eventMap.lat = place.geometry.location.Ya;
        MainApp.app.eventMap.lon = place.geometry.location.Za;
        
        MainApp.app.newEventForm.screen.setValues(
        {
              location : place.name
        });
    });
    
    //MainApp.app.eventMap.searchField.poll();
}

///////////////////////////////////////////////////////////////////////

function LoadNewMarker(data)
{
    if (data)
    {
        //Remove the old maker
        if (this.marker) this.marker.setMap(null);

        //Create marker
        var loc = new google.maps.LatLng(data.data['lat'], data.data['lon']);
        this.marker = new google.maps.Marker(
        {
            position: loc,
            title : data.data['place'],
            map: this.map.getMap()
        });
        
        //Maker listener
        var info = data.data['place'] + ' - ' + data.data['desc'] + '<br \>'
             + data.data['address'];
        
        this.infoPop = new google.maps.InfoWindow(
        {
            content: info
        }),
        
        google.maps.event.addListener(this.marker, 'click', function() 
        {
            MainApp.app.eventMap.infoPop.open(MainApp.app.eventMap.map.getMap(), 
                                              MainApp.app.eventMap.marker);
        });
        
        //Center map
        this.map.setMapCenter(loc);
    }
}

///////////////////////////////////////////////////////////////////////

function GoToEventMap(dir, back, guid)
{
    if (back) this.back = back;
    
    //Get the data for this guid.
    this.guid = guid;
    this.data = MainApp.app.database.eventsNearByStore.findRecord('guid', this.guid, MainApp.app.eventList.index);
    this.addMarker(this.data);
    
    MainApp.app.appLayer.currentLayer.animateActiveItem(this.screen, 
                                                        {type: 'flip', direction: dir});
}
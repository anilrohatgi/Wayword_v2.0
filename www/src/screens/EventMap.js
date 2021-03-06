
var form;
var map;

///////////////////////////////////////////////////////////////////////
//                        Event Screen Class
///////////////////////////////////////////////////////////////////////

function EventMap()
{
    //Create event board...
    this.create         = CreateEventMap;
    this.destroy        = DestroyEventMap;
    this.createAutoComp = CreateAutoComplete;
    this.goTo           = GoToEventMap;
    
    this.search         = SubmitRequest;
    this.clearMarkers   = ClearAllMarkers;
    this.processReqest  = ProcessPlaceRequest;
    
    this.ready          = false;
    this.lat            = MainApp.app.locationUtil.curlat, 
    this.lon            = MainApp.app.locationUtil.curlon;
    
    this.zIndex = 0;
    
    this.screen         = new Ext.Panel(
    {
        layout: 'vbox',
        cls   : 'blankPage',
        hideAnimation: 
        {
            listeners: 
            {
                animationend: function()
                {
                    MainApp.app.eventMap.destroy();
                }
            }
        },
        
        showAnimation: 
        {
            listeners: 
            {
                animationstart: function()
                {
                    MainApp.app.eventMap.create();
                }
            }
        },
    });
 }

///////////////////////////////////////////////////////////////////////
//                        CREATE GUI SCREENS
///////////////////////////////////////////////////////////////////////

function CreateEventMap()
{
    if (this.content) 
    {
        return;
    }
 
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
        html : '<div class="way" >PICK </div><div class="word"> PLACE</div>',
        docked: 'top',
        layout: 
        {
            pack: 'justify',
            align: 'left'
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
        flex    : 7,
    });
    
    this.submitButton = Ext.create('Ext.Button', 
    {
        iconCls : 'search',
        iconMask: true,
        text    : 'Send',
        ui      : 'confirm',
        flex    : 1,
        handler : function()
        {
            MainApp.app.eventMap.search(MainApp.app.eventMap.searchField.getValue(), false);
        }
    });
    
    this.markerArray = [];
    this.infoPop = new google.maps.InfoWindow();
                                
    this.map = MainApp.app.mapUtil.getMapPanel();
    this.gmap = MainApp.app.mapUtil.gmap.getMap();
    
    MainApp.app.mapUtil.center( MainApp.app.locationUtil.curlat, 
                                MainApp.app.locationUtil.curlon ,10);
    
    this.content = new Ext.Panel(
    {
        layout: 'vbox',
        flex : 1,
        
        items: 
        [this.localHeader,
        {
            flex : 1,
            xtype: 'toolbar',
            items:[this.searchField, this.submitButton]
        },
        MainApp.app.mapUtil.screen],

        listeners:
        {
            activate:function()
            {
            }
        },
    });
    
    this.screen.insert(0, this.content);
}

///////////////////////////////////////////////////////////////////////

function DestroyEventMap()
{
    var items = this.screen.getItems();
    
    //Iterate and destroy
    items.each(function(item, index, totalItems)
    {
        //item.destroy();
        this.remove(item, true)
        item = null;
    });
}

///////////////////////////////////////////////////////////////////////
//                        MAP FUNCTIONS
///////////////////////////////////////////////////////////////////////

function CreateAutoComplete()
{
    var input = document.getElementsByName('searchloc')[0]; 
    this.autocomplete = new google.maps.places.Autocomplete(input);
    this.autocomplete.bindTo('bounds', this.gmap.getMap());
    
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
}

///////////////////////////////////////////////////////////////////////

function SubmitRequest(name, useKeyword)
{
    var curLoc = new google.maps.LatLng(MainApp.app.locationUtil.curlat,
                                         MainApp.app.locationUtil.curlon);
    var request = 
    {
        location: curLoc,
        radius: '50000',
        name : name
    };
    
    if (useKeyword)
    {
        request.keyword = name;
    }
    
    this.clearMarkers();

    console.log(this.gmap);
    service = new google.maps.places.PlacesService(this.gmap);
    service.search(request, this.processReqest);
}

///////////////////////////////////////////////////////////////////////

function ClearAllMarkers()
{
    if (this.markerArray)
    {
        for (var i = 0; i < this.markerArray.length; i++ ) 
        {
          this.markerArray[i].setMap(null);
        }
    }
}

///////////////////////////////////////////////////////////////////////

function ProcessPlaceRequest(results, status)
{
    if (status == google.maps.places.PlacesServiceStatus.OK) 
    {
        for (var i = 0; i < results.length; i++) 
        {
            var place = results[i];
            
            var placeLoc = place.geometry.location;
            /*var marker = new google.maps.Marker(
            {
                map: MainApp.app.eventMap.map.getMap(),
                position: place.geometry.location
            });
            
            MainApp.app.eventMap.markerArray.push(marker);

            google.maps.event.addListener(marker, 'click', function() 
            {
                var bubble = place.name;
                MainApp.app.eventMap.infoPop.setContent(bubble);
                MainApp.app.eventMap.infoPop.open(MainApp.app.eventMap.map.getMap(), 
                                                  this);
                
                MainApp.app.eventMap.lat = place.geometry.location.Xa;
                MainApp.app.eventMap.lon = place.geometry.location.Ya;

                MainApp.app.newEventForm.screen.setValues(
                {
                     location : place.name
                });
            });*/
            
            //Create and set the map
            var callback = function() 
            {
                MainApp.app.eventMap.lat = place.geometry.location.Xa;
                MainApp.app.eventMap.lon = place.geometry.location.Ya;

                MainApp.app.newEventForm.screen.setValues(
                {
                     location : place.name
                });
            };

            var info = place.name;
            MainApp.app.mapUtil.addMarker( place.geometry.location.Xa, 
                                           place.geometry.location.Ya ,
                                           info, callback);
        }
    }
    else if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS)
    {
        //Try by keyword
        console.log("trying keyword");
        MainApp.app.eventMap.search(MainApp.app.eventMap.searchField.getValue(), true);
    }
}

///////////////////////////////////////////////////////////////////////

function GoToEventMap(dir, back, guid)
{
    if (back) this.back = back;
    
    //Get the data for this guid.
    this.guid = guid;
    this.data = MainApp.app.database.eventsNearByStore.findRecord('guid', this.guid, MainApp.app.eventList.index);

    if (MainApp.app.appLayer.currentLayer.getActiveItem() != this.screen)
    {
        MainApp.app.appLayer.currentLayer.animateActiveItem(this.screen, 
                                                    {type: 'flip', direction: dir});
    }
}
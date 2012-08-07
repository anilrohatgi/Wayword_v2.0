

///////////////////////////////////////////////////////////////////////
//                        New Event Screen Class
///////////////////////////////////////////////////////////////////////

function EventViewer()
{
    //Create event board...
    this.create    = CreateEventViewer;
    this.viewEvent = ViewEventFromGuid;
    
    this.goTo      = GoToEventViewer;    
    this.screen    = this.create();
}

///////////////////////////////////////////////////////////////////////
//                        CREATE GUI SCREENS
///////////////////////////////////////////////////////////////////////

function CreateEventViewer()
{
    //Header for board
    this.backButton =  Ext.create('Ext.Button', 
    { 
        text: 'BACK',
        ui  : 'back',
        align : 'left',
        handler: function()
        {
            if (MainApp.app.eventViewer.back)
            {
                MainApp.app.eventViewer.back.goTo(DIR_BACK)
            }
        }
    });
    
    this.localHeader  = Ext.create('Ext.TitleBar',
    {
        title   : '',
        docked: 'top',

        defaults:
        {
            iconMask: true,
            xtype:'button',
            align : 'right',
        },

        items : 
        [this.backButton,
        {
            ui: 'action',
            text : 'Make Suggestion!',
            iconCls : "podcast",
            handler: function()
            {
            }
        },
        {
            text : 'Going',
            handler: function()
            {
                MainApp.app.guestList.goTo(DIR_FORW, 
                                          MainApp.app.eventViewer,
                                          MainApp.app.eventViewer.guid);    
            }
        },
        {
            iconCls : "trash",
            handler: function()
            {
                MainApp.app.eventViewer.removeUserEvent(MainApp.app.eventViewer.guid);
                MainApp.app.eventViewer.backButton._handler();
            }
        }]
    });
    
    //////////////////////////////////////////////
    
    var csstemp = '<tpl for=".">';
    csstemp    += '<div class="eventviewer_list_class">';
    csstemp    += '<div class="event_suggestion">';
    csstemp    += '<div class="place">{place}</div>';
    csstemp    += '<div class="date">{date}</div>';
    csstemp    += '</div>';
    csstemp    += '</div>';
    csstemp    += '</tpl>';
    
    this.suggestList = Ext.create('Ext.List', 
    {
        cls        : 'listclass',
        title      : 'Other Suggestions',
        flex       : 4,
                            
        store: MainApp.app.database.suggestStore,
        itemTpl: csstemp,

        listeners:
        {
            itemtap: function(view, index, item, e) 
            {
            }
        }
    });
    
    //////////////////////////////////////////////
    
    this.map = Ext.create('Ext.Map', 
    {
        flex : 1,
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
        }
    });
    
    this.mapHeader =  Ext.create('Ext.TitleBar',
    {
        title   : 'TOP SUGGESTION',
        docked  : 'top',
    });
    
    this.mapFooter =  Ext.create('Ext.TitleBar',
    {
        title   : 'DATE',
        docked  : 'bottom',
    });
    
    this.mapPanel = new Ext.Panel(
    {
        layout  : 'vbox',
        flex    : 4,
        items   : [this.mapHeader, this.map, this.mapFooter],
    });
    
    //////////////////////////////////////////////
    
    this.countFooter =  Ext.create('Ext.TitleBar',
    {
        title   : 'OTHER SUGGESTIONS',
        docked  : 'bottom',
    });
    
    this.countDown = new Ext.Panel(
    {
        html    : 'Time Left To Vote',
        layout  : 'vbox',
        flex    : 1,
        items   : [this.countFooter],
    });

    //////////////////////////////////////////////
    
    var screen = new Ext.Panel(
    {
        layout  : 'card',
        layout  : 'vbox',
        items: [this.localHeader, this.mapPanel, this.countDown, this.suggestList],

        listeners:
        {
            activate:function()
            {
            },
        },
    });
    
    return screen;
}

///////////////////////////////////////////////////////////////////////
//                        GUI EVENT FUNCTIONS
///////////////////////////////////////////////////////////////////////

function ViewEventFromGuid(store, guid)
{
    MainApp.app.database.getEventSuggestions(guid);
    
    var event = store.findRecord('guid', guid);
    this.guid = guid;
    
    if (event)
    {
        //Remove the old maker
        if (this.marker) this.marker.setMap(null);

        //Create marker
        var loc = new google.maps.LatLng(event.data['lat'], event.data['lon']);
        this.marker = new google.maps.Marker(
        {
            position: loc,
            title : event.data['place'],
            map: this.map.getMap()
        });
        
        //Center map
        this.map.setMapCenter(loc);
    }
}

///////////////////////////////////////////////////////////////////////

function GoToEventViewer( dir, back , isEvent)
{
    if (back) this.back = back;
    this.isEvent = isEvent;
    
    MainApp.app.appLayer.currentLayer.animateActiveItem(this.screen, 
                                                        {type: 'slide', direction: dir});
}
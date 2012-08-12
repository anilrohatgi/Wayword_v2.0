

///////////////////////////////////////////////////////////////////////
//                        New Event Screen Class
///////////////////////////////////////////////////////////////////////

function EventViewer()
{
    //Create event board...
    this.create    = CreateEventViewer;
    this.viewEvent = ViewEventFromGuid;
    this.refresh   = RefreshEventView;
    this.tick      = UpdateTimer;
    
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
                console.log(MainApp.app.eventViewer.guid);
                
                MainApp.app.newSuggestMenu.goTo(DIR_FORW, 
                                          MainApp.app.eventViewer,
                                          MainApp.app.eventViewer.guid); 
                
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
    csstemp    += '<div class="event_suggestion">';
    csstemp    += '<place>{place}</place>';
    csstemp    += '<date>{[values.date.toDateString()]}</date>';
    csstemp    += '</div>';
    
    csstemp    += '<div class="event_votebox">';
    csstemp    += '<img src={facethumb} />';
    csstemp    += '</div>';
    
    csstemp    += '<div class="event_suggestion_author">';
    csstemp    += '<img src={creatorthumb} />';
    csstemp    += '</div>';

    csstemp    += '</tpl>';
    
    this.suggestList = Ext.create('Ext.List', 
    {
        cls        : 'listclass',
        title      : 'Other Suggestions',
        flex       :  1,
                            
        store: MainApp.app.database.suggestStore,
        itemTpl: csstemp,

        listeners:
        {
            itemtap: function(view, index, item, e) 
            {
                var record  = view.getStore().getAt(index);
                var guid    = record.get('guid');
                
                MainApp.app.suggestViewer.goTo( DIR_FORW , 
                                                MainApp.app.eventViewer,
                                                guid);
                                              
                MainApp.app.suggestViewer.viewSuggestion(MainApp.app.database.suggestStore, 
                                                         guid);  
            }
        }
    });
    
    this.suggestlistHeader =  Ext.create('Ext.Toolbar',
    {
        ui      : 'subtitle',
        cls     : 'subtitle',
        height  : 30,
        docked  : 'top',
    });
    
    this.suggestlistPanel = new Ext.Panel(
    {
        layout  : 'vbox',
        flex    : 4,
        items   : [this.suggestlistHeader, this.suggestList],
    });
    
    //////////////////////////////////////////////
    
    var loc = new google.maps.LatLng(MainApp.app.locationUtil.curlat, 
                                    MainApp.app.locationUtil.curlon);
    this.map = Ext.create('Ext.Map', 
    {
        flex : 1,
        mapOptions : 
        {
            center : loc,  
            zoom : 12,
            mapTypeId : google.maps.MapTypeId.ROADMAP,
            navigationControl: true,
            navigationControlOptions: 
            {
                style: google.maps.NavigationControlStyle.DEFAULT
            }
        }
    });
    
    this.marker = new google.maps.Marker(
    {
        map: this.map.getMap(),
        position: loc
    });
    
    this.infoPop = new google.maps.InfoWindow();

    this.mapHeader =  Ext.create('Ext.Toolbar',
    {
        ui      : 'subtitle',
        cls     : 'subtitle',
        height  : 30,
        title   : 'TOP SUGGESTION',
        docked  : 'top',
    });
    
    this.mapPanel = new Ext.Panel(
    {
        layout  : 'vbox',
        flex    : 6,
        items   : [this.mapHeader, this.map],
    });

    //////////////////////////////////////////////
    
    var screen = new Ext.Panel(
    {
        layout  : 'card',
        layout  : 'vbox',
        items: [this.localHeader, this.mapPanel, this.suggestlistPanel],

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
    
    var event  = store.findRecord('guid', guid);
    this.guid  = guid;
    this.store = store;
    this.event = event;
    
    if (event)
    {
        //MAP STUFF
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
        
        var placedate = event.data['place'] + '<br />' + event.data['start'].toDateString() + " " + event.data['start'].toLocaleTimeString();
        
        this.infoPop.setContent(placedate);
        this.infoPop.open(this.map.getMap(), this.marker);

        //start ticking
        var task = Ext.create('Ext.util.DelayedTask', function() 
        {
            //server calling method
            this.tick()
            task.delay(10000);
        }, this);
        
        this.timer = task;
        task.delay(0);
        
        /*this.timer = 
        {
            run: function()
            {
                if (!MainApp.app.eventViewer.doCount)
                {
                    MainApp.app.eventViewer.tick();
                }
                else
                {
                    MainApp.app.eventViewer.runner.stop(task);     
                }
            },
            interval: 500 // every 1/2 second
        };
        
        this.runner = new Ext.util.TaskRunner();
        this.runner.start(this.timer);*/
    }
}

///////////////////////////////////////////////////////////////////////

function RefreshEventView()
{
    this.viewEvent(this.store, this.guid);
}

///////////////////////////////////////////////////////////////////////

function UpdateTimer()
{
    var curDate = new Date();
    var expDate = this.event.data['rsvp'];

    var difference = expDate.getTime() - curDate.getTime();
 
    var daysDifference      = Math.floor(difference/1000/60/60/24);
    difference              -= daysDifference*1000*60*60*24
 
    var hoursDifference     = Math.floor(difference/1000/60/60);
    difference              -= hoursDifference*1000*60*60
 
    var minutesDifference   = Math.floor(difference/1000/60);
    difference              -= minutesDifference*1000*60
 
    var secondsDifference   = Math.floor(difference/1000);
    
    var countdown = "Suggestions " + hoursDifference + ":" + minutesDifference + ":" + secondsDifference;
    
    this.suggestlistHeader.setTitle(countdown);
    
    console.log(countdown);
} 

///////////////////////////////////////////////////////////////////////

function GoToEventViewer( dir, back , isEvent)
{
    if (back) this.back = back;
    this.isEvent = isEvent;
    
    this.doCount = true;
    
    MainApp.app.appLayer.currentLayer.animateActiveItem(this.screen, 
                                                        {type: 'pop', direction: dir});
}
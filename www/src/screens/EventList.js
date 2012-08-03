

///////////////////////////////////////////////////////////////////////
//                        New Event Screen Class
///////////////////////////////////////////////////////////////////////

function EventList()
{
    //Create event board...
    this.create      = CreateEventList;
    this.goTo        = GoToEventList;
    
    //set your thumbnail.
    this.index  = 0;
    this.screen = this.create();
}

///////////////////////////////////////////////////////////////////////
//                        CREATE GUI SCREENS
///////////////////////////////////////////////////////////////////////

function CreateEventList()
{
    this.localHeader  = Ext.create('Ext.TitleBar',
    {
        title   : ' YOUR WAYWORDS',
        docked  : 'top',

        defaults:
        {
            iconMask: true,
            xtype:'button',
        }
    });
    
    var csstemp = '<tpl for=".">';
    csstemp    += '<list_event>';
    
    csstemp    += '<div class="list_textbox">';
    
    //This is what you do if it's an event
    csstemp    += '<tpl if="isEvent==1">';
    csstemp    += '<list_header style="color:rgb(25,125,185);">{place} - </list_header>';
    csstemp    += '<list_description>{desc}</list_description>';
    csstemp    += '</tpl>';
    
    //This is what you do if it's NOT an event
    csstemp    += '<tpl if="isEvent==0">';
    csstemp    += '<list_header>{place} - </list_header>';
    csstemp    += '<list_description>{desc}</list_description>';
    csstemp    += '</tpl>';
    
    csstemp    += '</div>';
    
    csstemp    += '<div class="calendar_pic">';
    csstemp    += '<calendar_event><img src="{thumb}"/>';
    csstemp    += '</calendar_event></div>';
    
    csstemp    += '</list_event>';
    csstemp    += '</tpl>';
    
    var screen = Ext.create('Ext.List', 
    {
        iconCls    : 'note1',
        title      : 'EVENTS',
        fullscreen : true,
        cls        : 'blankPage',
        grouped    : true,
        
        items   :[this.localHeader],
        store   : MainApp.app.database.eventsNearByStore,
        itemTpl : csstemp,

        listeners:
        {
            painted :function()
            {
            },
            
            itemtap: function(view, index, item, e) 
            {
                var record  = view.getStore().getAt(index);
                var guid    = record.get('guid');
                var isevent = record.get('isEvent');
                
                MainApp.app.eventList.index = index;
                
                MainApp.app.chatWindow.goTo(  DIR_FORW , 
                                              MainApp.app.eventList,
                                              guid);
                                              
                MainApp.app.eventViewer.viewEvent(MainApp.app.database.eventsNearByStore, guid);
            }
        }
    });
    
    return screen;
}

///////////////////////////////////////////////////////////////////////

function GoToEventList(dir, back, list)
{
    if (dir == DIR_FORW)
    {
        MainApp.app.database.getEventList("user");
        MainApp.app.database.eventsNearByStore.sort('start', 'ASC');
        MainApp.app.eventList.deleteFn = MainApp.app.database.removeUserEvent;
        
        this.deleteFn = MainApp.app.database.removeUserEvent;
        MainApp.app.eventList.index = 0;
    }
    
    MainApp.app.appLayer.currentLayer.animateActiveItem(this.screen, 
                                                        {type: 'slide', direction: dir});
}
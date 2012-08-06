

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
    csstemp    += '<list_class>';
    
    csstemp    += '<div class="eventlist_textbox">';
    csstemp    += '<place>{place}</place>';
    csstemp    += '<date>{start}</date>';
    csstemp    += '</div>';
    
    csstemp    += '<div class="eventlist_imagebox">';
    csstemp    += '<img src="{creatorthumb}"/>';
    csstemp    += '</div>';
    
    csstemp    += '</list_class>';
    csstemp    += '</tpl>';
    
    var screen = Ext.create('Ext.List', 
    {
        iconCls    : 'note1',
        title      : 'EVENTS',
        fullscreen : true,
        cls        : 'blankPage',
        
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


///////////////////////////////////////////////////////////////////////
//                        New Event Screen Class
///////////////////////////////////////////////////////////////////////

function EventList()
{
    //Create event board...
    this.create      = CreateEventList;
    this.destroy     = DestroyEventList;
    this.goTo        = GoToEventList;
    
    //set your thumbnail.
    this.index  = 0;
    this.screen = new Ext.Panel(
    {
        cls     : 'blankPage',
        layout  : 'vbox',
    });
}

///////////////////////////////////////////////////////////////////////
//                        CREATE GUI SCREENS
///////////////////////////////////////////////////////////////////////

function CreateEventList()
{
    this.localHeader  = Ext.create('Ext.TitleBar',
    {
        title : '<div class="way">YOUR </div><div class="word"> PLANS</div>',
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
    csstemp    += '<date>{[values.start.toDateString()]}</date>';
    csstemp    += '</div>';
    
    csstemp    += '<div class="eventlist_imagebox">';
    csstemp    += '<img src="{creatorthumb}"/>';
    csstemp    += '</div>';
    
    csstemp    += '</list_class>';
    csstemp    += '</tpl>';
    
    this.list = Ext.create('Ext.List', 
    {
        iconCls    : 'note1',
        title      : 'EVENTS',
        flex       :  1,
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
                
                MainApp.app.eventViewer.goTo( DIR_FORW , 
                                              MainApp.app.eventList,
                                              guid);
                                              
                MainApp.app.eventViewer.viewEvent(MainApp.app.database.eventsNearByStore, guid);
            }
        }
    });
    
    this.screen.insert(0, this.list);
}

///////////////////////////////////////////////////////////////////////

function DestroyEventList()
{
    var items = this.screen.getItems();
    
    //Iterate and destroy
    items.each(function(item, index, totalItems)
    {
        item.destroy();
    });
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
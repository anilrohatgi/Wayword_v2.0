

///////////////////////////////////////////////////////////////////////
//                        New Event Screen Class
///////////////////////////////////////////////////////////////////////

function EventViewer()
{
    //Create event board...
    this.create    = CreateEventViewer;
    this.viewEvent = ViewEventFromGuid;
    this.template  = "template_layout1";
    
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
            text : 'Go!',
            iconCls : "podcast",
            handler: function()
            {
                MainApp.app.calendarScreen.goTo(DIR_FORW, 
                                            MainApp.app.eventViewer,
                                            MainApp.app.eventViewer.guid);
            }
        },
        {
            iconCls : "trash",
            handler: function()
            {
                //Delete from the user database
                if (MainApp.app.eventViewer.deleteFn)
                {
                    MainApp.app.eventViewer.deleteFn(MainApp.app.eventViewer.guid);
                }
                
                MainApp.app.eventViewer.backButton._handler();
            }
        }]                               
    });
    
    var screen = new Ext.Panel(
    {
        layout  : 'card',
        items: [this.localHeader],

        listeners:
        {
            activate:function()
            {
            },
        },
    });
    
    //image listeners
    screen.element.on(
    {
        delegate: 'img',
        tap: function (e,t) 
        {
            var id = t.getAttribute('id');
            if (id == 'biopic')
            {
                //Get the email attribute
                var email = t.getAttribute('email');
                MainApp.app.database.getUserInfo(email);
                MainApp.app.profileViewer.goTo(DIR_FORW, 
                                          MainApp.app.eventViewer);
                
            }
            else if (id == 'going')
            {
                //Get the email attribute
                var guid = t.getAttribute('guid');
                MainApp.app.guestList.goTo(DIR_FORW, 
                                          MainApp.app.eventViewer,
                                          guid);
            }
            else if (id == 'map')
            {
                //Get the email attribute
                var guid = t.getAttribute('guid');
                MainApp.app.eventMap.goTo(DIR_FORW , 
                                          MainApp.app.eventViewer, 
                                          guid);
            }
        }
    });
    
    return screen;
}

///////////////////////////////////////////////////////////////////////
//                        GUI EVENT FUNCTIONS
///////////////////////////////////////////////////////////////////////

function ViewEventFromGuid(store, guid)
{
    var event = store.findRecord('guid', guid, MainApp.app.eventList.index);
    
    this.guid = guid;
    
    if (event)
    {
        var htmlStr = DrawEventPoster(event.data);
        this.screen.setHtml(htmlStr);
        
        this.screen.replaceCls(this.template, event.data['template']);
        this.template = event.data['template'];
        
        //Set the right delete function
        if (this.isEvent == 1)
        {
            this.deleteFn = MainApp.app.database.removeUserEvent;
        }
        else
        {
            this.deleteFn = MainApp.app.database.deleteEvent;
        }
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
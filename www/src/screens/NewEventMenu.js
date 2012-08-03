

///////////////////////////////////////////////////////////////////////
//                        New Event Screen Class
///////////////////////////////////////////////////////////////////////

function NewEventMenu()
{
    //Create event board...
    this.create         = CreateNewEventMenu;
    this.createHandler  = CreateNewMenuHandler;
    this.refresh        = RefreshMenu;
    this.goTo           = GoToEventMenu;
    
    this.screen         = this.create();
    this.createHandler();
}

///////////////////////////////////////////////////////////////////////
//                        CREATE GUI SCREENS
///////////////////////////////////////////////////////////////////////

function CreateNewEventMenu()
{
    //Header for board
    this.header  = new Ext.Toolbar(
    {
        title   : 'NEW EVENT',
        docked  :'top',
        
        items : 
        [{ xtype:'spacer' },
        {
            text    : 'Post',
            ui      : 'action',
            align   : 'right',
            handler: function () 
            {
                var thumb = "default.jpg";
                
                if (MainApp.app.calendarScreen.ready &&
                    MainApp.app.inviteList.ready     &&
                    MainApp.app.eventMap.ready)
                {
                        //Create a new event
                        var userid  = MainApp.app.database.getUserId();
                        var count   = window.localStorage.getItem("chatCount");
                        
                        if (!count)
                        {
                            count = 0;
                        }
                        
                        var guidStr = userid + '' + count;
                        var guid    = parseInt(guidStr);
                        console.log(guid);
                        
                        count++;
                        window.localStorage.setItem("chatCount", count);
                        
                        MainApp.app.database.createNewEvent(
                                    MainApp.app.newEventForm.screen.getValues(),
                                    MainApp.app.eventMap.lat,
                                    MainApp.app.eventMap.lon,
                                    MainApp.app.newEventEditor.temp,
                                    thumb,
                                    guid);
                                    
                        //Send invites
                        MainApp.app.inviteList.submit(guid);
                        
                        //Reset menu
                        MainApp.app.calendarScreen.ready = false;
                        MainApp.app.inviteList.ready     = false;
                        MainApp.app.eventMap.ready       = false;
                }
            }
        }]                               
    });
    
    var screen = new Ext.Panel(
    {
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
        
        items: [this.header],

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

function RefreshMenu()
{
    var htmlStr = '';
    
    //WHO
    htmlStr    += '<div class="menu_panelwho">';
    htmlStr    += '<img src="Media/Menu/panels/who_a.jpg" class="menu_panelwho_img" />';
    htmlStr    += '</div>';
    
    htmlStr    += '<div class="menu_who">';
    htmlStr    += '<img src="Media/Menu/menu_buttons/who.png" />';
    htmlStr    += '</div>';
    
    //WHERE
    htmlStr    += '<div class="menu_panelwhere">';
    htmlStr    += '<img src="Media/Menu/panels/where_a.jpg" class="menu_panelwhere_img" />';
    htmlStr    += '</div>';
    
    htmlStr    += '<div class="menu_where">';
    htmlStr    += '<img src="Media/Menu/menu_buttons/where.png" />';
    htmlStr    += '</div>';
    
    //WHEN
    htmlStr    += '<div class="menu_panelwhen">';
    htmlStr    += '<img src="Media/Menu/panels/when_a.jpg" class="menu_panelwhen_img" />';
    htmlStr    += '</div>';
    
    htmlStr    += '<div class="menu_when">';
    htmlStr    += '<img src="Media/Menu/menu_buttons/when.png" />';
    htmlStr    += '</div>';
    
    this.screen.setHtml(htmlStr);
}

///////////////////////////////////////////////////////////////////////

function CreateNewMenuHandler()
{
    //Button Handler
    this.screen.element.on(
    {
        delegate: 'div',
        tap: function (e,t) 
        {
            console.log("TAP");
            var id = t.getAttribute('class');
            
            console.log(id);
            if (id == 'menu_panelwho_img')
            {
                MainApp.app.inviteList.goTo(DIR_FORW, 
                                        MainApp.app.newEventMenu);
            }
            else if (id == 'menu_panelwhere_img')
            {
                MainApp.app.eventMap.goTo(DIR_FORW, 
                                        MainApp.app.newEventMenu);
            }
            else if (id == 'menu_panelwhen_img')
            {
                MainApp.app.calendarScreen.goTo(DIR_FORW, 
                                        MainApp.app.newEventMenu);
            }
        }
    });
}

///////////////////////////////////////////////////////////////////////

function GoToEventMenu( dir, back, mode )
{
    this.mode = mode;
    if (back) this.back = back;
    
    this.refresh();
    
    if (dir == DIR_FORW)
    {
        MainApp.app.newEventForm.reset();
        MainApp.app.appLayer.currentLayer.animateActiveItem(this.screen, 
                                                        {type: 'slide', direction: dir});
    }
    else
    {
        MainApp.app.appLayer.currentLayer.animateActiveItem(this.screen, 
                                                        {type: 'flip', direction: dir});
    }
}
   
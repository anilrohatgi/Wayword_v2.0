

///////////////////////////////////////////////////////////////////////
//                        New Event Screen Class
///////////////////////////////////////////////////////////////////////

function NewEventMenu()
{
    //Create event board...
    this.create         = CreateNewEventMenu;
    this.createHandler  = CreateNewMenuHandler;
    this.reset          = ResetNewEventMenu;
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
        //title   : 'NEW EVENT',
        html : '<div class="way">Way</div><div class="word">Word</div>',
        docked  :'top',
        
        items : []                               
    });
    
    this.submitButton = Ext.create('Ext.Button', 
    {
        text    : 'CREATE!',
        ui      : 'action',
        docked  : 'bottom',
        handler: function () 
        {            
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
                    
                    count++;
                    window.localStorage.setItem("chatCount", count);
                                
                    //Send invites
                    MainApp.app.inviteList.submit(guid);
            }
        }
    });
    
    var screen = new Ext.Panel(
    {
        cls   : 'blankPage',
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
        
        items: [this.header, this.submitButton],

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
    
    if (MainApp.app.inviteList.ready)
    {
        htmlStr    += '<div class="check_who">';
        htmlStr    += '<img src="Media/Menu/panels/check_who.png" class="menu_panelwho_img"/>';
        htmlStr    += '</div>';
    }
    
    //WHERE
    htmlStr    += '<div class="menu_panelwhere">';
    htmlStr    += '<img src="Media/Menu/panels/where_a.jpg" class="menu_panelwhere_img" />';
    htmlStr    += '</div>';
    
    htmlStr    += '<div class="menu_where">';
    htmlStr    += '<img src="Media/Menu/menu_buttons/where.png" />';
    htmlStr    += '</div>';
    
    if (MainApp.app.eventMap.ready)
    {
        htmlStr    += '<div class="check_where">';
        htmlStr    += '<img src="Media/Menu/panels/check_where.png" class="menu_panelwhere_img"/>';
        htmlStr    += '</div>';
    }
    
    //WHEN
    htmlStr    += '<div class="menu_panelwhen">';
    htmlStr    += '<img src="Media/Menu/panels/when_a.jpg" class="menu_panelwhen_img" />';
    htmlStr    += '</div>';
    
    htmlStr    += '<div class="menu_when">';
    htmlStr    += '<img src="Media/Menu/menu_buttons/when.png" />';
    htmlStr    += '</div>';
    
    if (MainApp.app.calendarScreen.ready)
    {
        htmlStr    += '<div class="check_when">';
        htmlStr    += '<img src="Media/Menu/panels/check_when.png" class="menu_panelwhen_img"/>';
        htmlStr    += '</div>';
    }
    
    this.screen.setHtml(htmlStr);
    
    //Check to see if you can show the submit button.
    if (MainApp.app.calendarScreen.ready &&
        MainApp.app.inviteList.ready     &&
        MainApp.app.eventMap.ready)
    {
        this.submitButton.show();
    }
    else
    {
        this.submitButton.hide();
    }
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
            var id = t.getAttribute('class');
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

function ResetNewEventMenu()
{
    //Reset menu
    MainApp.app.calendarScreen.ready = false;
    MainApp.app.inviteList.ready     = false;
    MainApp.app.eventMap.ready       = false;
    
    this.refresh();
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
        this.reset();
        MainApp.app.appLayer.currentLayer.animateActiveItem(this.screen, 
                                                        {type: 'slide', direction: dir});
    }
    else
    {
        MainApp.app.appLayer.currentLayer.animateActiveItem(this.screen, 
                                                        {type: 'flip', direction: dir});
    }
}
   


///////////////////////////////////////////////////////////////////////
//                        New Event Screen Class
///////////////////////////////////////////////////////////////////////

function NewSuggestMenu()
{
    //Create event board...
    this.create         = CreateNewSuggestMenu;
    this.destroy        = DestroyNewSuggestMenu;
    this.createHandler  = CreateNewSuggestHandler;
    this.submitSuggest  = SubmitNewSuggest;
    this.reset          = ResetNewSuggestMenu;
    this.refresh        = RefreshSuggestMenu;
    this.goTo           = GoToSuggestMenu;
    
    this.screen       = new Ext.Panel(
    {
        layout: 'vbox',
        cls   : 'blankPage',
        
        hideAnimation: 
        {
            listeners: 
            {
                animationend: function()
                {
                    MainApp.app.newSuggestMenu.destroy();
                }
            }
        },
        
        showAnimation: 
        {
            listeners: 
            {
                animationstart: function()
                {
                    MainApp.app.newSuggestMenu.create();
                    MainApp.app.newSuggestMenu.refresh();
                }
            }
        },
    });
}

///////////////////////////////////////////////////////////////////////
//                        CREATE GUI SCREENS
///////////////////////////////////////////////////////////////////////

function CreateNewSuggestMenu()
{
    this.backButton =  Ext.create('Ext.Button', 
    { 
        text: 'BACK',
        ui  : 'back',
        handler: function()
        {
            if (MainApp.app.newSuggestMenu.back)
            {
                MainApp.app.newSuggestMenu.back.goTo(DIR_BACK)
            }
        }
    });
    
    //Header for board
    this.header  = new Ext.Toolbar(
    {
        title : '<div class="way">NEW </div><div class="word"> SUGGESTION</div>',
        docked  :'top',
        
        items : [this.backButton]                               
    });
    
    this.submitButton = Ext.create('Ext.Button', 
    {
        text    : 'SUGGEST!',
        ui      : 'action',
        docked  : 'bottom',
        handler: function () 
        {            
            if (MainApp.app.calendarScreen.ready &&
                MainApp.app.eventMap.ready)
            {
                MainApp.app.newSuggestMenu.submitSuggest();
            }
        }
    });
    
    this.content = new Ext.Panel(
    {
        cls   : 'blankPage',
        flex  : 1,
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
    
    this.screen.insert(0, this.content);
    this.createHandler();
}

///////////////////////////////////////////////////////////////////////

function DestroyNewSuggestMenu()
{
    var items = this.screen.getItems();
    
    //Iterate and destroy
    items.each(function(item, index, totalItems)
    {
        item.destroy();
    });
}

///////////////////////////////////////////////////////////////////////

function SubmitNewSuggest( deltaTime )
{
    //Send Suggestion
    Ext.Msg.prompt('Message', 'Add message to your suggestion', 
    function(button, value)
    {
        if (button == 'ok')
        {
            //Set the message as description
            MainApp.app.newEventForm.screen.setValues(
            {
                description : value
            });
            
            MainApp.app.database.createNewSuggestion(
                                MainApp.app.newEventForm.screen.getValues(),
                                MainApp.app.eventMap.lat,
                                MainApp.app.eventMap.lon,
                                MainApp.app.newSuggestMenu.guid);
                
            //MainApp.app.inviteList.makeEmails(value);
            MainApp.app.newSuggestMenu.reset();
            MainApp.app.newSuggestMenu.backButton._handler();
        }
    });
}

///////////////////////////////////////////////////////////////////////

function RefreshSuggestMenu()
{
    var htmlStr = '';
    
    //WHERE
    htmlStr    += '<div class="suggestion_panelwhere">';
    htmlStr    += '<img src="Media/Menu/panels/where_a.jpg" class="menu_panelwhere_img" />';
    htmlStr    += '</div>';
    
    htmlStr    += '<div class="suggestion_where">';
    htmlStr    += '<img src="Media/Menu/menu_buttons/where.png" />';
    htmlStr    += '</div>';
    
    if (MainApp.app.eventMap.ready)
    {
        htmlStr    += '<div class="sCheck_where">';
        htmlStr    += '<img src="Media/sCheck_where.png" class="menu_panelwhere_img"/>';
        htmlStr    += '</div>';
    }
    
    //WHEN
    htmlStr    += '<div class="suggestion_panelwhen">';
    htmlStr    += '<img src="Media/Menu/panels/when_a.jpg" class="menu_panelwhen_img" />';
    htmlStr    += '</div>';
    
    htmlStr    += '<div class="suggestion_when">';
    htmlStr    += '<img src="Media/Menu/menu_buttons/when.png" />';
    htmlStr    += '</div>';
    
    if (MainApp.app.calendarScreen.ready)
    {
        htmlStr    += '<div class="sCheck_when">';
        htmlStr    += '<img src="Media/sCheck_when.png" class="menu_panelwhen_img"/>';
        htmlStr    += '</div>';
    }
    
    if (this.content) this.content.setHtml(htmlStr);
    
    //Check to see if you can show the submit button.
    if (MainApp.app.calendarScreen.ready &&
        MainApp.app.eventMap.ready)
    {
        if(this.submitButton) this.submitButton.show();
    }
    else
    {
        if(this.submitButton) this.submitButton.hide();
    }
}

///////////////////////////////////////////////////////////////////////

function CreateNewSuggestHandler()
{
    //Button Handler
    this.content.element.on(
    {
        delegate: 'div',
        tap: function (e,t) 
        {
            var id = t.getAttribute('class');
            if (id == 'menu_panelwhere_img')
            {
                MainApp.app.eventMap.goTo(DIR_FORW, 
                                        MainApp.app.newSuggestMenu);
            }
            else if (id == 'menu_panelwhen_img')
            {
                MainApp.app.calendarScreen.goTo(DIR_FORW, 
                                        MainApp.app.newSuggestMenu);
            }
        }
    });
}

///////////////////////////////////////////////////////////////////////

function ResetNewSuggestMenu()
{
    //Reset menu
    MainApp.app.calendarScreen.ready = false;
    MainApp.app.inviteList.ready     = false;
    MainApp.app.eventMap.ready       = false;
    
    this.refresh();
}

///////////////////////////////////////////////////////////////////////

function GoToSuggestMenu( dir, back, guid )
{
    if (back) this.back = back;
    
    if (dir == DIR_FORW)
    {
        if (guid) this.guid = guid;
        
        MainApp.app.newEventForm.reset();
        this.reset();
        MainApp.app.appLayer.currentLayer.animateActiveItem(this.screen, 
                                                        {type: 'pop', direction: dir});
    }
    else
    {
        MainApp.app.appLayer.currentLayer.animateActiveItem(this.screen, 
                                                        {type: 'flip', direction: dir});
    }
}
   
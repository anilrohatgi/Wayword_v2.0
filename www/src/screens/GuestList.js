

///////////////////////////////////////////////////////////////////////
//                        New Event Screen Class
///////////////////////////////////////////////////////////////////////

function GuestList()
{
    //Create event board...
    this.create      = CreateGuestList;
    this.destroy     = DestroyGuestList;
    this.goTo        = GoToGuestList;
    
    this.screen      = new Ext.Panel(
    {
        layout: 'vbox',
        cls   : 'blankPage',
        hideAnimation: 
        {
            listeners: 
            {
                animationend: function()
                {
                    MainApp.app.guestList.destroy();
                }
            }
        },
        
        showAnimation: 
        {
            listeners: 
            {
                animationstart: function()
                {
                    MainApp.app.guestList.create();
                }
            }
        },
    });
}

///////////////////////////////////////////////////////////////////////
//                        CREATE GUI SCREENS
///////////////////////////////////////////////////////////////////////

function CreateGuestList()
{
    this.destroy();
    
    //Button for submission
    this.backButton =  Ext.create('Ext.Button', 
    { 
        text: 'BACK',
        ui  : 'back',
        handler: function()
        {
            if (MainApp.app.guestList.back)
            {
                MainApp.app.guestList.back.goTo(DIR_BACK)
            }
        }
    });
    
    this.localHeader  = new Ext.Toolbar(
    {
        title : '<div class="way">GUEST </div><div class="word"> LIST</div>',
        docked: 'top',
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

        items : [this.backButton],
    });

    var csstemp = '<tpl for=".">';
    csstemp    += '<div class="listclass">';
    csstemp    += '<div class="friend_photo"><img src="{thumb}"/></div>';
    csstemp    += '<div class="friend_name">{name}</div>';
    csstemp    += '</div>';
    csstemp    += '</tpl>';
    
    this.list = Ext.create('Ext.List', 
    {
        iconCls    : 'team',
        cls        : 'blankPage',
        flex       : 1,
                            
        store: MainApp.app.database.goingStore,
        itemTpl: csstemp,
        items : [this.localHeader],
        
        listeners:
        {
            itemtap: function(view, index, item, e) 
            {
                var record = view.getStore().getAt(index);
                var email  = record.get('email');
                MainApp.app.database.getUserInfo(email);
                MainApp.app.profileViewer.goTo(DIR_FORW, 
                                          MainApp.app.guestList);
            }
        }
    });
    
    this.screen.insert(0, this.list);
}

///////////////////////////////////////////////////////////////////////

function DestroyGuestList()
{
    var items = this.screen.getItems();
    
    //Iterate and destroy
    items.each(function(item, index, totalItems)
    {
        item.destroy();
    });
}
                 
///////////////////////////////////////////////////////////////////////

function GoToGuestList( dir, back, guid )
{
    if (guid) this.guid = guid;
    if (back) this.back = back;

    MainApp.app.database.getGoingList(this.guid);

    MainApp.app.appLayer.currentLayer.animateActiveItem(this.screen, 
                                                        {type: 'slide', direction: dir});
}
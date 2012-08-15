

///////////////////////////////////////////////////////////////////////
//                        New Event Screen Class
///////////////////////////////////////////////////////////////////////

function FriendsList()
{
    //Create event board...
    this.create      = CreateFriendsList;
    this.destroy     = DestroyFriendsList;
    this.goTo        = GoToFriendsList;
    
    this.screen      = new Ext.Panel(
    {
        cls     : 'blankPage',
        layout  : 'vbox',
    });
}

///////////////////////////////////////////////////////////////////////
//                        CREATE GUI SCREENS
///////////////////////////////////////////////////////////////////////

function CreateFriendsList()
{
    this.destroy();
    
    //Button for submission
    this.localHeader  = Ext.create('Ext.TitleBar',
    {
        title : '<div class="way">YOUR </div><div class="word"> FRIENDS</div>',
        docked: 'top',
        defaults:
        {
            align   :'right',
            iconMask: true,
            xtype:'button',
        },

        items : 
        [{
            ui: 'action',
            text : '',
            iconCls : "search",
            handler: function()
            {
                Ext.Msg.prompt('Find a Friend', 'Enter Email Address', 
                function(button, value)
                {
                    if (button == 'ok')
                    {
                        MainApp.app.database.getUserInfo(value);
                        MainApp.app.profileViewer.goTo(DIR_FORW, 
                                                MainApp.app.friendsList);
                    }
                });
            }
        },
        {
            ui: 'action',
            iconCls : "mail5",
            handler: function()
            {
                MainApp.app.contactList.goTo(DIR_FORW, 
                                            MainApp.app.friendsList);
            }
        }]                               
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
        cls        : 'listclass',
        flex       :  1,
                            
        store: MainApp.app.database.friendStore,
        itemTpl: csstemp,
        items : [ this.localHeader],

        listeners:
        {
            itemtap: function(view, index, item, e) 
            {
                var record = view.getStore().getAt(index);
                var email  = record.get('email');
                MainApp.app.database.getUserInfo(email);
                MainApp.app.profileViewer.goTo(DIR_FORW, 
                                          MainApp.app.friendsList);
            }
        }
    });
    
    this.screen.insert(0, this.list);
}

///////////////////////////////////////////////////////////////////////

function DestroyFriendsList()
{
    var items = this.screen.getItems();
    
    //Iterate and destroy
    items.each(function(item, index, totalItems)
    {
        item.destroy();
    });
}

///////////////////////////////////////////////////////////////////////

function GoToFriendsList( dir, back)
{
    MainApp.app.database.getUserFriends();
    MainApp.app.appLayer.currentLayer.animateActiveItem(this.screen, 
                                                        {type: 'slide', direction: dir});
}
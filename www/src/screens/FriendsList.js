

///////////////////////////////////////////////////////////////////////
//                        New Event Screen Class
///////////////////////////////////////////////////////////////////////

function FriendsList()
{
    //Create event board...
    this.create      = CreateFriendsList;
    this.goTo        = GoToFriendsList;
    
    this.screen = this.create();
}

///////////////////////////////////////////////////////////////////////
//                        CREATE GUI SCREENS
///////////////////////////////////////////////////////////////////////

function CreateFriendsList()
{
    //Button for submission
    this.localHeader  = Ext.create('Ext.TitleBar',
    {
        title : 'FRIENDS',
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
    csstemp    += '<div class="friend_photo"><img src="{thumb}"/></div>';
    csstemp    += '<div class="friend_name">{name}</div>';
    csstemp    += '</tpl>';
    
    var screen = Ext.create('Ext.List', 
    {
        iconCls    : 'team',
        cls        : 'blankPage',
        title      : 'Your Friends',
        fullscreen : true,
                            
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
    
    return screen;
}

///////////////////////////////////////////////////////////////////////

function GoToFriendsList( dir, back)
{
    MainApp.app.database.getUserFriends();
    MainApp.app.appLayer.currentLayer.animateActiveItem(this.screen, 
                                                        {type: 'slide', direction: dir});
}
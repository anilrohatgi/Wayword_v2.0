///////////////////////////////////////////////////////////////////////
//                       Class declarations
///////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////
//                        New Event Screen Class
///////////////////////////////////////////////////////////////////////

function ContactsList()
{
    //Create event board...
    this.create      = CreateContactsList;
    this.destroy     = DestroyContactsList;
    this.goTo        = GoToContactsList;
    this.makeEmails  = MakeContactFriendRequest;
    
    this.screen      = new Ext.Panel(
    {
        cls     : 'blankPage',
        layout  : 'vbox',
        hideAnimation: 
        {
            listeners: 
            {
                animationend: function()
                {
                    MainApp.app.contactList.destroy();
                }
            }
        },
        
        showAnimation: 
        {
            listeners: 
            {
                animationstart: function()
                {
                    MainApp.app.contactList.create();
                }
            }
        },
    });
}

///////////////////////////////////////////////////////////////////////
//                        CREATE GUI SCREENS
///////////////////////////////////////////////////////////////////////

function CreateContactsList()
{
    //Button for submission
    this.backButton =  Ext.create('Ext.Button', 
    { 
        text: 'BACK',
        ui  : 'back',
        handler: function()
        {
            if (MainApp.app.contactList.back)
            {
                MainApp.app.contactList.back.goTo(DIR_BACK)
            }
        }
    });
    
    this.localHeader  = new Ext.Toolbar(
    {
        title : '<div class="word">CONTACTS</div>',
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

        items : [this.backButton,
        {
            ui      : 'action',
            align   : 'right',
            iconCls : "add",
            
            handler : function()
            {
                MainApp.app.contactList.makeEmails();
                MainApp.app.contactList.backButton._handler();
            }
        }],
    });

    var csstemp = '<tpl for=".">';
    csstemp    += '<div class="listclass">';
    csstemp    += '<div class="friend_name">{emails}</div>';
    csstemp    += '</div>';
    csstemp    += '</tpl>';
    
    this.list = Ext.create('Ext.List', 
    {
        iconCls    : 'team',
        cls        : 'blankPage',
        flex       : 1,
        mode: 'MULTI',

        store: MainApp.app.database.contactStore,
        itemTpl: csstemp,
        
        items : [this.localHeader],
        listeners:
        {
            itemtap: function(view, index, item, e) 
            {
            }
        }
    });
    
    this.screen.insert(0, this.list);
}

///////////////////////////////////////////////////////////////////////

function DestroyContactsList()
{
    var items = this.screen.getItems();
    
    //Iterate and destroy
    items.each(function(item, index, totalItems)
    {
        item.destroy();
    });
}

///////////////////////////////////////////////////////////////////////

function MakeContactFriendRequest()
{
    //Iterate through the recipients
    var friends = this.screen.getSelection();    
    
    if (friends)
    {
        friends.forEach(function(item)
        {
            var to = item.data['emails'];
            
            var userdat = MainApp.app.database.getUserData();
            var user = userdat['name'];
            var thumb = userdat['thumb'];
            
            var addLink = DBFile + '?action=inviteEmail&user=' + userdat['userid'] + '&email='+to;
            
            MainApp.app.database.sendFriendEmail(to, user, thumb, addLink);
        });
    }
    
    Ext.Msg.alert('Friend Request', 'Emails have been sent for confirmation', 
    function()
    {
        MainApp.app.contactList.backButton._handler();
    });
}
                 
///////////////////////////////////////////////////////////////////////

function GoToContactsList( dir, back, guid )
{
    if (back) this.back = back;

    //MainApp.app.database.contactStore.load();
    MainApp.app.database.parseContacts();
    MainApp.app.appLayer.currentLayer.animateActiveItem(this.screen, 
                                                        {type: 'slide', direction: dir});
}
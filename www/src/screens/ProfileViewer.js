

///////////////////////////////////////////////////////////////////////
//                        Author Info 
///////////////////////////////////////////////////////////////////////

function ProfileView()
{
    //Create event board...
    this.create       = CreateProfileViewScreen;
    this.loadData     = BuildUserProfile;
    this.goTo         = GoToProfViewScreen;
    
    this.screen       = this.create();
}

///////////////////////////////////////////////////////////////////////
//                        CREATE GUI SCREENS
///////////////////////////////////////////////////////////////////////

function CreateProfileViewScreen()
{
    this.backButton =  Ext.create('Ext.Button', 
    { 
        text: 'BACK',
        ui  : 'back',
        handler: function()
        {
            if (MainApp.app.profileViewer.back)
            {
                MainApp.app.profileViewer.back.goTo(DIR_BACK)
            }
        }
    });
    
    this.addButton =  Ext.create('Ext.Button',   
    {
        iconCls : "add",
        handler: function()
        {
            Ext.Msg.alert('Friend Request', 'Email has been sent for confirmation', 
            function()
            {
                var to = MainApp.app.profileViewer.user['email'];
                var userdat = MainApp.app.database.getUserData();
                var user = userdat['name'];
                var thumb = userdat['thumb'];
                
                var addLink = DBFile + '?action=addFriend&user1=' + userdat['userid'] + '&user2=' + MainApp.app.profileViewer.user['userid'];
                
                MainApp.app.database.sendFriendEmail(to, user, thumb, addLink);
                MainApp.app.profileViewer.backButton._handler();
            });
        }
    });
    
    this.deleteButton =  Ext.create('Ext.Button',   
    {
        iconCls : "delete",
        handler: function()
        {
            Ext.Msg.confirm('Remove Friend', 'Are you sure you want to do this?', 
            function(button)
            {
                if (button == 'yes')
                {
                    MainApp.app.database.removeFriend(MainApp.app.profileViewer.user['userid']);
                    MainApp.app.profileViewer.backButton._handler();
                }
            });
        }
    });
    
    this.localHeader  = new Ext.Toolbar(
    {
        title   : 'PROFILE',
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

        items : 
        [this.backButton, {xtype: 'spacer'}, this.addButton, this.deleteButton]
    });
    
    var screen  = new Ext.Panel(
    {
        cls   : 'user_background',
        items : [this.localHeader],
        listeners:
        {
            activate:function()
            {
            }
        },
    });

    return screen;
}

///////////////////////////////////////////////////////////////////////

function BuildUserProfile( data )
{
    if (data)
    {
        this.user = data;
        var htmlStr = DrawUserProfile(data);
        this.screen.setHtml(htmlStr);
        
        //Is this already a friend?
        var friend = MainApp.app.database.friendStore.findRecord('userid', data['userid']);
        
        if (friend)
        {
            //can't re-add a friend
            this.addButton.disable();
            this.deleteButton.enable();
        }
        else
        {
            this.addButton.enable();
            this.deleteButton.disable();
        }
    }
    else
    {
        this.screen.setHtml(":(");
        
        Ext.Msg.alert('Error', 'Sorry, buddy not found :(', 
        function()
        {
            MainApp.app.profileViewer.backButton._handler();
        });
    }
}

///////////////////////////////////////////////////////////////////////

function GoToProfViewScreen(dir, back, data)
{
    if (back) this.back = back;
    MainApp.app.appLayer.currentLayer.animateActiveItem(this.screen, 
                                                        {type: 'slide', direction: dir});
}

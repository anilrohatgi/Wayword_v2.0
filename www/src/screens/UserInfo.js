

///////////////////////////////////////////////////////////////////////
//                        Author Info 
///////////////////////////////////////////////////////////////////////

function UserInfoScreen()
{
    //Create event board...
    this.create       = CreateUserInfoScreen;
    this.destroy      = DestroyUserInfoScreen;
    this.loadData     = LoadUserData;
    this.goTo         = GoToUserInfoScreen;
    
    this.screen       = new Ext.Panel(
    {
        cls  : 'blankPage',
        listeners:
        {
            deactivate : function ()
            {
                MainApp.app.userInfoScreen.destroy();
            }
        },
    });
}

///////////////////////////////////////////////////////////////////////
//                        CREATE GUI SCREENS
///////////////////////////////////////////////////////////////////////

function CreateUserInfoScreen()
{
    this.destroy();
    
    this.localHeader = Ext.create('Ext.TitleBar',
    {
        title  : '<div class="way">YOUR </div><div class="word"> PROFILE</div>',
        docked :'top',
        
        defaults:
        {
            align : 'right',
            iconMask: true,
            xtype:'button',
        },
                                        
        items :[
        {
             text: 'edit',
             ui  : 'action',
             handler: function () 
             {
                MainApp.app.userInfoForm.goTo(DIR_FORW,
                                             MainApp.app.userInfoScreen);
             }
         },
         { xtype : 'spacer'},
         {
             text: 'logout',
             handler: function () 
             {
                 //delete cache data
                window.localStorage.removeItem("username");
                window.localStorage.removeItem("password");
                MainApp.app.loginScreen.goTo();
             }
         }]
     }); 

    
     //Add this
     this.screen.insert(0, this.localHeader);
}

///////////////////////////////////////////////////////////////////////

function DestroyUserInfoScreen()
{
    var items = this.screen.getItems();
    
    //Iterate and destroy
    items.each(function(item, index, totalItems)
    {
        item.destroy();
    });
}

///////////////////////////////////////////////////////////////////////

function LoadUserData( data )
{
    var htmlStr = DrawUserProfile(data);
    this.screen.setHtml(htmlStr);
}

///////////////////////////////////////////////////////////////////////

function GoToUserInfoScreen( dir, back )
{
    //Build the parts
    this.create();
    
    MainApp.app.appLayer.currentLayer.animateActiveItem(this.screen,
                                   {type: 'slide', direction: dir});
}

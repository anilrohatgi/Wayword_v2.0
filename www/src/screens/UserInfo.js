

///////////////////////////////////////////////////////////////////////
//                        Author Info 
///////////////////////////////////////////////////////////////////////

function UserInfoScreen()
{
    //Create event board...
    this.create       = CreateUserInfoScreen;
    this.loadData     = LoadUserData;
    this.goTo         = GoToUserInfoScreen;
    
    this.screen       = this.create();
}

///////////////////////////////////////////////////////////////////////
//                        CREATE GUI SCREENS
///////////////////////////////////////////////////////////////////////

function CreateUserInfoScreen()
{
    this.localHeader = Ext.create('Ext.TitleBar',
    {
        title  : 'PROFILE',
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

    var screen  = new Ext.Panel(
    {
        title      : 'Your Bio',
        cls        : 'user_background',
        items      : [this.localHeader],

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

function LoadUserData( data )
{
    var htmlStr = DrawUserProfile(data);
    this.screen.setHtml(htmlStr);
}

///////////////////////////////////////////////////////////////////////

function GoToUserInfoScreen( dir, back )
{
    MainApp.app.appLayer.currentLayer.animateActiveItem(this.screen,
                                   {type: 'slide', direction: dir});
}

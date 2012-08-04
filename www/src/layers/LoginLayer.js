
///////////////////////////////////////////////////////////////////////
//                        App Layer
///////////////////////////////////////////////////////////////////////

function LoginLayer()
{
    //Here is the holder screen.
    this.layer = new Ext.Panel(
    {
        title   :'',
        id      : 'loginLayer',
        layout  : 'card',
        cls     : 'blankPage',
        fullscreen : true,

        items: [MainApp.app.loginScreen.screen, MainApp.app.appLayer.layer],

        listeners:
        {
            activate:function()
            {
                //Try and log the user via cache
                var cache =
                {
                    username : window.localStorage.getItem("username"),
                    password : window.localStorage.getItem("password")
                };
                               
                if (cache.username && cache.password)
                {
                    console.log(cache);
                    MainApp.app.database.loginUser(cache);
                }
            },
                               
            activeitemchange : function(tabPanel, tab, oldTab)
            {
                //this means you are going to the app layer
                if (tab == MainApp.app.appLayer.layer)
                {
                    //refresh whatever the app is currently on.
                    MainApp.app.appLayer.layer.goTo();
                }
            }                 
        },
    });
}
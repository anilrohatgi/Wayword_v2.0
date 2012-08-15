
///////////////////////////////////////////////////////////////////////
//                        App Layer
///////////////////////////////////////////////////////////////////////

function FriendsLayer()
{
    //Here is the holder screen.
    this.layer = new Ext.Panel(
    {
        title   :'',
        layout  : 'card',
        iconCls : 'team',

        items: [MainApp.app.friendsList.screen, 
                MainApp.app.profileViewer.screen,
                MainApp.app.contactList.screen],

        listeners:
        {
            activate:function()
            {
            }
        },
        
        unload : function()
        {
            MainApp.app.friendsList.destroy(); 
            MainApp.app.profileViewer.destroy(); 
            MainApp.app.contactList.destroy();
        },
                               
        //GOTO function
        goTo : function()
        {
            MainApp.app.friendsList.create(); 
            MainApp.app.profileViewer.create(); 
            MainApp.app.contactList.create();
            
            MainApp.app.friendsList.goTo(DIR_FORW);   
        }
    });
}
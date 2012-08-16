
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
        },
                               
        //GOTO function
        goTo : function()
        {
            MainApp.app.friendsList.goTo(DIR_FORW);   
        }
    });
}
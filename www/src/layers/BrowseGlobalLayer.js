
///////////////////////////////////////////////////////////////////////
//                        App Layer
///////////////////////////////////////////////////////////////////////

function BrowseEventLayer()
{
    //Here is the holder screen.
    this.layer = new Ext.Panel(
    {
        title   :'',
        layout  : 'card',
        iconCls : 'hot',
        cls     : 'createform',

        items: [MainApp.app.eventBroswer.screen,
                MainApp.app.profileViewer.screen,
                MainApp.app.calendarScreen.screen,
                MainApp.app.inviteList.screen,
                MainApp.app.guestList.screen],
        listeners:
        {
            activate:function()
            {
            }
        },
                               
        //GOTO function
        goTo : function()
        {
            MainApp.app.eventBroswer.goTo(DIR_FORW);   
        }
    });
}
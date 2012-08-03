
///////////////////////////////////////////////////////////////////////
//                        App Layer
///////////////////////////////////////////////////////////////////////

function CalendarLayer()
{
    //Here is the holder screen.
    this.layer = new Ext.Panel(
    {
        title   :'',
        layout  : 'card',
        iconCls : 'note1',

        items: [MainApp.app.eventList.screen,
                MainApp.app.chatWindow.screen,
                MainApp.app.calendarScreen.screen,
                MainApp.app.eventViewer.screen,
                MainApp.app.profileViewer.screen,
                MainApp.app.inviteList.screen,
                MainApp.app.guestList.screen,
                MainApp.app.eventMap.screen],

        listeners:
        {
            activate:function()
            {
            }
        },
                               
        //GOTO function
        goTo : function()
        {
            MainApp.app.appLayer.layer.animateActiveItem(this, 
                                              {type: 'slide', direction: DIR_FORW});
            
            MainApp.app.eventList.goTo(DIR_FORW);   
        }
                            
    });
}

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
        cls     : 'blankPage',

        items: [MainApp.app.eventList.screen,
                MainApp.app.calendarScreen.screen,
                MainApp.app.eventViewer.screen,
                MainApp.app.suggestViewer.screen,
                MainApp.app.newSuggestMenu.screen,
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
        
        unload : function()
        {
            MainApp.app.eventList.destroy(); 
            MainApp.app.calendarScreen.destroy();
            MainApp.app.eventMap.destroy(); 
            MainApp.app.profileViewer.destroy(); 
            MainApp.app.inviteList.destroy();
            MainApp.app.guestList.destroy();
            MainApp.app.eventViewer.destroy();
            MainApp.app.suggestViewer.destroy();
            MainApp.app.newSuggestMenu.destroy();
        },
                               
        //GOTO function
        goTo : function()
        {
            MainApp.app.eventList.create(); 
            MainApp.app.calendarScreen.create();
            MainApp.app.eventMap.create(); 
            MainApp.app.profileViewer.create(); 
            MainApp.app.inviteList.create();
            MainApp.app.guestList.create();
            MainApp.app.eventViewer.create();
            MainApp.app.suggestViewer.create();
            MainApp.app.newSuggestMenu.create();
            
            MainApp.app.eventList.goTo(DIR_FORW);   
        }
                            
    });
}
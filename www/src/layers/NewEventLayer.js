
///////////////////////////////////////////////////////////////////////
//                        App Layer
///////////////////////////////////////////////////////////////////////

function NewEventLayer()
{
    //Here is the holder screen.
    this.layer = new Ext.Panel(
    {
        title   :'',
        id      : 'newEventLayer',
        layout  : 'card',
        iconCls : 'doc_new',
        cls     : 'blankPage',

        items: [MainApp.app.newEventForm.screen, 
                MainApp.app.newEventMenu.screen,
                MainApp.app.calendarScreen.screen,
                MainApp.app.eventMap.screen,
                MainApp.app.inviteList.screen],

        listeners:
        {
            activate:function()
            {
            }
        },
        
        unload : function()
        {
            MainApp.app.newEventMenu.destroy();
            MainApp.app.calendarScreen.destroy();
            MainApp.app.eventMap.destroy();
            MainApp.app.inviteList.destroy();
        },
                               
        //GOTO function
        goTo : function()
        {
            MainApp.app.newEventMenu.create();
            MainApp.app.calendarScreen.create();
            MainApp.app.eventMap.create();
            MainApp.app.inviteList.create();
            
            MainApp.app.newEventMenu.goTo(DIR_FORW);   
        }
    });
}
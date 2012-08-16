
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
        },
                               
        //GOTO function
        goTo : function()
        {
            MainApp.app.newEventMenu.goTo(DIR_FORW);   
        }
    });
}
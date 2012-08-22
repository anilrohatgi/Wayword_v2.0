
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
        
        hideAnimation: 
        {
            listeners: 
            {
                animationend: function()
                {
                }
            }
        },

        items: [MainApp.app.eventList.screen,
                MainApp.app.chatWindow.screen,
                MainApp.app.profileViewer.screen,
                MainApp.app.guestList.screen],

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
            MainApp.app.eventList.goTo(DIR_FORW);   
        }
                            
    });
}
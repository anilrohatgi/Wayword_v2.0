
///////////////////////////////////////////////////////////////////////
//                        App Layer
///////////////////////////////////////////////////////////////////////

function UserInfoLayer()
{
    this.layer = new Ext.Panel(
    {
        title   :'',
        layout  : 'card',
        iconCls : 'info_plain',

        items: [MainApp.app.userInfoScreen.screen, 
               MainApp.app.userInfoForm.screen],

        listeners:
        {
            activate:function()
            {
            }
        },
        
        unload : function()
        {
            MainApp.app.userInfoScreen.destroy(); 
            MainApp.app.userInfoForm.destroy(); 
        },
        
        //GOTO function
        goTo : function()
        {
            MainApp.app.userInfoScreen.create();
            MainApp.app.userInfoForm.create(); 
            MainApp.app.userInfoScreen.goTo(DIR_FORW);   
        }
    });
}
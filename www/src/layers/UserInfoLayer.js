
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
    });
    
    //GOTO function
    this.goTo = function()
    {
        MainApp.app.userInfoScreen.goTo(DIR_FORW);   
    };
}
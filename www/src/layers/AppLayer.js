

var DIR_BACK = 'right';
var DIR_FORW = 'left';

///////////////////////////////////////////////////////////////////////
//                        App Layer
///////////////////////////////////////////////////////////////////////

function AppLayer()
{
    this.currentLayer = MainApp.app.browseEventLayer.layer;
    
    //Here is the holder screen.
    this.layer = Ext.create('Ext.TabPanel', 
    {
        id                  : 'appLayer',
        tabBarPosition      : 'bottom',

        defaults: 
        {
            styleHtmlContent: true
        },
                                  
        items: [MainApp.app.calendarLayer.layer,
                MainApp.app.newEventLayer.layer,
                MainApp.app.friendsLayer.layer,
                MainApp.app.userInfoLayer.layer],
        
        listeners:
        {
            activate:function()
            {
            },
                            
            activeitemchange : function(tabPanel, tab, oldTab)
            {
                MainApp.app.appLayer.currentLayer = tab;
                if (tab.goTo)
                {
                    tab.goTo();
                }
            }
        },
        
        //GO TO
        goTo : function()
        {
            this.setActiveItem(MainApp.app.newEventLayer.layer);
            MainApp.app.newEventLayer.layer.goTo();
        }
        
    });
}

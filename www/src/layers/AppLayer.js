

var DIR_BACK = 'right';
var DIR_FORW = 'left';

///////////////////////////////////////////////////////////////////////
//                        App Layer
///////////////////////////////////////////////////////////////////////

function AppLayer()
{
    this.currentLayer = MainApp.app.newEventLayer.layer;
    
    //Here is the holder screen.
    this.layer = Ext.create('Ext.TabPanel', 
    {
        id                  : 'appLayer',
        tabBarPosition      : 'bottom',

        defaults: 
        {
            styleHtmlContent: true
        },
                                  
        items: [MainApp.app.newEventLayer.layer,
                MainApp.app.calendarLayer.layer,
                MainApp.app.friendsLayer.layer,
                MainApp.app.userInfoLayer.layer],
        
        listeners:
        {
            activate:function()
            {
            },
                            
            activeitemchange : function(tabPanel, tab, oldTab)
            {
                //destroy old tab
                if (oldTab.unload)
                {
                    oldTab.unload();
                }
            
                //go to new tab
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

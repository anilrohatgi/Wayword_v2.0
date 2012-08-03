
///////////////////////////////////////////////////////////////////////
//                        App Layer
///////////////////////////////////////////////////////////////////////

function BrowseUserLayer()
{
    //Here is the holder screen.
    this.layer = new Ext.Panel(
    {
        id      : 'browseUserLayer',
        layout  : 'card',
        iconCls : 'favorites',
        title   : 'Favs',

        items: [MainApp.app.favoriteBroswer.screen],

        listeners:
        {
            activate:function()
            {
            }
        },
    });
}
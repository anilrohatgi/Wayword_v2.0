

///////////////////////////////////////////////////////////////////////
//                        New Event Screen Class
///////////////////////////////////////////////////////////////////////

function NewMainMenu()
{
    //Create event board...
    this.create            = CreateMainMenu;
    this.refresh           = BuildMainMenu;
    this.addHandler        = AddMenuHandler;
    this.goTo              = GoToMainMenu;
    
    this.dispScore         = 0;
    
    this.screen            = this.create();
    this.refresh();
    this.addHandler();
}

///////////////////////////////////////////////////////////////////////
//                        CREATE GUI SCREENS
///////////////////////////////////////////////////////////////////////

function CreateMainMenu()
{
    var screen = new Ext.Panel(
    {
        id      : 'MainMenu',
        layout  : 'card',
        html    :  '',
        cls     :'mainmenu',
        
        animate : function()
        {
            if (MainApp.app.mainMenu.screen.isPainted())
            {
                MainApp.app.environment.draw();
                setTimeout(MainApp.app.mainMenu.screen.animate, 1000/50);
            }
        },
                               
        listeners:
        {
            activate:function()
            {

            },

            painted :function()
            {
                //Set the canvas for the env.
                //var canvas = document.getElementById('city');
                //var ctx    = canvas.getContext('2d');
                //MainApp.app.environment.setCanvas( ctx , canvas);
                //MainApp.app.mainMenu.screen.animate();
            }
        },
    });
    
    return screen;
}

///////////////////////////////////////////////////////////////////////
//                        BUILD PARTS
///////////////////////////////////////////////////////////////////////

function AddMenuHandler()
{
    //Button Handler
    this.screen.element.on(
    {
        delegate: 'img',
        tap: function (e,t) 
        {
            var id = t.getAttribute('id');
            if (id == 'add')
            {
                MainApp.app.newEventForm.goTo(EDITOR_NEW);
            }
            else if (id == 'bio')
            {
                MainApp.app.userInfoLayer.goTo();
            }
            else if (id == 'hot')
            {
                MainApp.app.eventBroswer.goTo('top');
            }
            else if (id =='cal')
            {
               MainApp.app.calendarLayer.goTo(MainApp.app.calendarScreen);
            }
        }
    });
}

///////////////////////////////////////////////////////////////////////

function BuildMainMenu()
{
    //Variable pieces
    var bioPic  = 'Media/bio.png';
    
    //Get the user data
    var userData = MainApp.app.database.getUserData();
    if (userData != null)
    {
        bioPic = userData['thumb'];
    }
    
    var htmlStr = "<div class='mainmenu'>";
    
    htmlStr += "<div class='mainmenu_hot'><img src='Media/hot.png' id='hot'></img></div>";
    htmlStr += "<div class='mainmenu_events'><img src='Media/events.png' id='add'></img></div>";
    htmlStr += "<div class='mainmenu_bio'><img src='Media/bio.png' id='bio'></img></div>";
    htmlStr += "<div class='mainmenu_calendar'><img src='Media/calendar.png' id='cal'></img></div>";
    htmlStr += "<div class='mainmenu_cityVert'><img src='Media/city_vertical.png' id='cityVert'></img></div>";
    htmlStr += "<div class='mainmenu_cityHoriz'><img src='Media/city_horizontal.png' id='cityHoriz'></img></div>";
    htmlStr += "<div class='mainmenu_bioPic'><img src='" + bioPic + "' id='bioPic'></img></div>";
    
    htmlStr += "</div>";
    
    this.screen.setHtml(htmlStr);
}

///////////////////////////////////////////////////////////////////////
//                        GUI EVENT FUNCTIONS
///////////////////////////////////////////////////////////////////////

function GoToMainMenu()
{
    MainApp.app.loginLayer.layer.setActiveItem(MainApp.app.appLayer.layer);
    MainApp.app.appLayer.layer.animateActiveItem(this.screen, 
                                                {type: 'slide', direction: 'down'});
}

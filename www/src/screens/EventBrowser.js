
///////////////////////////////////////////////////////////////////////
//                        Event Screen Class
///////////////////////////////////////////////////////////////////////

function EventBrowser()
{
    //Create event board...
    this.create           = CreateEventBoard; 
    
    this.loadTemplates    = LoadTemplates;
    this.createCarousel   = CreatePageCarousel;
    this.loadActiveEvents = PopulateEventBoard;
    this.createToc        = CreateTableOfContents;
    this.goTo             = GoToEventBrowser;
    this.initMagazine     = InitMagazine;

    this.carousel         = this.createCarousel();
    this.screen           = this.create();
    this.curPage          = 1;
    this.tocPages         = 0;
    this.maxPages         = 1;
}

///////////////////////////////////////////////////////////////////////
//                        CREATE GUI SCREENS
///////////////////////////////////////////////////////////////////////

function CreateEventBoard()
{
    //Header for board
    this.localHeader  = Ext.create('Ext.TitleBar',
    {
        title    : 'HOT SPOTS',
        docked   : 'top',
            
        defaults:
        {
            iconMask: true,
            xtype:'button',
        },                                    
        items : 
        [{
            ui: 'action',
            text : 'Go!',
            align: 'right',
            iconCls : "podcast",
            handler: function()
            {
                //Do some riskey conversions...
                var book = $('#magazine');
                
                var page = book.turn('page') - 1;
                page = Math.max(page, 0);

                var guid = MainApp.app.eventBroswer.guidList[page];
                MainApp.app.calendarScreen.goTo(DIR_FORW , MainApp.app.eventBroswer, guid);
            }
        }]                               
    });
    
    this.htmlScreen = Ext.create('Ext.Panel',
    {
        flex : 6,
        listeners:
        {
            painted :function()
            {
            }
        }
    });
    
    var screen = Ext.create('Ext.Panel', 
    {
        fullscreen  : true,
        layout : 'vbox',
        cls  : 'noEvent',
        items: [this.localHeader, this.htmlScreen, this.carousel],

        listeners:
        {
            painted :function()
            {           
            },
        },
    });
        
    return screen;
}

///////////////////////////////////////////////////////////////////////
//                        Event Class Functions
///////////////////////////////////////////////////////////////////////

function LoadTemplates()
{
    var htmlStr = "";
    MainApp.app.database.templateStore.data.each(function(item, index, totalItems) 
    {
        var css = ServerBase + 'templates/' + item.data['name'] + '.css';
        htmlStr += '<link rel="stylesheet" href="' + css + '" type="text/css">';
    });
    
    //Load this into the html
    this.screen.setHtml(htmlStr);
}

///////////////////////////////////////////////////////////////////////
//                       CREATING BOOK HTML
///////////////////////////////////////////////////////////////////////

function CreateTableOfContents(store)
{
    var htmlStr = '';
    
    //Iterate through the list in increments of 5
    this.tocPages = 0;
    
    for( var item = 0; item < store.data.items.length; item+=5)
    {
        htmlStr += CreateTocPage(store, item);
        this.tocPages++;
    }
    
    //Send data out
    return htmlStr;
}

///////////////////////////////////////////////////////////////////////

function PopulateEventBoard(store)
{	
    if (store.data.all.length > 0)
    {
        this.screen.remove(this.htmlScreen, true);
        
        var carouselHtml = "";
        this.guidList = [];
        this.store = store;
        
        //Sort by popularity to get the top item
        store.sort('popularity','ASC');
        
        //Add some cards..
        var coverhtml = CreateCoverStory(store.data.all[0].data);
        this.guidList.push(store.data.all[0].data['guid']);
        
        var pageStr   =  '';
        
        //Create the toc
        this.tocPages = 0;
        this.maxPages = this.tocPages + 1;
        var  tocStr = '';
        
        store.data.each(function(item, index, totalItems) 
        {
            pageStr += '<div class="' + item.data['template'] + '">';
            pageStr += DrawEventPoster(item.data);
            pageStr += '</div>';
            
            MainApp.app.eventBroswer.guidList.push(item.data['guid']);
            
            carouselHtml+= '<img src="'+ item.data['thumb'] +'" width="40px" height="40px" />';
            
            MainApp.app.eventBroswer.maxPages++;
        });
        
        htmlStr  = '<div id="magazine">';
        htmlStr += (coverhtml + pageStr);
        htmlStr += '</div>';
        
        this.htmlScreen =  Ext.create('Ext.Carousel',
        {
            flex : 6,
            html : htmlStr,
            listeners:
            {
                painted :function()
                {
                    MainApp.app.eventBroswer.initMagazine();
                },
            }
        });
        
        
        //image listeners
        this.htmlScreen.element.on(
        {
            delegate: 'img',
            tap: function (e,t) 
            {
                var id = t.getAttribute('id');
                if (id == 'biopic')
                {
                    //Get the email attribute
                    var email = t.getAttribute('email');
                    MainApp.app.database.getUserInfo(email);
                    MainApp.app.profileViewer.goTo(DIR_FORW, 
                                              MainApp.app.eventBroswer);
                    
                }
                else if (id == 'going')
                {
                    //Get the email attribute
                    var guid = t.getAttribute('guid');
                    MainApp.app.guestList.goTo(DIR_FORW, 
                                              MainApp.app.eventBroswer,
                                              guid);
                }
                else if (id == 'map')
                {
                    //Get the email attribute
                    var guid = t.getAttribute('guid');
                    MainApp.app.eventMap.goTo(DIR_FORW , 
                                              MainApp.app.eventBroswer, 
                                              guid);
                }
            }
        });
        
        this.screen.insert(1, this.htmlScreen);
        this.carousel.show();
    }
    else
    {
        Ext.Msg.alert('Oops!', 'No WayWord Hot Spots found :(. Why don\'t you start the trend by creating one of your own!', 
        function()
        {
            MainApp.app.appLayer.layer.setActiveItem(MainApp.app.newEventLayer.layer);
        });
        
        //Remove the html screen
        this.screen.remove(this.htmlScreen, true);
        this.carousel.hide();
    }
}

///////////////////////////////////////////////////////////////////////

function InitMagazine()
{
    var book = $('#magazine');
    book.turn(
    {
        display: 'single',
        acceleration: true,
        gradients: true,
        inclination: '0.5',
        duration: 500,
    
        when: 
        {
            turned: function(e, page) 
            {
                if (!MainApp.app.eventBroswer.restorePage)
                {
                    MainApp.app.eventBroswer.curPage = page;
                }
            }   
        }
    });
    
    book.turn('page', this.curPage);
    MainApp.app.eventBroswer.restorePage = false;
}

///////////////////////////////////////////////////////////////////////

function CreatePageCarousel()
{
    var csstemp = '<tpl for=".">';
    csstemp    += '<div class="carousel_events"><img src="{thumb}" /></div>';
    csstemp    += '</tpl>';
    
    var list = Ext.create('Ext.List', 
    {
        flex    : 1,
        zIndex  : 800,
        store   : MainApp.app.database.eventsNearByStore,
        itemTpl : csstemp,
        inline  : {wrap : false},
        scrollable :
        {
            direction : 'horizontal',
            directionLock:true
        },
        
        listeners:
        {
            itemtap: function(view, index, item, e) 
            {
                var page = index + 2;
                var book = $('#magazine');
                book.turn('page', page);
                MainApp.app.eventBroswer.curPage = page;
            }
        }
    });
    
    return list;
}

///////////////////////////////////////////////////////////////////////

function GoToEventBrowser( dir, back )
{    
    //Reset the book
    if (dir == DIR_FORW) 
    {
        this.curPage = 1;
        this.restorePage = false;
    }
    else
    {
        this.restorePage = true;
    }
    
    this.screen.remove(this.htmlScreen, true);
    
    //Strange...but you have to swap to refresh somehow? Revisit one day... 
    this.carousel.hide();
    MainApp.app.database.getEventList("top"); 
    MainApp.app.eventList.index = 0; 
    
    MainApp.app.appLayer.currentLayer.animateActiveItem(this.screen, 
                                                    {type: 'slide', direction: dir});
}


///////////////////////////////////////////////////////////////////////
//                        New Event Screen Class
///////////////////////////////////////////////////////////////////////

function SuggestViewer()
{
    //Create event board...
    this.create         = CreateSuggestViewer;
    this.destroy        = DestroySuggestViewer;
    this.viewSuggestion = ViewSuggestFromGuid;
    this.refreshVotes   = RefreshVotes;
    
    this.goTo      = GoToSuggestViewer; 
    this.vote      = 0;
    this.screen    = new Ext.Panel(
    {
        layout: 'vbox',
        cls   : 'blankPage',
        hideAnimation: 
        {
            listeners: 
            {
                animationend: function()
                {
                    MainApp.app.suggestViewer.destroy();
                }
            }
        },
        
        showAnimation: 
        {
            listeners: 
            {
                animationstart: function()
                {
                    MainApp.app.suggestViewer.create();
                }
            }
        },
    });
}

///////////////////////////////////////////////////////////////////////
//                        CREATE GUI SCREENS
///////////////////////////////////////////////////////////////////////

function CreateSuggestViewer()
{
    //Header for board
    this.backButton =  Ext.create('Ext.Button', 
    { 
        text: 'BACK',
        ui  : 'back',
        align : 'left',
        handler: function()
        {
            if (MainApp.app.suggestViewer.back)
            {
                MainApp.app.suggestViewer.back.goTo(DIR_BACK)
            }
        }
    });
    
    this.localHeader  = Ext.create('Ext.TitleBar',
    {
        title : '<div class="word">SUGGESTION</div>',
        docked: 'top',

        defaults:
        {
            iconMask: true,
            xtype:'button',
            align : 'right',
        },

        items : 
        [this.backButton,
        {
            text : 'Save',
            ui   : 'action',
            handler: function()
            {
                MainApp.app.database.userRankSuggestion(MainApp.app.suggestViewer.guid,
                                                        MainApp.app.suggestViewer.vote); 
                                                        
                if (MainApp.app.suggestViewer.back)
                {
                    MainApp.app.suggestViewer.back.goTo(DIR_BACK);
                }  
            }
        }]
    });
    
    //////////////////////////////////////////////
    
    var loc = new google.maps.LatLng(MainApp.app.locationUtil.curlat, 
                                MainApp.app.locationUtil.curlon);
                                    
    this.map = Ext.create('Ext.Map', 
    {
        flex : 1,
        mapOptions : 
        {
            center : loc,  
            zoom : 12,
            mapTypeId : google.maps.MapTypeId.ROADMAP,
            navigationControl: true,
            navigationControlOptions: 
            {
                style: google.maps.NavigationControlStyle.DEFAULT
            }
        }
    });
    
    this.marker = new google.maps.Marker(
    {
        map: this.map.getMap(),
        position: loc
    });
    
    this.infoPop = new google.maps.InfoWindow();
    
    this.mapPanel = new Ext.Panel(
    {
        top     : 50,
        left    : 0,
        width   : 320,
        height  : 150,
        layout  : 'vbox',
        items   : [this.map],
    });
    
    this.topPanel = new Ext.Panel(
    {
        flex : 3,
        items : [this.mapPanel]
    });
    
    //////////////////////////////////////////////
        
    this.bottomPanel = new Ext.Panel(
    {
        flex : 1,
        items :
        [{
            xtype   :'toolbar',
            ui      : 'subtitle',
            cls     : 'subtitle',
            height  : 30,
            docked  : 'top',
            title   : 'VOTE!'
        }]
    });
    
        //Button Handler
    this.bottomPanel.element.on(
    {
        delegate: 'div',
        tap: function (e,t) 
        {
            var id = t.getAttribute('value');
            
            MainApp.app.suggestViewer.vote = id;
            MainApp.app.suggestViewer.refreshVotes();
        }
    });

    //////////////////////////////////////////////
    
    this.content = new Ext.Panel(
    {
        layout  : 'vbox',
        cls     : 'blankPage',
        flex    : 1,
        items: [this.localHeader, this.topPanel, this.bottomPanel],

        listeners:
        {
            activate:function()
            {
            },
        },
    });
    
    this.screen.insert(0, this.content);
}

///////////////////////////////////////////////////////////////////////

function DestroySuggestViewer(store, guid)
{
    var items = this.screen.getItems();
    
    //Iterate and destroy
    items.each(function(item, index, totalItems)
    {
        item.destroy();
    });
}

///////////////////////////////////////////////////////////////////////
//                        GUI EVENT FUNCTIONS
///////////////////////////////////////////////////////////////////////

function ViewSuggestFromGuid(store, guid)
{
    var event  = store.findRecord('guid', guid);
    this.guid  = guid;
    this.event = event;
    
    if (event)
    {
        //MAP STUFF
        if (this.marker) this.marker.setMap(null);

        //Create marker
        var loc = new google.maps.LatLng(event.data['lat'], event.data['lon']);
        this.marker = new google.maps.Marker(
        {
            position: loc,
            title : event.data['place'],
            map: this.map.getMap()
        });
        
        //Center map
        this.map.setMapCenter(loc);
        
        var placedate = event.data['place'] + '<br />' +event.data['date'].toDateString() + " " + event.data['date'].toLocaleTimeString();
        
        this.infoPop.setContent(placedate);
        this.infoPop.open(this.map.getMap(), this.marker);
        
        var htmlStr = '<div class="viewer_profile">';
        htmlStr    += '<img src="' + event.data['creatorthumb'] + '" />';
        htmlStr    += '</div>';
        
        htmlStr    += '<div class="viewer_username">' + event.data['creator'] + '</div>';
        htmlStr    += '<div class="viewer_place">'    + event.data['place'] + '</div>';
        htmlStr    += '<div class="viewer_date">'    + event.data['date'] + '</div>';
        htmlStr    += '<div class="viewer_comment">'    + event.data['desc'] + '</div>';
        htmlStr    += '<div class="viewer_bubble"><img src="Media/bubble.png"</div>';

        this.topPanel.setHtml(htmlStr);
        this.vote =  event.data['suggestScore'];

        this.refreshVotes();
    }
}

///////////////////////////////////////////////////////////////////////

function RefreshVotes()
{
    var img1  = "Media/face_0_dead.png";
    var img2  = "Media/face_1_dead.png";
    var img3  = "Media/face_2_dead.png";
    
    if (this.vote == 1)
    {
        img1  = "Media/face_0.png";
    }
    else if (this.vote == 2)
    {
        img2  = "Media/face_1.png";
    }
    else if (this.vote == 3)
    {
        img3  = "Media/face_2.png";
    }
    
    var htmlStr  = '<div class="viewer_no"><img src="' + img1 + '" value="1" /></div>';
    htmlStr   += '<div class="viewer_maybe" value="2"><img src="' + img2 + '" value="2" /></div>';
    htmlStr   += '<div class="viewer_yes" value="3"><img src="' + img3 + '" value="3" /></div>';
    
    this.bottomPanel.setHtml(htmlStr);
}

///////////////////////////////////////////////////////////////////////

function GoToSuggestViewer( dir, back , isEvent)
{
    if (back) this.back = back;
    MainApp.app.appLayer.currentLayer.animateActiveItem(this.screen, 
                                                        {type: 'pop', direction: dir});
}
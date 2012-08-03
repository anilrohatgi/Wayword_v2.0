

///////////////////////////////////////////////////////////////////////
//                        New Event Screen Class
///////////////////////////////////////////////////////////////////////

function NewEventEditor()
{
    //Create event board...
    this.create             = CreateNewEventEditor;
    this.createEventHandler = CreateEventHandler;
    this.createTempSelect  = CreateTemplateSelector;
    this.updateData        = UpdateEventData;
    this.updateTempl       = UpdatePrevTemplate;
    this.refresh           = RefreshEventData;
    this.goTo              = GoToEventEditor;
    
    this.tempSelect     = this.createTempSelect();
    this.screen         = this.create();
    
    this.createEventHandler();
    this.template       = "template_layout1";
}

///////////////////////////////////////////////////////////////////////
//                        CREATE GUI SCREENS
///////////////////////////////////////////////////////////////////////

function CreateNewEventEditor()
{
    this.backButton =  Ext.create('Ext.Button', 
    { 
        text: 'BACK',
        ui  : 'back',
        handler: function()
        {
            if (MainApp.app.newEventEditor.back)
            {
                MainApp.app.newEventEditor.back.goTo(DIR_BACK)
            }
        }
    });
    
    //Header for board
    this.header  = new Ext.Toolbar(
    {
        title   : 'PREVIEW',
        docked  :'top',
        
        items : 
        [{ xtype:'spacer' },
        {
            text    : 'Post',
            ui      : 'action',
            align   : 'right',
            handler: function () 
            {
                var thumb = "default.jpg";

                //Uploads the image
                if (MainApp.app.cameraUtil.tookPhoto)
                {
                    var date = new Date();
                    thumb = MainApp.app.database.getUserId() + "_" + date + ".jpg";

                    MainApp.app.database.uploadImage(MainApp.app.cameraUtil.photoUrl, 
                                                     thumb);
                
                    MainApp.app.database.createNewEvent(
                    MainApp.app.newEventForm.screen.getValues(),
                    MainApp.app.locationUtil.curlat,
                    MainApp.app.locationUtil.curlon,
                    MainApp.app.newEventEditor.temp,
                    thumb);
                    
                    MainApp.app.calendarLayer.layer.goTo();
                }
                else
                {
                    Ext.Msg.alert('Oops!', 'You forgot to take or choose a photo', 
                    function()
                    {
                    });
                }
            }
        }]                               
    });
    
    this.htmlScreen = new Ext.Panel(
    {
        flex : 6
    });
    
    var screen = new Ext.Panel(
    {
        id      : 'eventEditor',
        layout  : 'vbox',
        
        items: [this.header, this.htmlScreen, this.tempSelect],

        listeners:
        {
            activate:function()
            {
            },
        },
    });
    
    return screen;
}

///////////////////////////////////////////////////////////////////////
//                        GUI EVENT FUNCTIONS
///////////////////////////////////////////////////////////////////////

function CreateEventHandler()
{
    this.screen.element.on(
    {
        delegate: 'img',
        tap: function (e,t) 
        {
            var id = t.getAttribute('id');
            if (id == 'thumb')
            {
                MainApp.app.cameraUtil.camMenu.show();
            }
        }
    });
    
    this.screen.element.on(
    {
        delegate: 'header',
        tap: function (e) 
        {
            Ext.Msg.prompt('Header', 'Enter Header Text', 
            function(button, value)
            {
                if (button == 'ok')
                {
                    MainApp.app.newEventForm.screen.setValues(
                    {
                          location : value
                    });
                               
                    MainApp.app.newEventEditor.refresh();
                }
            });
        }
    });
    
    this.screen.element.on(
    {
        delegate: 'description',
        tap: function (e) 
        {
            Ext.Msg.prompt('Description', 'Enter Event Text', 
            function(button, value)
            {
                if (button == 'ok')
                {
                    MainApp.app.newEventForm.screen.setValues(
                    {
                        description : value
                    });

                    MainApp.app.newEventEditor.refresh();
                }
            });
        }
    });
}

///////////////////////////////////////////////////////////////////////

function CreateTemplateSelector()
{
    var csstemp = '<tpl for="."><div class="carousel_events">';
    csstemp    += '<img src="'+ ServerBase+ 'templates/Media/{thumb}" style="z-index:999999"/>';
    csstemp    += '</div></tpl>';
    
    var list = Ext.create('Ext.List', 
    {
        flex    : 1,
        store   : MainApp.app.database.templateStore,
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
                var record = view.getStore().getAt(index);
                var name  = record.get('name');
                MainApp.app.newEventEditor.updateTempl(name);
            }
        }
    });
    
    return list;
}

///////////////////////////////////////////////////////////////////////
//                        EVENTS
///////////////////////////////////////////////////////////////////////

function UpdateEventData(data, newTemp)
{
    var template = newTemp;
    var header   = data.location;
    var desc     = data.description;
    var start    = data.startdate;
    var author   = MainApp.app.database.userInfo['thumb'];
    var email    = MainApp.app.database.userInfo['email'];
    
    var thumb    = MainApp.app.cameraUtil.photoUrl;
    
    var user     = MainApp.app.database.userInfo['name'];
    var dist     = data.dist;
    var joined   = "0";
    var guid     = 0;
    var lat      = MainApp.app.locationUtil.curlat;
    var lon      = MainApp.app.locationUtil.curlon;
    var isEvent  = 0;
    
    var item = 
    {
        template     : template,
        place        : header,
        desc         : desc,
        thumb        : thumb,
        joined       : 0,
        start        : start,
        creatorthumb : author,
        creatoremail : email,
        creator      : user,
        dist         : 0,
        guid         : guid,
        lat          : lat,
        lon          : lon,
        isEvent      : isEvent
    }
    
    var htmlStr = DrawEventPoster(item);

    this.htmlScreen.replaceCls(this.temp, template);
    
    this.temp = template;
    this.htmlScreen.setHtml(htmlStr);
}

///////////////////////////////////////////////////////////////////////

function RefreshEventData()
{
    MainApp.app.newEventEditor.updateData(MainApp.app.newEventForm.screen.getValues(), 
                                          this.temp);
}

///////////////////////////////////////////////////////////////////////

function UpdatePrevTemplate( newTemplate )
{
    MainApp.app.newEventEditor.updateData(MainApp.app.newEventForm.screen.getValues(), newTemplate);
}

///////////////////////////////////////////////////////////////////////

function GoToEventEditor( dir, back, mode )
{
    this.mode = mode;
    if (back) this.back = back;
    
    if (dir == DIR_FORW)
    {
        MainApp.app.newEventForm.reset();
        this.temp = "template_layout1";
        this.refresh();
    }
    
    MainApp.app.cameraUtil.dest = PHOTO_EVENT;

    MainApp.app.database.templateStore.filter('select', 1);
    MainApp.app.appLayer.currentLayer.animateActiveItem(this.screen, 
                                                        {type: 'slide', direction: dir}); }
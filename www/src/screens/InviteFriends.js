

///////////////////////////////////////////////////////////////////////
//                        New Event Screen Class
///////////////////////////////////////////////////////////////////////

function InviteList()
{
    //Create event board...
    this.create      = CreateInviteList;
    this.goTo        = GoToInviteListList;
    this.makeEmails  = MakeEmails;
    this.submit      = SubmitInvites;
    this.ready       = false;
    
    this.screen      = this.create();
}

///////////////////////////////////////////////////////////////////////
//                        CREATE GUI SCREENS
///////////////////////////////////////////////////////////////////////

function CreateInviteList()
{
    //Button for submission
    this.backButton =  Ext.create('Ext.Button', 
    { 
        text: 'BACK',
        ui  : 'back',
        handler: function()
        {
            if (MainApp.app.inviteList.back)
            {
                MainApp.app.inviteList.back.goTo(DIR_BACK);
            }
        }
    });
    
    this.localHeader  = new Ext.Toolbar(
    {
        title : 'INVITE FRIENDS',
        docked: 'top',
        layout: 
        {
            pack: 'justify',
            align: 'center'
        },

        defaults:
        {
            iconMask: true,
            xtype:'button',
        },

        items : [this.backButton,
        {
            text : 'OK',
            ui   : 'action',
            handler : function()
            {
                MainApp.app.inviteList.ready = true;
                if (MainApp.app.inviteList.back)
                {
                    MainApp.app.inviteList.back.goTo(DIR_BACK);
                }
            }
        }],
    });

    var csstemp = '<tpl for=".">';
    csstemp    += '<div class="listclass">';
    csstemp    += '<div class="friend_photo"><img src="{thumb}"/></div>';
    csstemp    += '<div class="friend_name">{name}</div>';
    csstemp    += '</div>';
    csstemp    += '</tpl>';
    
    var screen = Ext.create('Ext.List', 
    {
        iconCls    : 'team',
        cls        : 'blankPage',
        title      : 'Your Friends',
        fullscreen : true,
        mode: 'MULTI',
                            
        store: MainApp.app.database.friendStore,
        itemTpl: csstemp,
        items : [this.localHeader],
    });
    
    return screen;
}

///////////////////////////////////////////////////////////////////////

function MakeEmails(message)
{
    var userData = MainApp.app.database.getUserData();    
    var event = MainApp.app.database.eventsNearByStore.findRecord('guid', this.guid, MainApp.app.eventList.index);

    //Build one from the current menu data
    if (!event)
    {
        //form data
        var data = MainApp.app.newEventForm.screen.getValues();
        event = 
        {
            data:
            {
                start : MainApp.app.calendarScreen.dateSelect,
                place : data.location,
                desc  : data.description,
                guid  : this.guid
            }
        };
    }
    
    //Iterate through the recipients
    var friends = this.screen.getSelection();  

    if (friends && event)
    {
        friends.forEach(function(item)
        {
            var joinLink = DBFile + '?action=mailEventAccept&userid=' + item.data['userid'] + '&guid=' + event.data['guid'];
                        
            var subj = userData['name'] + " wants you to join them!";
            var to   = item.data['email'];
                        
            MainApp.app.database.sendEmail( to, 
                                            userData['name'], 
                                            event.data['place'],
                                            event.data['desc'],
                                            event.data['start'].toDateString(),
                                            message,
                                            joinLink );
        });
    }
}

///////////////////////////////////////////////////////////////////////

function SubmitInvites(guid)
{
    this.guid = guid;
    
    Ext.Msg.prompt('Message', 'Add a personal message to your email', 
    function(button, value)
    {
        if (button == 'ok')
        {
            MainApp.app.database.createNewEvent(
                                MainApp.app.newEventForm.screen.getValues(),
                                MainApp.app.eventMap.lat,
                                MainApp.app.eventMap.lon,
                                MainApp.app.newEventEditor.temp,
                                "default.jpg",
                                guid);
                
            MainApp.app.database.checkUserin(MainApp.app.inviteList.guid,
                                     MainApp.app.calendarScreen.dateSelect);
                                     
            MainApp.app.inviteList.makeEmails(value);
            
            //Reset menu
            MainApp.app.calendarScreen.ready = false;
            MainApp.app.inviteList.ready     = false;
            MainApp.app.eventMap.ready       = false;
                    
            MainApp.app.calendarLayer.layer.goTo();
        }
    });
}
                 
///////////////////////////////////////////////////////////////////////

function GoToInviteListList( dir, back, guid )
{
    MainApp.app.database.getUserFriends();
    this.guid = guid;
    
    if (back) this.back = back;
    
    MainApp.app.appLayer.currentLayer.animateActiveItem(this.screen, 
                                                        {type: 'flip', direction: dir});
}
MainApp = Ext.application(
{
    name: 'MainApp',

    requires: 
    [
        'Ext.MessageBox'
    ],

    views: ['Main'],

    icon: 
    {
        '57' : 'resources/icons/Icon.png',
        '72' : 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
    },

    isIconPrecomposed: true,

    startupImage: 
    {
        '320x460'  : 'resources/startup/320x460.jpg',
        '640x920'  : 'resources/startup/640x920.png',
        '768x1004' : 'resources/startup/768x1004.png',
        '748x1024' : 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },

    launch: function() 
    {
        // Destroy the #appLoadingIndicator element
        
        //Create the helper files.
        this.database     = new DataBaseInterface();
        this.cameraUtil   = new CameraUtils();
        this.locationUtil = new GeoLocation();
        this.environment  = new Environment();
        
        //Create screens
        this.instructPop        = new InstructionPop();
        this.eventBroswer       = new EventBrowser();
        this.newEventForm       = new NewEventForm();
        this.newEventEditor     = new NewEventEditor();
        this.newEventMenu       = new NewEventMenu();
        this.eventMap           = new EventMap();
        this.loginScreen        = new LoginScreen();
        this.userInfoScreen     = new UserInfoScreen();
        this.userInfoForm       = new UserInfoForm();
        this.calendarScreen     = new Calendar();
        this.eventViewer        = new EventViewer();
        this.eventList          = new EventList();
        this.friendsList        = new FriendsList();
        this.inviteList         = new InviteList();
        this.profileViewer      = new ProfileView();
        this.guestList          = new GuestList();
        this.contactList        = new ContactsList();
        this.chatWindow         = new ChatWindow();
        this.suggestViewer      = new SuggestViewer();
        this.newSuggestMenu     = new NewSuggestMenu();
                          
        //Create the layers
        this.newEventLayer    = new NewEventLayer();
        this.browseEventLayer = new BrowseEventLayer();
        this.userInfoLayer    = new UserInfoLayer();
        this.calendarLayer    = new CalendarLayer();
        this.friendsLayer     = new FriendsLayer();
        
        this.appLayer         = new AppLayer();
        this.loginLayer       = new LoginLayer();

    },

    onUpdated: function() 
    {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) 
            {
                if (buttonId === 'yes') 
                {
                    window.location.reload();
                }
            }
        );
    }
});

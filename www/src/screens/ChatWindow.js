

///////////////////////////////////////////////////////////////////////
//                        CHAT WINDOW 
///////////////////////////////////////////////////////////////////////

function ChatWindow()
{
    //Create functions
    this.create       = CreateChatWindow;
    this.goTo         = GoToChatScreen;
    
    //Chat functions
    this.initChat       = InitPubNub;
    this.loadChat       = LoadChat;
    this.sendMessage    = SendChatMessage;
    this.scrollToBottom = ScrollToBottom;
    
    this.chatId      = 'Wayword_default';
    
    this.screen       = this.create();
    this.pubnub       = this.initChat();
}

///////////////////////////////////////////////////////////////////////
//                        CREATE GUI SCREENS
///////////////////////////////////////////////////////////////////////

function CreateChatWindow()
{
    this.backButton =  Ext.create('Ext.Button', 
    { 
        text: 'BACK',
        ui  : 'back',
        handler: function()
        {
            if (MainApp.app.chatWindow.back)
            {
                MainApp.app.chatWindow.back.goTo(DIR_BACK)
            }
        }
    });
    
    this.localHeader  = new Ext.Toolbar(
    {
        title   : 'EVENT CHAT',
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

        items : 
        [this.backButton]
    });
    

    // Create a text field with a name and palceholder
    this.chatField = Ext.create('Ext.field.Text', 
    {
        name: 'chat_input',
        id  : 'chat_input',
        placeHolder: 'type chat here',
        flex: 7,
        listeners: 
        {
            action: this.sendMessage,
            focus :  function() 
            {
                MainApp.app.chatWindow.messageList.getScrollable().getScroller().scrollToEnd();
            }
        }
    });

    this.submitButton = Ext.create('Ext.Button', 
    {
        iconCls : 'reply',
        iconMask: true,
        text    : 'Send',
        ui      : 'confirm',
        flex    : 1,
        listeners: 
        {
            tap:  this.sendMessage,
        }
    });

    this.messageList = Ext.create('Ext.List', 
    {
        itemTpl: '<b>{user}</b>: {message} ',
        data: 
        [{ 
            user: 'Phil',
            message: 'lol'
        }],
    });


    var screen = Ext.create('Ext.Container', 
    { 
        fullscreen: true,
        layout: 'vbox',
        items: 
        [this.localHeader,
        {
            
            xtype: 'panel',
            layout: 'fit',
            flex: 7,
            items: 
            [
                this.messageList,
            ]
        },
        {
            xtype: 'toolbar',
            flex: 1.5,
            items: 
            [
                this.chatField,
                this.submitButton,
            ]
        }]
    });

    return screen;
}

///////////////////////////////////////////////////////////////////////
//                        CHAT FUNCTIONS
///////////////////////////////////////////////////////////////////////

function InitPubNub()
{
    var pubnub = PUBNUB.init(
    {
          publish_key   : 'demo',
          subscribe_key : 'demo',
          ssl           : false,
          origin        : 'pubsub.pubnub.com'
    });
    
    return pubnub;
}

///////////////////////////////////////////////////////////////////////

function LoadChat()
{
    this.pubnub.subscribe(
    {
        channel  : this.chatId,
        callback : function(message) 
        {
            if (message.name && (message.name == 'chat_message')) 
            {
                var prev_length = MainApp.app.chatWindow.messageList.getStore().length;
                MainApp.app.chatWindow.messageList.getStore().add(
                {
                      user   : (message.data.user || nobody),
                      message: message.data.message 
                });

                MainApp.app.chatWindow.scrollToBottom();
                setTimeout( function() 
                {
                    MainApp.app.chatWindow.scrollToBottom();
                }, 10);
                
                setTimeout( function() 
                {
                    MainApp.app.chatWindow.scrollToBottom();
                }, 50);
            }
        }    
    });
    
    //Load the history of this chat.
    this.pubnub.history(
        {
            channel : this.chatId,
            limit : 10 
        }, 
        function(messages) 
        {
            MainApp.app.chatWindow.messageList.getStore().removeAll();
            console.log(messages);
            for (m in messages) 
            {
                var message = messages[m];
                MainApp.app.chatWindow.messageList.getStore().add(
                {
                    user: (message.data.user || nobody),
                    message: message.data.message 
                });
            }

            setTimeout( function() 
            {
                MainApp.app.chatWindow.scrollToBottom();
            }, 100);
        }
    ); 
}

///////////////////////////////////////////////////////////////////////

function SendChatMessage() 
{
    //Get the user name.
    var userData = MainApp.app.database.getUserData();
    var name = userData['name'];
    
    MainApp.app.chatWindow.pubnub.publish(
    {
        channel  : MainApp.app.chatWindow.chatId,
        message  : 
        { 
            name : "chat_message",
            data : 
            {
                message : Ext.getCmp('chat_input').getValue(),
                user    : (name || "nobody")
            } 
        },
        callback : function() 
        {
            Ext.getCmp('chat_input').setValue('');
            Ext.getCmp('chat_input').focus();
        }
    });
}
        
///////////////////////////////////////////////////////////////////////

function ScrollToBottom() 
{
    this.messageList.getScrollable().getScroller().scrollToEnd();
}

///////////////////////////////////////////////////////////////////////

function GoToChatScreen(dir, back, id)
{
    //Unsubscribe from previous chat.
    this.pubnub.unsubscribe({ channel : this.chatId });
    
    //Now subscribe to new one
    this.chatId = 'WayWord_' + id;
    this.loadChat();
    
    if (back) this.back = back;
    MainApp.app.appLayer.currentLayer.animateActiveItem(this.screen, 
                                                        {type: 'slide', direction: dir});
}

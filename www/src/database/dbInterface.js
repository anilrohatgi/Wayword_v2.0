///////////////////////////////////////////////////////////////////////
//                         Databse Manager
///////////////////////////////////////////////////////////////////////
           
Ext.define('EventInfo',
{
    extend: 'Ext.data.Model',
    config :
    {
        fields: 
        [
            {name: 'items',     type: 'auto'},
            {name: 'desc',      type: 'string'}, 
            {name: 'place',     type: 'string'}, 
            {name: 'thumb',     type: 'string'}, 
            {name: 'template',  type: 'string'},
            {name: 'guid',      type: 'int'}, 
            {name: 'lat',       type: 'float'}, 
            {name: 'lon',       type: 'float'}, 
            {name: 'dist',      type: 'int'},
            {name: 'views',     type: 'int'},
            {name: 'joined',    type: 'int'},
            {name: 'dirty',     type: 'int'},
            {name: 'popularity',type: 'int'},
            {name: 'address',   type: 'string'},
         
            {name: 'creator',        type: 'string'},
            {name: 'creatoremail',   type: 'string'},
            {name: 'creatorthumb',   type: 'string'},
            
            {name: 'isEvent',   type: 'int'},
            {name: 'start',     type: 'date', dateFormat: 'c'},
            {name: 'pinday',    type: 'date', dateFormat: 'c'}
        ]
    }
});

Ext.define('UserInfo',
{
    extend: 'Ext.data.Model',
    config : 
    {
        fields: 
        [
            {name: 'name'  ,  type: 'string'},
            {name: 'userid',  type: 'int'},
            {name: 'thumb',   type: 'string'},
            {name: 'bio',     type: 'string'},
            {name: 'score' ,  type: 'score'},
            {name: 'email' ,  type: 'string'},
            {name: 'level'  , type: 'string'},
            {name: 'dirty',   type: 'int'},
        ]
    }
});

Ext.define('TemplateInfo',
{
    extend: 'Ext.data.Model',
    config : 
    {
        fields: 
        [
            {name: 'name'  ,  type: 'string'},
            {name: 'thumb' ,  type: 'string'},
            {name: 'id',      type: 'int'},
            {name: 'select',  type:'int'}  
        ]
    }
});

Ext.define('ContactInfo',
{
    extend: 'Ext.data.Model',
    config : 
    {
        fields: 
        [
            {name: 'id', type: 'int'},
            {name: 'givenName', type: 'string'},
            {name: 'familyName', type: 'string'},
            {name: 'emails', type: 'auto'},
            {name: 'phoneNumbers', type: 'auto'}
        ]
    }
});


///////////////////////////////////////////////////////////////////////

function DataBaseInterface() 
{
    this.eventsNearByStore = CreateNearByStore();
    this.userInfoStore     = CreateUserInfoStore();
    this.friendStore       = CreateFriendStore();
    this.goingStore        = CreateGoingStore();
    this.templateStore     = CreateTemplateStore();
    this.contactStore      = CreateContactStore();
    
    this.loadingMask       = CreateLoadingScreen();  
    
    this.getEventList      = GetEventList;
    this.getUserInfo       = GetUserInfo;
 
    this.getUserId         = GetUserId;
    this.checkUserin       = CheckUserIn;
    this.getUserData       = GetUserData;
    this.addUserEvent      = AddUserEvent;
    this.removeUserEvent   = RemoveUserEvent;
    this.addPointsForUser  = AddPointsForUser;
    this.userJoinEvent     = UserJoinEvent;
    this.uploadImage       = UploadImage;
    this.deleteEvent       = DeleteEvent;
    
    this.getGoingList      = GetGoingList;
    
    this.getUserFriends    = GetUserFriends;
    this.removeFriend      = BreakFriendship;
    
    this.sendFriendEmail   = SendFriendEmail;
    this.sendEmail         = SendEmail;
    
    this.createNewUser     = CreateNewUser;
    this.loginUser         = LoginUser;
    this.updateUserData    = UpdateUserData;
    
    this.createNewEvent    = CreateNewEvent;
    this.parseContacts     = PopulateContacts;
    
    this.userData          = null;
    this.loggedIn          = false;
    this.contactsArray     = [];
}


///////////////////////////////////////////////////////////////////////

function CreateLoadingScreen()
{
    var loadingMask = new Ext.LoadMask(Ext.getBody(), {msg:"Please wait..."}); 
    
    // invokes before each ajax request 
    Ext.Ajax.on('beforerequest', function()
    {        
        loadingMask.show();
    });
    
    Ext.Ajax.on('requestcomplete', function()
    {      
        loadingMask.hide();
    });             
    
    Ext.Ajax.on('requestexception', function()
    {         
        //TODO: need to handle the server exceptions
    });
    
    return loadingMask;
}

///////////////////////////////////////////////////////////////////////
//                         Store Creator
///////////////////////////////////////////////////////////////////////

function CreateNearByStore()
{
    var store = Ext.create('Ext.data.Store',
    {
        model: 'EventInfo',
        proxy: 
        {
            type: 'ajax',
            url : DBFile,
            reader: 
            {
                type   : 'xml',
                record : 'items'
            },
                           
            extraParams: 
            {
                action: 'getEvents',
                userId : '0',
                filter : 'top',
                lat : '0',
                lon : '0',
                dist: '25'
            }   
        },
        
        grouper: 
        {
            groupFn: function(record) 
            {
                var retString = " YOUR HOT SPOTS"
                if (record.get('isEvent') == 1)
                {
                    retString  = "EVENT : ";
                    retString +=  record.get('start').toDateString();
                }
                
                return retString;
            },
        }
    });
    
    //When this store loads, we should populate the screen..
    store.on('load', function () 
    {
        MainApp.app.eventBroswer.loadActiveEvents(MainApp.app.database.eventsNearByStore);
        MainApp.app.calendarScreen.refresh(MainApp.app.database.eventsNearByStore);
    });
    
    return store;
}

///////////////////////////////////////////////////////////////////////

function CreateUserInfoStore()
{
    var store = Ext.create('Ext.data.Store',
    {
        model: 'UserInfo',
        proxy: 
        {
            type: 'ajax',
            url : DBFile,

            extraParams: 
            {
                action: 'getUserInfo',
                email:  'None'
            },
                        
            reader: 
            {
                type:   'xml',
                record: 'items'
            }
        },
    });
    
    //When this store loads, we should populate the screen..
    store.on('load', function () 
    {
        //Get the guys name and compare..
        var returned = MainApp.app.database.userInfoStore.data.items[0];
        if (returned)
        {
             if (returned.data['email'].toLowerCase() == 
                 MainApp.app.database.curUserName.toLowerCase()) 
             {
                MainApp.app.database.userInfo = returned.data;
                MainApp.app.database.loggedIn = true;
                MainApp.app.userInfoForm.refresh();
                MainApp.app.userInfoScreen.loadData(MainApp.app.database.getUserData());
             }
             
             MainApp.app.profileViewer.loadData(returned.data);
        }
        else
        {
             MainApp.app.profileViewer.loadData(null);
        }
    });
    
    return store;
}

///////////////////////////////////////////////////////////////////////

function CreateFriendStore()
{
    var store = Ext.create('Ext.data.Store',
    {
        model: 'UserInfo',
        proxy: 
        {
            type: 'ajax',
            url : DBFile,

            extraParams: 
            {
                action: 'getFriends',
                userId: '0'
            },

            reader: 
            {
                type:   'xml',
                record: 'items'
            }
        },
    });
    
    //When this store loads, we should populate the screen..
    store.on('load', function () 
    {
    });
    
    return store;
}

///////////////////////////////////////////////////////////////////////

function PopulateContacts()
{
    MainApp.app.database.contactStore.removeAll();
    
    if (navigator.contacts)
    {
        var options = new ContactFindOptions();
        options.filter=""; 
        options.multiple=true; 

        navigator.contacts.find(
            ['id', 'name', 'emails', 'phoneNumbers', 'addresses'],
            function(deviceContacts) 
            {
                for (var i = 0; i < deviceContacts.length; i++) 
                {
                    var deviceContact = deviceContacts[i];
                    var contact =
                    {
                        id: deviceContact.id,
                        givenName: deviceContact.name.givenName,
                        familyName: deviceContact.name.familyName,
                        emails: deviceContact.emails,
                        phoneNumbers: deviceContact.phoneNumbers
                    };
                    
                    contact.deviceContact = deviceContact;
                    
                    if (contact.emails)
                    {
                        //Add all the emails now.
                        for (var e = 0; e < contact.emails.length; e++)
                        {
                            var email = 
                            {
                                emails    : contact.emails[e].value,
                                givenName : contact.givenName,
                                familyName: contact.familyName
                            };
                            
                            MainApp.app.database.contactStore.add(email);
                        }
                    }
                }
                
                //Now sort.
                MainApp.app.database.contactStore.sort('emails', 'ASC');
            },
            function onError(contactError) 
            {
                alert('onError!');
            },
            options);   
    }  
}

///////////////////////////////////////////////////////////////////////

function CreateContactStore()
{    
    var store = Ext.create('Ext.data.Store',
    {
        model: 'ContactInfo'
    });
    
    return store;
}

///////////////////////////////////////////////////////////////////////

function CreateGoingStore()
{
    var store = Ext.create('Ext.data.Store',
    {
        model: 'UserInfo',
        proxy: 
        {
            type: 'ajax',
            url : DBFile,

            extraParams: 
            {
                action: 'getGoingList',
                guid: '0'
            },

            reader: 
            {
                type:   'xml',
                record: 'items'
            }
        },
    });
    
    //When this store loads, we should populate the screen..
    store.on('load', function () 
    {

    });
    
    return store;
}


///////////////////////////////////////////////////////////////////////

function CreateTemplateStore()
{
    var store = Ext.create('Ext.data.Store',
    {
        model: 'TemplateInfo',
        autoLoad: true,
        proxy: 
        {
            type: 'ajax',
            url : DBFile,
            reader: 
            {
                type: 'xml',
                record: 'items'
            },

            extraParams: 
            {
                action: 'getTemplates'
            }    
        }
    });
    
    //When this store loads, we should populate the screen..
    store.on('load', function () 
    {
        //Include all of the templates in the browser
        MainApp.app.eventBroswer.loadTemplates();
    });
    
    return store;
}

///////////////////////////////////////////////////////////////////////
//                         DB Functions Creator
///////////////////////////////////////////////////////////////////////

function GetUserInfo( email )
{
    this.userInfoStore.getProxy().setExtraParam('email', email);
    this.userInfoStore.load();   
}

///////////////////////////////////////////////////////////////////////

function GetUserId()
{
    var id = -1;
    
    if (MainApp.app.database.loggedIn && MainApp.app.database.userInfo)
    {
        id = MainApp.app.database.userInfo['userid'];
    }
    
    return id;
}

///////////////////////////////////////////////////////////////////////

function GetUserData()
{
    var data = null;
    
    if (MainApp.app.database.loggedIn && MainApp.app.database.userInfo)
    {
        data = MainApp.app.database.userInfo;
    }
    
    return data;
}

///////////////////////////////////////////////////////////////////////

function UpdateUserData( data, thumb )
{
    var userid = GetUserId();
    
    Ext.Ajax.request(
    {
        url: DBFile + '?action=updateUserData',
        method: 'post',
        params:
        {
            userid : userid,
            username : data.username,
            bio    : data.biography,
            thumb  : thumb
        },

        success: function(response, opts) 
        {
             console.log(response);
             MainApp.app.database.userInfoStore.load();  
        }
    });
}

///////////////////////////////////////////////////////////////////////

function GetUserFriends()
{
    var userId = GetUserId();
    
    this.friendStore.getProxy().setExtraParam('userId', userId);
    this.friendStore.load(function(records, operation, success) 
    {
    });
}

///////////////////////////////////////////////////////////////////////

function GetGoingList( eventGuid )
{
    this.goingStore.getProxy().setExtraParam('guid', eventGuid);
    this.goingStore.load(function(records, operation, success) 
    {
    });
}

///////////////////////////////////////////////////////////////////////

function GetEventList( filter )
{
    var userId = GetUserId();
    
    this.eventsNearByStore.getProxy().setExtraParam('userId', userId);
    this.eventsNearByStore.getProxy().setExtraParam('lat', MainApp.app.locationUtil.curlat);
    this.eventsNearByStore.getProxy().setExtraParam('lon', MainApp.app.locationUtil.curlon);
    this.eventsNearByStore.getProxy().setExtraParam('filter', filter);
    this.eventsNearByStore.getProxy().setExtraParam('dist', 25);
    
    this.eventsNearByStore.load(function(records, operation, success) 
    {
        console.log(success);
    }); 
}

///////////////////////////////////////////////////////////////////////

function AddUserEvent( guid, date )
{
    var userid = GetUserId();
    
    Ext.Ajax.request(
    {
        url: DBFile + '?action=addUserEvent',
        method: 'post',
        params: 
        {   
            guid    : guid,
            userid  : userid,
            date    : date
        },
        success: function(response, opts) 
        {
            console.log(response);
            MainApp.app.database.eventsNearByStore.load();
        }
    });
}

///////////////////////////////////////////////////////////////////////

function RemoveUserEvent( guid )
{
    var userid = GetUserId();
    
    Ext.Ajax.request(
    {
        url: DBFile +'?action=removeUserEvent',
        method: 'post',
        params: 
        {   
            guid    : guid,
            userid  : userid
        },
        success: function(response, opts) 
        {
             MainApp.app.database.eventsNearByStore.load();
        }
    });
}

///////////////////////////////////////////////////////////////////////

function CreateNewEvent( data, lat, lon, template, thumb, guid )
{
    var userid = GetUserId();
    
    Ext.Ajax.request(
    {
        url: DBFile + '?action=createNewEvent',
        method: 'post',
        params:
        {
            userid : userid,
            desc   : data.description,
            place  : data.location,
            start  : data.startdate,
            lat    : lat,
            lon    : lon,
            temp   : template,
            thumb  : thumb,
            address: data.address,
            guid   : guid
        },
  
        success: function(response, opts) 
        {
            console.log(response);
            MainApp.app.database.addPointsForUser(100);
        }
    });
}

///////////////////////////////////////////////////////////////////////

function DeleteEvent( guid )
{
    Ext.Ajax.request(
    {
        url: DBFile + '?action=deleteEvent',
        method: 'post',
        params: 
        {   
            guid  : guid,
        },
                     
        success: function(response, opts) 
        {
            MainApp.app.database.eventsNearByStore.load();
        }
    });
}

///////////////////////////////////////////////////////////////////////

function CreateNewUser(data)
{
    UserName = data.username;
    this.curUserName = data.username;
    this.curPassword = data.password;
    
    Ext.Ajax.request(
    {
        url: DBFile + '?action=createNewUser',
        method: 'post',
        
        params:
        {
            userName : data.username,
            passWord : data.password
        },

        success: function(response, opts) 
        {
            if (response.responseText != "")
            {
                alert(response.responseText);
            }
            else
            {
                //First get the user information..
                window.localStorage.setItem("username", MainApp.app.database.curUserName);
                window.localStorage.setItem("password", MainApp.app.database.curPassword);
 
                //First get the user information..
                MainApp.app.database.getUserInfo(UserName);
                MainApp.app.loginLayer.layer.setActiveItem(MainApp.app.appLayer.layer);
            }
        }
    });
}

///////////////////////////////////////////////////////////////////////

function LoginUser(data)
{
    UserName = data.username;
    
    this.curUserName = data.username;
    this.curPassword = data.password;
    
    Ext.Ajax.request(
    {
        url: DBFile + '?action=loginUser',
        method: 'post',

        params:
        {
            userName : data.username,
            passWord : data.password
        },

        success: function(response, opts) 
        {
            if (response.responseText != "")
            {
                alert(response.responseText);
            }
            else
            {
                //Cache login information
                window.localStorage.setItem("username", MainApp.app.database.curUserName);
                window.localStorage.setItem("password", MainApp.app.database.curPassword);
                
                //First get the user information..
                MainApp.app.database.getUserInfo(UserName);
                MainApp.app.loginLayer.layer.setActiveItem(MainApp.app.appLayer.layer);
            }
        }
    });
}

///////////////////////////////////////////////////////////////////////

function AddPointsForUser( points )
{
    var userid = GetUserId();
    
    Ext.Ajax.request(
    {
        url: DBFile + '?action=addPointsForUser',
        method: 'post',
        params:
        {
            userid : userid,
            points : points
        },

        success: function(response, opts) 
        {
            MainApp.app.database.userInfoStore.load(); 
        }
    });
}

///////////////////////////////////////////////////////////////////////

function CheckUserIn( guid , date)
{
    var userid = GetUserId();
    MainApp.app.database.addPointsForUser(100);
    
    this.addUserEvent(guid, date);
}

///////////////////////////////////////////////////////////////////////

function UserJoinEvent( guid )
{
    Ext.Ajax.request(
    {
        url: DBFile + '?action=userJoinEvent',
        method: 'post',
        params:
        {
            userid : userid,
            guid   : guid
        },

        success: function(response, opts) 
        {
            console.log(response);
        }
    });
}

///////////////////////////////////////////////////////////////////////

function BreakFriendship( user2 )
{
    var user1 = GetUserId();
    
    Ext.Ajax.request(
    {
        url: DBFile + '?action=removeFriends',
        method: 'post',
        params:
        {
            user1   : user1,
            user2   : user2
        },

        success: function(response, opts) 
        {
            //refresh the friends list
            MainApp.app.database.getUserFriends();
        }
    });
}

///////////////////////////////////////////////////////////////////////
//                         Image Upload
///////////////////////////////////////////////////////////////////////

function UploadImage ( imageURL, imgName )
{
    var options      = new FileUploadOptions();
    options.fileKey  ="file";
    options.fileName = imageURL.substr(imageURL.lastIndexOf('/')+1);
    options.mimeType ="image/jpeg";
    
    var params = new Object();
    params.thumb = imgName;
    
    options.params      = params;
    options.chunkedMode = false;
    
    var ft = new FileTransfer();
    ft.upload(imageURL, 
              DBFile + "?action=uploadPhoto", 
              win, fail, options);
}

///////////////////////////////////////////////////////////////////////

function win(r) 
{
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
}

///////////////////////////////////////////////////////////////////////

function fail(error) 
{
    alert("An error has occurred: Code = " = error.code);
}

///////////////////////////////////////////////////////////////////////
//                         Image Upload
///////////////////////////////////////////////////////////////////////

function SendEmail ( to, user, head, desc, start, message, link )
{
    Ext.Ajax.request(
    {
        url: DBFile + '?action=sendEmail',
        method: 'post',
        params:
        {
            to      : to,
            user    : user,
            head    : head,
            desc    : desc,
            start   : start,
            message : message,
            link    : link,
        },

        success: function(response, opts) 
        {
            console.log(response);
        }
    });
}

///////////////////////////////////////////////////////////////////////

function SendFriendEmail ( to, user, thumb, link )
{
    Ext.Ajax.request(
    {
        url: DBFile + '?action=sendFriendEmail',
        method: 'post',
        params:
        {
            to      : to,
            user    : user,
            thumb   : thumb,
            link    : link
        },

        success: function(response, opts) 
        {
            console.log(response);
        }
    });
}


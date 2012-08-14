

///////////////////////////////////////////////////////////////////////
//                        New Event Screen Class
///////////////////////////////////////////////////////////////////////

function UserInfoForm()
{
    //Create event board...
    this.create      = CreateUserInfoFormScreen;
    this.destroy     = DestroyUserInfoFormScreen
    this.updateThumb = UpdateUserThumb;
    this.refresh     = PopulateUserForm;
    this.goTo        = GoToUserForm;
    
    this.screen = Ext.create('Ext.form.Panel',
    {
        title      : 'Edit Profile',
        scrollable : 'vertical',
        cls        : 'blankPage',
        
        layout: 
        {
            type: 'vbox',
            pack: 'center'                        
        },
        
        listeners:
        {
            deactivate : function ()
            {
                MainApp.app.userInfoForm.destroy();
            }
        },
	});
    
    //set your thumbnail.
    this.updateThumb("Media/camera.jpg");
}

///////////////////////////////////////////////////////////////////////
//                        CREATE GUI SCREENS
///////////////////////////////////////////////////////////////////////

function CreateUserInfoFormScreen()
{
    this.destroy();
    
    //Button for submission
    this.backButton =  Ext.create('Ext.Button', 
    { 
        text: 'BACK',
        ui  : 'back',
        handler: function()
        {
            if (MainApp.app.userInfoForm.back)
            {
                MainApp.app.userInfoForm.back.goTo(DIR_BACK);
            }
        }
    });
    
    this.localHeader  = new Ext.Toolbar(
    {
        title  : '<div class="way">EDIT </div><div class="word"> PROFILE</div>',
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
        [this.backButton,
        { xtype : 'spacer'},
        {
            ui   :'action',
            text :'Update!',
            handler: function () 
            {
                var thumb = "users/profile.jpg";

                //Uploads the image
                if (MainApp.app.cameraUtil.tookPhoto)
                {
                    var date = new Date();
                    thumb = "users/" + MainApp.app.database.getUserId() + ".jpg";
                    
                    MainApp.app.database.uploadImage(MainApp.app.cameraUtil.photoUrl, 
                                                     thumb);
                }

                MainApp.app.database.updateUserData(
                                    MainApp.app.userInfoForm.screen.getValues(),
                                    thumb);
                
                MainApp.app.userInfoForm.backButton._handler();
            }
        }]
    });
    
    var form = CreateUserProfileForm();
	    
    var screen = Ext.create('Ext.form.Panel',
    {
        title      : 'Edit Profile',
        scrollable : 'vertical',
        cls        : 'blankPage',
        
        layout: 
        {
            type: 'vbox',
            pack: 'center'                        
        },
        
        config:{},
        items : [this.localHeader,form]
	});
    
    this.screen.insert(0, this.localHeader);
    this.screen.insert(1, form);
    
    this.screen.element.on(
    {
        delegate: 'img',
        tap: function (e) 
        {
            //Take a photo
            MainApp.app.cameraUtil.camMenu.show();
        }
    });
}

///////////////////////////////////////////////////////////////////////

function DestroyUserInfoFormScreen()
{  
    var items = this.screen.getItems();
    
    //Iterate and destroy
    items.each(function(item, index, totalItems)
    {
        item.destroy();
    });
}

///////////////////////////////////////////////////////////////////////

function CreateUserProfileForm()
{  
    var form = 
    {
        xtype: 'fieldset',
        title: 'About Me',
        instructions: 'Please enter the information above.',
        defaults: 
        {
            labelWidth: '35%'
        },
        
        items: 
        [{
             xtype:'textfield',
             name: 'username',
             label:'Name',
             autoCapitalize : true,
             required: true,
         },
         {
             xtype:'textareafield',
             name: 'biography',
             label:'Bio',
             placeholder : 'About Me',
             autoCapitalize : true,
             required: true,
         }]
    };
    
    return form;
}

///////////////////////////////////////////////////////////////////////

function PopulateUserForm()
{
    //Get the user data..
    var userData = MainApp.app.database.getUserData();
    if (userData != null)
    {
        this.screen.setValues(
        {
              username  : userData['name'],
              biography : userData['bio']
        });
        
        var defaultUrl = ServerBase + "upload/users/profile.jpg";
        
        MainApp.app.cameraUtil.tookPhoto = (userData['thumb'] != defaultUrl);
        this.updateThumb(userData['thumb']);
    }
}

///////////////////////////////////////////////////////////////////////

function UpdateUserThumb(thumb)
{
    var htmlStr = "<center><img src='" + thumb + "' width='128' height='128' /></center>";
    this.screen.setHtml(htmlStr);
}

///////////////////////////////////////////////////////////////////////

function GoToUserForm(dir, back)
{
    this.create();
    
    if (back) this.back = back;
    this.refresh();

    MainApp.app.cameraUtil.dest = PHOTO_PROFILE;
    MainApp.app.appLayer.currentLayer.animateActiveItem(this.screen, 
                                      {type: 'slide', direction: dir});
}
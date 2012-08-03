

///////////////////////////////////////////////////////////////////////
//                        Login Class
///////////////////////////////////////////////////////////////////////

function LoginScreen()
{
    //Create login screen...
    this.screen  = CreateLoginScreen();
    this.goTo    = GoToLoginScreen;
}

///////////////////////////////////////////////////////////////////////
//                        CREATE GUI SCREENS
///////////////////////////////////////////////////////////////////////

function CreateLoginScreen()
{    
	var newUser = new Ext.Button(
	{   
	    text : 'Create',
		handler: function()
		{
             MainApp.app.database.createNewUser(MainApp.app.loginScreen.screen.getValues());
        }
	}); 
    
    var existingUser = new Ext.Button(
    {   
        text : 'Login',
        handler: function()
        {
            MainApp.app.database.loginUser(MainApp.app.loginScreen.screen.getValues());
        }
    }); 
	
    form = CreateUserForm();
	    
    var screen = Ext.create('Ext.form.Panel',
    {
        title   : 'Login Screen',
        id      : 'loginFormScreen',
        cls     : 'loginpanel',
        
        layout: 
        {
            type: 'vbox',
            pack: 'center'                        
        },
        
        cardAnimation   : 'slide',
        
        config:
        {
        },
        
        items : [form, newUser, existingUser]
	});
    
   return screen;
}

///////////////////////////////////////////////////////////////////////

function CreateUserForm()
{  
    var form = 
    {
        xtype: 'fieldset',
        title: '',
        instructions: '',
        defaults: 
        {
        },
        
        items: 
        [{
             xtype:'emailfield',
             name: 'username',
             label:'Email',
             autoCapitalize : true,
             required: true,
         },
         {
             xtype:'passwordfield',
             name: 'password',
             label:'Password',
             autoCapitalize : true,
             required: true,
         }]
    };
    
    return form;
}

///////////////////////////////////////////////////////////////////////

function GoToLoginScreen()
{
    MainApp.app.loginLayer.layer.setActiveItem(this.screen, {type: 'slide', direction: 'right'});
}
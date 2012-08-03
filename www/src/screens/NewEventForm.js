
var EDITOR_NEW = 0;
var EDITOR_UPDATE = 1;

///////////////////////////////////////////////////////////////////////
//                        New Event Screen Class
///////////////////////////////////////////////////////////////////////

function NewEventForm()
{
    //Create event board...
    this.create        = CreateNewEventFormScreen;
    this.updateThumb   = UpdatePhotoThumb;
    this.reset         = ResetForm;
    this.goTo          = GoToEventForm;
    
    //set your thumbnail.
    this.screen = this.create();
    this.mode   = EDITOR_NEW;
    this.updateThumb("Media/camera.jpg");
}

///////////////////////////////////////////////////////////////////////
//                        CREATE GUI SCREENS
///////////////////////////////////////////////////////////////////////

function CreateNewEventFormScreen()
{
    //Header for board
    this.localHeader  = new Ext.Toolbar(
    {
        title  : 'NEW EVENT',
        docked :'top',
        items  : 
        [
        { xtype:'spacer' },
        {
            text: 'Preview',
            ui: 'action',
            handler: function () 
            {
                //Update your values and make a preview
                if (true) //MainApp.app.cameraUtil.tookPhoto)
                {
                    MainApp.app.newEventEditor.refresh();
                    MainApp.app.newEventEditor.goTo(DIR_FORW, 
                                         MainApp.app.newEventForm);
                }
                else
                {
                    MainApp.app.cameraUtil.camMenu.show();
                }
            }
        }]                               
    });
	
    var form = CreateNewEventForm();
    var screen = Ext.create('Ext.form.Panel',
    {
        title      : 'New Event',
        scrollable : 'vertical',
        cls        : 'createform',
        
        layout: 
        {
            type: 'vbox',
            pack: 'center'                        
        },
        
        config:{},
		
        fullscreen      : true,
        cardAnimation   : 'slide',

        items : [this.localHeader, form]
	});
    
    screen.element.on(
    {
        delegate: 'img',
        tap: function (e) 
        {
            MainApp.app.cameraUtil.camMenu.show();
        }
    });
    
    return screen;
}

///////////////////////////////////////////////////////////////////////

function CreateNewEventForm()
{  
    var form = 
    {
        xtype: 'fieldset',
        title: 'New Event',
        instructions: 'Please enter the information above.',
        defaults: 
        {
            labelWidth: '35%'
        },
        
        items: 
        [{
             xtype:'textfield',
             name: 'location',
             label:'Header',
             autoCapitalize : true,
             placeholder : 'Header',
             required: true,
         },
         {
             xtype:'textareafield',
             name: 'description',
             label:'Description',
             placeholder : 'Description',
             autoCapitalize : true,
             required: true,
         },
         {
             xtype:'textfield',
             name: 'address',
             label:'Address',
             placeholder : 'Current Location',
             required: true,
         },
         {
             xtype : 'datepickerfield',
             label : 'StartDate',
             name  : 'startdate',
             value : new Date()
         }]
    };
    
    return form;
}

///////////////////////////////////////////////////////////////////////

function ResetForm()
{
    this.screen.setValues(
    {
        location    : 'Tap to enter header',
        description : 'Tap to enter description',
        address     : 'Current Location'
    });
    
    MainApp.app.cameraUtil.tookPhoto = false; 
    this.updateThumb("Media/camera.jpg");
}

///////////////////////////////////////////////////////////////////////

function UpdatePhotoThumb(thumb)
{
    var htmlStr = "<center><img src='" + thumb + "' width='128' height='128' /></center>";
    this.screen.setHtml(htmlStr);
}

///////////////////////////////////////////////////////////////////////

function GoToEventForm( dir, back, mode )
{
    if (dir == DIR_FORW)
    {
        this.reset();
    }
    
    MainApp.app.cameraUtil.dest = PHOTO_EVENT;
    MainApp.app.appLayer.currentLayer.animateActiveItem(this.screen, 
                                                        {type: 'slide', direction: dir});   
}
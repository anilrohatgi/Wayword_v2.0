
var PHOTO_EVENT    = 0;
var PHOTO_PROFILE  = 1;

///////////////////////////////////////////////////////////////////////
//                        Camera Util Functions
///////////////////////////////////////////////////////////////////////

function CameraUtils()
{
    this.create      = CreateCamMenu;
    this.takePhoto   = TakePhoto;
    this.success   = onPhotoURISuccess;
    this.failed    = onFail;
    this.tookPhoto = false;
    this.dest      = PHOTO_EVENT;
    this.photoUrl  = "Media/camera.jpg";
    
    this.camMenu   = this.create();
}

///////////////////////////////////////////////////////////////////////

function CreateCamMenu()
{
    var screen = Ext.create('Ext.Panel', 
    {
        width  : 200,
        height : 130,
        padding: 10,
        centered : true,
        modal : true,
        hideOnMaskTap: true,
        zIndex : 999,
        
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
    
        items:[
        {
           iconCls: "photo1",
           text   : 'Camera',
           handler: function()
           {
               //Take a photo
               MainApp.app.cameraUtil.takePhoto(navigator.camera.PictureSourceType.CAMERA,
                                                PHOTO_EVENT);
           }
        },
        {
           iconCls : "photos2",
           text    : 'Library',
           handler: function()
           {
               //Take a photo
               MainApp.app.cameraUtil.takePhoto(navigator.camera.PictureSourceType.SAVEDPHOTOALBUM, PHOTO_EVENT);
               
           }
        }]
    });
        
    return screen;
}

///////////////////////////////////////////////////////////////////////

function TakePhoto(source, dest) 
{
    // Retrieve image file location from specified source
    if (navigator.camera)
    {
        navigator.camera.getPicture(this.success, this.failed, 
                                    { 
                                        quality: 90, 
                                        allowEdit: true,
                                        targetWidth: 256,
                                        targetHeight: 256,
                                        destinationType: destinationType.FILE_URI,
                                        sourceType: source 
                                    });
    }
    else
    {
        this.success("Media/camera.jpg");
    }
}

///////////////////////////////////////////////////////////////////////

function onPhotoURISuccess(imageURI)
{
    MainApp.app.cameraUtil.photoUrl  = imageURI;
    MainApp.app.cameraUtil.tookPhoto = true;
    MainApp.app.cameraUtil.camMenu.hide();
    
    //HACKY, but update the photothumb..
    if (MainApp.app.cameraUtil.dest == PHOTO_EVENT)
    {
        MainApp.app.newEventForm.updateThumb(imageURI);
        MainApp.app.newEventEditor.refresh();
    }
    else
    {
        MainApp.app.userInfoForm.updateThumb(imageURI);
    }
}

///////////////////////////////////////////////////////////////////////

function onFail(message) 
{
    console.log('PHOTO FAILED' + message);
}
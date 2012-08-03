
//Enums
var INSTR_WELCOME = 0;
var INSTR_CREATE  = 1;
var INSTR_CHECKIN = 2;

///////////////////////////////////////////////////////////////////////
//                        New Event Screen Class
///////////////////////////////////////////////////////////////////////

function InstructionPop()
{
    //Create event board...
    this.create       = CreateInstructionPop;
    this.showInstr    = UpdateInstructionData;
    
    this.screen       = this.create();
}

///////////////////////////////////////////////////////////////////////
//                        CREATE GUI SCREENS
///////////////////////////////////////////////////////////////////////

function CreateInstructionPop()
{
    this.button = Ext.create('Ext.Button', 
    { 
        text: 'OK',
        docked: 'bottom'
    });

    var screen  = Ext.Viewport.add(new Ext.Panel(
    {
        id          : 'instrPop',
        layout      : 'card',
        modal       : true,
        hideOnMaskTap: true,
                                
        width  : 300,
        height : 380,
        centered : true,
        zIndex   : 800,
        cls      : 'instrPop',
                                                 
        showAnimation : 
        {
             type:'popIn',
             duration : 250,
             easing: 'ease-out',
        },
                                                 
        hideAnimation : 
        {
            type:'popOut',
            duration : 250,
            easing: 'ease-out',
        },
                                
        hidden : true,
        items : [this.button],

        listeners:
        {
            activate:function()
            {
                this.hide();
            }
        },
    }));

    return screen;
}

///////////////////////////////////////////////////////////////////////

function UpdateInstructionData(screen)
{
    var htmlStr = "<br/><br/>";
    this.screen.show();
    
    switch(screen)
    {
    case INSTR_WELCOME:
        htmlStr += "Welcome to Catalist!";
        
        this.button.setHandler(
        function()
        {
            MainApp.app.instructPop.screen.hide();
        });
        break;
    case INSTR_CHECKIN:
        htmlStr += "Nice, you've joined the party and earned 100 pts!";
        
        this.button.setHandler(
        function()
        {
             MainApp.app.instructPop.screen.hide();
        });
        break;
    case INSTR_CREATE:
        htmlStr += "Sweet, you are becoming a pro! You earned 500 pts for creating an event. Now let's see who shows up.";
        
        this.button.setHandler(
        function ()
        {
            MainApp.app.instructPop.screen.hide();
        });
        break;
    default:
        break;
    }

    //Set it
    this.screen.setHtml(htmlStr);
}
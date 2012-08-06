
///////////////////////////////////////////////////////////////////////

Ext.define('CalEvent',
{
    extend: 'Ext.data.Model',
    config :
    {
        fields: 
        [{
            name: 'header',
            type: 'string'
        }, 
        {
            name: 'desc',
            type: 'string'
        }, 
        {
            name: 'guid',      
            type: 'int'
        },
        {
            name: 'start',
            type: 'date',
            dateFormat: 'c'
        },
        {
            name: 'end',
            type: 'date',
            dateFormat: 'c'
        }]
    }
});

///////////////////////////////////////////////////////////////////////
//                        Calendar Screen
///////////////////////////////////////////////////////////////////////

function Calendar()
{
    //Create event board...
    this.create       = CreateCalendarScreen;
    this.refresh      = PopulateCalendar;
    this.goTo         = GoToEventCalendar;
    this.ready        = false;
    
    this.dateSelect   = new Date();
    
    this.screen       = this.create();
}

///////////////////////////////////////////////////////////////////////
//                        CREATE GUI SCREENS
///////////////////////////////////////////////////////////////////////

function CreateCalendarScreen()
{
    //Button for submission
    this.backButton =  Ext.create('Ext.Button', 
    { 
        text: 'BACK',
        ui  : 'back',
        handler: function()
        {
            if (MainApp.app.calendarScreen.back &&  
                MainApp.app.calendarScreen.calendar._viewMode == 'month')
            {
                MainApp.app.calendarScreen.back.goTo(DIR_BACK);
            }
            else
            {
                MainApp.app.calendarScreen.calendar.setViewMode('month');            
            }
        }
    });
    
    this.localHeader  = new Ext.Toolbar(
    {
        title : 'PICK DATE',
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
                MainApp.app.calendarScreen.ready  =  true;
                if (MainApp.app.calendarScreen.back)
                {
                    MainApp.app.calendarScreen.back.goTo(DIR_BACK);
                }
            }
        }],
    });

    //Create store
    this.events = new Ext.data.Store(
    {
        model: 'CalEvent',
        data: []
    });
    
    this.eventMgr = Ext.create('Ext.ux.TouchCalendarEvents', 
    {
        eventBarTpl: '{header} - {desc}'
    });
    
    this.calendar = Ext.create('Ext.ux.TouchCalendarView', 
    {
        mode        : 'month',
        weekStart   : 0,
        value       : new Date(),
        eventStore  : this.events,

        plugins: [this.eventMgr]
    });
    
    this.calendar.on('selectionchange', function( calendar, newDate, prev, eOpts )
    {
        if (this._viewMode == 'month')
        {
            this.setViewMode('day');
            var one_day= 1000*60*60*24;
        
            //calculate date difference
            var delta = (newDate.getTime()- prev.getTime())/(one_day);
            delta = Math.ceil(delta);
        
            this.refreshDelta(delta);
        }
        
        MainApp.app.calendarScreen.dateSelect = newDate;
    });
    
    var screen = Ext.create('Ext.Panel', 
    {
        title       : 'Calendar',
        fullscreen  : true,
        layout      : 'fit',
        items       : [this.localHeader ,this.calendar]
    });

    return screen;
}

///////////////////////////////////////////////////////////////////////

function PopulateCalendar( store )
{
    this.events.removeAll();
    this.store = store;
    
    store.data.each(function(item, index, totalItems) 
    {
        //add it in.
        var date      =  item.data['start'];
        if (false)//(date)
        {
            var datePiece =  date.split("-");
            
            var start     =  new Date(parseInt(datePiece[0]),
                                      parseInt(datePiece[1]-1),
                                      parseInt(datePiece[2]));
                        
            var event = 
            {
                header  : item.data['place'],
                desc    : item.data['desc'],
                guid    : item.data['guid'],
                start   : start,
                end     : start
            }
                  
            MainApp.app.calendarScreen.events.add(event);
        }
    });
    
    this.eventMgr.refreshEvents();
}

///////////////////////////////////////////////////////////////////////

function GoToEventCalendar(dir, back, guid)
{
    this.guid = guid;
    
    this.calendar.setViewMode('month');
    
    if (back) this.back = back;
    MainApp.app.appLayer.currentLayer.animateActiveItem(this.screen,
                                   {type: 'flip', direction: dir});
}
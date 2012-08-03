
///////////////////////////////////////////////////////////////////////
//                       PAGE TURN
///////////////////////////////////////////////////////////////////////

$(window).ready(function() 
{
    $('#magazine').turn(
    {
        display: 'single',
        acceleration: true,
        gradients: !$.isTouch,
        elevation:50,
        when: 
        {
            turned: function(e, page) 
            {
                /*console.log('Current view: ', $(this).turn('view'));*/
            }
        }
    });
});

///////////////////////////////////////////////////////////////////////

$(window).bind('keydown', function(e)
{
    
    if (e.keyCode==37)
    $('#magazine').turn('previous');
    else if (e.keyCode==39)
    $('#magazine').turn('next');
    
});

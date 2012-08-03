
/**
 * This example allows you to debug the watchPosition
 * system. We've been using this to test the GPS accuracy
 * of a number of systems
 *
 * @param  
 * @return void
 * @author Joel Nation
 **/
demos.Leaflet.debug = new Ext.Panel({
    layout: 'fit',
    items   : [
        new Ext.ux.Leaflet({
            mapOptions  : {
                follow      : true,
                log         : function (type, msg) {
                    var loggerEl = Ext.get('logger');
                    
                    if (!this.started) {
                        loggerEl.select('span').remove();
                        this.started = true;
                    }

                    switch (type) {
                        default:
                            loggerEl.last().first().insertFirst({
                                tag: 'p',
                                html: msg.message,
                                style: 'margin: 0'
                            });
                            loggerEl.select('p:nth-child(50)').remove();
                        break;
                    }
                }
            }
        }),
    {
        id              : 'logger',
        scroll          : 'vertical',
        styleHtmlContent: true,
        html            : '<span>Log messages will appear here</span>'
    }]
})
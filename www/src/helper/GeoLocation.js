
///////////////////////////////////////////////////////////////////////
//                        Camera Util Functions
///////////////////////////////////////////////////////////////////////

function GeoLocation()
{
    this.curlat = 28.765079;
    this.curlon = -81.342491;
    this.calcDist   = GetDistFromPoint;    
}

///////////////////////////////////////////////////////////////////////

function StartLocationTracker()
{
    //Start up the watch...
    this.watchid = navigator.geolocation.watchPosition(success, error);
}

///////////////////////////////////////////////////////////////////////

function success(position) 
{
    MainApp.app.locationUtil.curlat = position.coords.latitude;
    MainApp.app.locationUtil.curlon = position.coords.longitude;
}

///////////////////////////////////////////////////////////////////////

function error()
{
}

///////////////////////////////////////////////////////////////////////

function toRad(Value) 
{
    /** Converts numeric degrees to radians */
    return Value * Math.PI / 180;
}

///////////////////////////////////////////////////////////////////////

function GetDistFromPoint( lat, lon)
{
    //return the distance from a given point.
    var R = 6371; // Radius of the earth in km
    
    var dLat = toRad(lat-this.curlat);  // Javascript functions in radians
    var dLon = toRad(lon-this.curlon); 
    
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(this.curlat)) * Math.cos(toRad(lat)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
    
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km

    var mi = d * 0.621371192; 
    
    return mi.toFixed(3);
}


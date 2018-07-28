// 式は次を参考にした
// 天体の位置計算 増補版 (長沢 工) 地人書館

const secondPerDay = 86400;

// time is UTC
function MeanSiderealTime(year, month, date){ // 1900/3/31~2100/2/28 UTC
    if(month < 3){ // 1(Jan) or 2(Feb)
    	var Y = year - 1901;
	    var M = month + 12;
    }else{
	    var Y = year - 1900;
	    var M = month;
    }
    
    var D = date;
    var K = 365*Y + 30*M + D - 33.5 + Math.floor(3*(M+1)/5) + Math.floor(Y/4);

    var tu = K / 36525; // OK

    let stSecond = (8640184.542 + 0.0929*tu)*tu + 23925.836;
    stSecond = (stSecond % 86400);
    //console.log(stOffsetSecond / 86400 * 360);

    let retDeg = stSecond / 86400 * 360;
    retDeg = retDeg % 360;
    // alert(retDeg);
    return retDeg;
}

// time is UTC
function localSiderealTime(year, month, date, hours, minutes, longtitude){ // date, 経度(-180(W) ~ +180(E))
    let meanSiderealTime = MeanSiderealTime(year,month,date);
    let addSecond = hours*3600 + minutes*60;
    let hoseiDeg = 0.00273791 * addSecond / secondPerDay * 360; // 0.00273791/secondPerDay*360 を数値ベタ書きにしておけばいい。
    let addSecondDeg = addSecond / secondPerDay * 360;

    let theta = (meanSiderealTime + addSecondDeg + longtitude + hoseiDeg) % 360;
    if(theta < 0){
      theta = theta + 360;
    }
    return theta; // deg
}

// time is UTC
function horizonCoord(ra, dec, lat, lng, year, month, date, hours, minutes){ // lat=緯度, lng=経度
    var stDeg = localSiderealTime(year, month, date, hours, minutes, lng);
    
    var raRad = ra / 360 * (2*Math.PI);
    var decRad = dec / 360 * (2*Math.PI);
    var latRad = lat / 360 * (2*Math.PI);
    var stRad = stDeg / 360 * (2*Math.PI);

    var L = Math.cos(decRad) * Math.cos(raRad); // Math.sin(rad)
    var M = Math.cos(decRad) * Math.sin(raRad);
    var N = Math.sin(decRad);

    var l = Math.sin(latRad) * Math.cos(stRad) * L
	+ Math.sin(latRad) * Math.sin(stRad) * M
	- Math.cos(latRad) * N;

    var m = - Math.sin(stRad) * L
	+ Math.cos(stRad) * M;

    var n = Math.cos(latRad) * Math.cos(stRad) * L
	+ Math.cos(latRad) * Math.sin(stRad) * M
    + Math.sin(latRad) * N;
    
    console.log([l,m,n]);

    var A = Math.atan2(-m,l); // 方位角 azimuth radian
    var h = Math.asin(n); // 高度 h radian

    A = A / Math.PI * 180;
    if( A < 0 ){
        A = A + 360;
    }

    h = h / Math.PI * 180;
    if( h < 0 ){
        h = h + 360;
    }

    return {'h':h, 'A':A};
}


// var d = new Date(1978,5,10,21,20);
// var x = horizonCoord(316.16639, 38.49975,35.78888888,139.5, 1978, 6, 10, 12, 20);//UTC
// console.log(x);
// console.log(MeanSiderealTime(1978, 6, 10, 21, 20));
// 28649.5
// console.log(localSiderealTime(1978, 6, 10, 12, 20,139.53));

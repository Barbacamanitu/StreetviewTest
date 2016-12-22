var panorama;
var overlay;
var myHouse = {lat: 34.813818, lng:-87.672830};
var thePos = {lat: 34.803520, lng:-87.674789};
var myLight = thePos;
var pts = [{lat: 34.813880, lng: -87.672755 },
                {lat: 34.813951, lng: -87.672915 },
                {lat: 34.813863, lng: -87.672991 },
                {lat: 34.813766, lng: -87.672849 }];
function initialize() 
{
  var mapDiv = document.getElementById('map');
  panorama = new google.maps.StreetViewPanorama(
      mapDiv,
      {
        clickToGo: true,
        linksControl: true,
        addressControl: false,
        addressControlOptions: {
          position: google.maps.ControlPosition.LEFT_BOTTOM
        },
        imageDateControl: true,
        //position: {lat:34.81381594348493, lng: -87.67265878988076},
        //position: {lat: 34.803524,lng: -87.674785},
        position:  myHouse,
        pov: {heading: -157, pitch: 0},
        zoom: 0,
      });
    
    initOverlay();
    overlay = new MyOverlay(panorama,mapDiv);
    panorama.addListener('position_changed',function(){
      if (overlay.mesh)
      {
             overlay.mesh.updatePosition();
             overlay.cylinder.updatePosition();
              overlay.temp.updatePosition();
      }

            });

            $("#house").click(function(){
  panorama.setPosition(myHouse);
});

$("#light").click(function(){
  panorama.setPosition(myLight);
});


}


var panorama;
var overlay;
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
        position: {lat: 34.803524,lng: -87.674785},
        pov: {heading: 0, pitch: 0},
        zoom: 0,
      });
    initOverlay();
    overlay = new MyOverlay(panorama,mapDiv);
}



var x = 0; y = 100;
var speed = 1;



function update()
{
  setTimeout(update,1);
  if (x >= 1000)
  {
    speed *= -1;
  }
  x+= speed;

  overlay.clear();
  overlay.drawCircle(x,y);
}

function pointToHouse()
{
  var myPos = panorama.getPosition();
  var house = new google.maps.LatLng({lat: 34.813872, lng: -87.672839});
  var head = google.maps.geometry.spherical.computeHeading(myPos,house);
  panorama.setPov({heading: head,pitch: 0, zoom:0});
  return head;
}
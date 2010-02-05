/**
 * visualización del catastro español sobre los mapas de google maps
 * basado en el ejemplo de overlays del api de google maps
 */

function CatastroOverlay() {
}

CatastroOverlay.prototype = new GOverlay();

CatastroOverlay.prototype.update = function() {
  // get bounds and prepare request to catastro WS
  this.bounds_ = this.map_.getBounds();
  var southWest = this.bounds_.getSouthWest();
  var northEast = this.bounds_.getNorthEast();
  var pos = southWest.lng().toString() + "," + southWest.lat().toString() + "," + northEast.lng().toString() + "," + northEast.lat().toString() 

  s = this.map_.getSize()

  var image_url = "http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?REQUEST=GetMap&SERVICE=WMS&SRS=EPSG:4326&WIDTH=" + s.width + "&HEIGHT=" + s.height + "&TRANSPARENT=Y&BBOX=" + pos
  this.div_.style.backgroundImage =  "url("+image_url+")";


  var c1 = this.map_.fromLatLngToDivPixel(this.bounds_.getSouthWest());
  var c2 = this.map_.fromLatLngToDivPixel(this.bounds_.getNorthEast());

  // Now position our DIV based on the DIV coordinates of our bounds

  this.div_.style.width = Math.abs(c2.x - c1.x) + "px";
  this.div_.style.height = Math.abs(c2.y - c1.y) + "px";
  this.div_.style.left = Math.min(c2.x, c1.x) + "px";
  this.div_.style.top = Math.min(c2.y, c1.y)  + "px";

  this.lastPixelPosition = c1;

}

CatastroOverlay.prototype.initialize = function(map) {

  var div = document.createElement("div");
  div.style.position = "absolute";
  this.map_ = map;
  this.div_ = div;
  this.lastPixelPosition = this.map_.fromLatLngToDivPixel(this.map_.getBounds().getSouthWest());
  this.update();
  map.getPane(G_MAP_MAP_PANE).appendChild(div);

}

CatastroOverlay.prototype.remove = function() {
  this.div_.parentNode.removeChild(this.div_);
}

CatastroOverlay.prototype.copy = function() {
  return new CatastroOverlay();
                      
}

CatastroOverlay.prototype.redraw = function(force) {
  var s = this.map_.getSize()
  var c1 = this.map_.fromLatLngToDivPixel(this.map_.getBounds().getSouthWest());
  if (force ||
      Math.abs(c1.x - this.lastPixelPosition.x) > s.width*0.25 ||
      Math.abs(c1.y - this.lastPixelPosition.y) > s.height*0.25)
  {
    this.update();
  }

}

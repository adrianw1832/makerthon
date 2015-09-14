$(document).ready(function() {
  var canvas = $(".canvas")[0];
  var ctx = canvas.getContext("2d");

  //it seems that canvas has to be a square
  var H = 1000;
  var W = 1000;

  var x = 45;
  var y = 200;
  var dx = 5;
  var dy = 5;
  var radius = 15;
  var circle = new Circle(x, y, radius);

  canvas.height = H;
  canvas.width = W;

  function move() {
    ctx.clearRect(0, 0, H, W);
    circle.draw(ctx);
    if(circle.x > W - circle.radius || circle.x < circle.radius) { dx = -dx; }
    if(circle.y > H - circle.radius || circle.y < circle.radius) { dy = -dy; }
    circle.x += dx;
    circle.y += dy;
  }

  function onMouseMove(e) {
    var element = canvas;
    var offsetX = 0, offsetY = 0;

    if (element.offsetParent) {
      do {
        offsetX += element.offsetLeft;
        offsetY += element.offsetTop;
      } while ((element = element.offsetParent));
    }

    mouseX = e.pageX - offsetX;
    mouseY = e.pageY - offsetY;
    determineNewDirection(mouseX, mouseY);
  }

  function determineNewDirection(mouseX, mouseY) {
    var xdif = circle.x - mouseX;
    var ydif = circle.y - mouseY;
    var distance = Math.sqrt(xdif*xdif + ydif*ydif);
    var moves = distance/5;
    var xunits = (circle.x - mouseX)/moves;
    var yunits = (circle.y - mouseY)/moves;
    dx = -xunits;
    dy = -yunits;
  }

  function init(){
    setInterval(move, 30);
    canvas.addEventListener("mousemove", onMouseMove, false);
  }

  init();
});

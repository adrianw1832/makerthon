$(document).ready(function() {
  var canvas = $(".canvas")[0];
  var ctx = canvas.getContext("2d");

  //it seems that canvas has to be a square
  var H = 1000;
  var W = 1000;
  var speed = 5;
  var x = 500;
  var y = 500;
  var horizontalSpeed = 0;
  var verticalSpeed = 0;
  var radius = 15;
  var circle = new Circle(x, y, radius);

  canvas.height = H;
  canvas.width = W;

  function move() {
    ctx.clearRect(0, 0, H, W);
    circle.draw(ctx);
    if(circle.x > W - circle.radius || circle.x < circle.radius) { horizontalSpeed = -horizontalSpeed; }
    if(circle.y > H - circle.radius || circle.y < circle.radius) { verticalSpeed = -verticalSpeed; }
    circle.x += horizontalSpeed;
    circle.y += verticalSpeed;
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
    var xdif = mouseX - circle.x;
    var ydif = mouseY - circle.y;
    var distance = Math.sqrt(xdif*xdif + ydif*ydif);
    var moves = distance/speed;
    var xunits = (xdif)/moves;
    var yunits = (ydif)/moves;
    horizontalSpeed = xunits;
    verticalSpeed = yunits;
  }

  function init(){
    setInterval(move, 30);
    canvas.addEventListener("mousemove", onMouseMove, false);
  }

  init();
});

$(document).ready(function(){
  var canvas = $(".canvas")[0];
  var ctx = canvas.getContext("2d");

  var H = 1000;
  var W = 1618;

  var x = 45;
  var y = 200;
  var dx = 5;
  var dy = 5;

  canvas.height = H;
  canvas.width = W;

  function draw() {
    var radius = 15;
    ctx.clearRect(0, 0, H, W);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
    if(x > 485 || x < 15) { dx = -dx; }
    if(y > 485 || y < 15) { dy = -dy; }
    x += dx;
    y += dy;
  }

  function onClick(e) {
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
    if (x > mouseX) dx = -dx;
    if (y > mouseX) dy = -dy;
  };

  function init(){
    setInterval(draw, 30);
    canvas.addEventListener("click", onClick, false);
  }

  init();
});

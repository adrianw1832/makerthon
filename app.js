var canvas = document.getElementsByClassName("canvas")[0];
var ctx = canvas.getContext("2d");

var H = 500;
var W = 500;

var x = 45;
var y = 200;
var dx = 1;
var dy = 1;

canvas.height = H;
canvas.width = W;

function draw() {
  ctx.clearRect(0, 0, H, W);
  ctx.beginPath();
  ctx.arc(x, y, 15, 0, Math.PI*2, true);
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
}

function init(){
  setInterval(draw, 30);
  canvas.addEventListener("click", onClick, false);
}

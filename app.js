var canvas = document.getElementsByClassName("canvas")[0];
var ctx = canvas.getContext("2d");

var H = 500;
var W = 500;

var x = 45;
var y = 200;
var dx = 5;
var dy = 5;

canvas.height = H;
canvas.width = W;

function draw() {
  ctx.clearRect(0, 0, H, W);
  ctx.beginPath();
  ctx.arc(x, y, 15, 0, Math.PI*2, true);
  ctx.closePath();
  ctx.fill();
  if(x > 485 || x < 15) { dx = -dx} ;
  if(y > 485 || y < 15) { dy = -dy };
  x += dx;
  y += dy;
}

function init(){
  setInterval(draw, 30);
}

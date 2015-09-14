$(document).ready(function(){
  var canvas = $(".canvas")[0]
  var ctx = canvas.getContext("2d");

  //it seems that canvas has to be a square
  var H = 1000;
  var W = 1000;

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
    if(x > W - radius || x < radius) { dx = -dx} ;
    if(y > H - radius || y < radius) { dy = -dy };
    x += dx;
    y += dy;
  }

  function init(){
    setInterval(draw, 30);
  }

  init();
})
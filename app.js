$(document).ready(function() {
  var canvas1 = $(".canvas1")[0];
  var canvas2 = $(".canvas2")[0];
  var ctx1 = canvas1.getContext("2d");
  var ctx2 = canvas2.getContext("2d");

  //it seems that canvas has to be a square
  var H = 1000;
  var W = 1000;

  var x = 500;
  var y = 500;
  var dx = 5;
  var dy = 5;
  var radius = 15;
  var circle = new Circle(x, y, radius);
  var food = new Food();

  canvas1.height = H;
  canvas1.width = W;
  canvas2.height = H;
  canvas2.width = W;

  function move() {
    ctx1.clearRect(0, 0, H, W);
    circle.draw(ctx1);
    if (circle.x > W - circle.radius || circle.x < circle.radius) {
      dx = -dx;
    }
    if (circle.y > H - circle.radius || circle.y < circle.radius) {
      dy = -dy;
    }
    circle.x += dx;
    circle.y += dy;
    hasCollided();
  }

  function onMouseMove(e) {
    var element = canvas1;
    var offsetX = 0,
      offsetY = 0;

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
    var distance = Math.sqrt(xdif * xdif + ydif * ydif);
    var moves = distance / 5;
    var xunits = (circle.x - mouseX) / moves;
    var yunits = (circle.y - mouseY) / moves;
    dx = -xunits;
    dy = -yunits;
  }

  function hasCollided() {
    circlePositions = [circle.x, circle.y];
    for (var i = 0; i < food.foodPositions.length; i++) {
      var xdif = circle.x - food.foodPositions[i][0];
      var ydif = circle.y - food.foodPositions[i][1];
      var distance = Math.sqrt(xdif * xdif + ydif * ydif);
      if(distance < circle.radius + 5){
        return food.foodPositions[i];
      }
    }
  }

  function init() {
    setInterval(move, 30);
    food.fillFood(ctx2);
    canvas1.addEventListener("mousemove", onMouseMove, false);
  }

  init();
});

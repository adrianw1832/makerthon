$(document).ready(function() {
  var canvas1 = $(".canvas1")[0];
  var canvas2 = $(".canvas2")[0];
  var ctx1 = canvas1.getContext("2d");
  var ctx2 = canvas2.getContext("2d");

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
  var food = new Food();
  var collisionPosition;

  canvas1.height = H;
  canvas1.width = W;
  canvas2.height = H;
  canvas2.width = W;

  function move() {
    ctx1.clearRect(0, 0, H, W);
    circle.draw(ctx1);
    if(circle.x > W - circle.radius || circle.x < circle.radius) { horizontalSpeed = -horizontalSpeed; }
    if(circle.y > H - circle.radius || circle.y < circle.radius) { verticalSpeed = -verticalSpeed; }
    circle.x += horizontalSpeed;
    circle.y += verticalSpeed;
    eatFood();
  }

  function onMouseMove(e) {
    var element = canvas1;
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

  function hasCollided() {
    circlePositions = [circle.x, circle.y];
    for (var i = 0; i < food.foodPositions.length; i++) {
      var xdif = circle.x - food.foodPositions[i][0];
      var ydif = circle.y - food.foodPositions[i][1];
      var distance = Math.sqrt(xdif * xdif + ydif * ydif);
      if(distance < circle.radius + 5){
        collisionPosition = food.foodPositions[i];
        return true;
      }
    }
    return false;
  }

  function eatFood() {
    if (hasCollided()) {
      var index = food.foodPositions.indexOf(collisionPosition);
      food.foodPositions.splice(index, 1);
      ctx2.clearRect(collisionPosition[0] - 5, collisionPosition[1] - 5, radius * 2, radius * 2);
      getsBigger(5);
    }
  }

  function getsBigger(eatenCircleRadius) {
    var originalCircle = Math.PI * circle.radius * circle.radius;
    var eatenCircle = Math.PI * eatenCircleRadius * eatenCircleRadius;
    var newRadius = Math.sqrt((originalCircle + eatenCircle) / Math.PI);
    console.log(newRadius)
    circle.radius = newRadius
  };

  function init() {
    setInterval(move, 30);
    food.fillFood(ctx2);
    canvas1.addEventListener("mousemove", onMouseMove, false);
  }

  init();
});

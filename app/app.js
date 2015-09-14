$(document).ready(function() {
  var ballCanvas = $(".ballCanvas")[0];
  var foodCanvas = $(".foodCanvas")[0];
  var gridCanvas = $(".gridCanvas")[0];
  var ballContext = ballCanvas.getContext("2d");
  var foodContext = foodCanvas.getContext("2d");
  var gridContext = gridCanvas.getContext("2d");

  //it seems that canvas has to be a square
  var defaultHeight = 1000;
  var defaultWidth = 1000;
  var ballSpeed = 5;
  var xCoord = 500;
  var yCoord = 500;
  var xVelocity = 0;
  var yVelocity = 0;
  var radius = 15;
  var circle = new Circle(xCoord, yCoord, radius);
  var food = new Food();
  var colour = food.getRandomColour();
  var collisionPosition;

  ballCanvas.height = defaultHeight;
  ballCanvas.width = defaultWidth;
  foodCanvas.height = defaultHeight;
  foodCanvas.width = defaultWidth;
  gridCanvas.height = defaultHeight;
  gridCanvas.width = defaultWidth;

  function backgroundGrid() {
    var opts = {
      distance: 50,
      lineWidth: 0.7,
      gridColor: "#E7E6E8",
      caption: false,
      horizontalLines: true,
      verticalLines: true
    };
    new Grid(opts).draw(gridContext);
  }

  function move() {
    ballContext.clearRect(0, 0, defaultHeight, defaultWidth);
    circle.draw(ballContext, colour);
    if (circle.x > defaultWidth - circle.radius || circle.x < circle.radius) xVelocity = -xVelocity;
    if (circle.y > defaultHeight - circle.radius || circle.y < circle.radius) yVelocity = -yVelocity;
    circle.x += xVelocity;
    circle.y += yVelocity;
    eatFood();
  }

  function onMouseMove(e) {
    var element = ballCanvas;
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
    var xdif = mouseX - circle.x;
    var ydif = mouseY - circle.y;
    var distance = Math.sqrt(xdif * xdif + ydif * ydif);
    var moves = distance / ballSpeed;
    var xunits = (xdif) / moves;
    var yunits = (ydif) / moves;
    xVelocity = xunits;
    yVelocity = yunits;
  }

  function hasCollided() {
    circlePositions = [circle.x, circle.y];
    for (var i = 0; i < food.foodPositions.length; i++) {
      var xdif = circle.x - food.foodPositions[i][0];
      var ydif = circle.y - food.foodPositions[i][1];
      var distance = Math.sqrt(xdif * xdif + ydif * ydif);
      if (distance < circle.radius + 5) {
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
      foodContext.clearRect(collisionPosition[0] - 5, collisionPosition[1] - 5, radius * 2, radius * 2);
      getsBigger(5);
    }
  }

  function getsBigger(eatenCircleRadius) {
    var originalCircle = Math.PI * circle.radius * circle.radius;
    var eatenCircle = Math.PI * eatenCircleRadius * eatenCircleRadius;
    var newRadius = Math.sqrt((originalCircle + eatenCircle) / Math.PI);
    circle.radius = newRadius;
  }

  function init() {
    backgroundGrid();
    setInterval(move, 30);
    setInterval(food.fillFood(foodContext), 6000);
    ballCanvas.addEventListener("mousemove", onMouseMove, false);
  }

  init();
});

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
    var parameters = {
      distance: 50,
      lineWidth: 0.7,
      gridColor: "#E7E6E8",
      caption: false,
      horizontalLines: true,
      verticalLines: true
    };
    new Grid(parameters).draw(gridContext);
  }

  function move() {
    ballContext.clearRect(0, 0, defaultHeight, defaultWidth);
    circle.draw(ballContext, colour);
    if (circle.xCoord > defaultWidth - circle.radius || circle.xCoord < circle.radius) xVelocity = -xVelocity;
    if (circle.yCoord > defaultHeight - circle.radius || circle.yCoord < circle.radius) yVelocity = -yVelocity;
    circle.xCoord += xVelocity;
    circle.yCoord += yVelocity;
    eatFood();
  }

  function onMouseMove(page) {
    var mouseX = page.pageX;
    var mouseY = page.pageY;
    calculateBallVelocity(mouseX, mouseY);
  }

  function calculateBallVelocity(mouseX, mouseY) {
    var xdiff = mouseX - circle.xCoord;
    var ydiff = mouseY - circle.yCoord;
    var mouseToBallDistance = Math.sqrt(xdiff * xdiff + ydiff * ydiff);
    var time = mouseToBallDistance / ballSpeed;
    xVelocity = xdiff / time;
    yVelocity = ydiff / time;
  }

  function hasCollided() {
    for (var i = 0; i < food.foodPositions.length; i++) {
      var xdiff = circle.xCoord - food.foodPositions[i][0];
      var ydiff = circle.yCoord - food.foodPositions[i][1];
      var foodToBallDistance = Math.sqrt(xdiff * xdiff + ydiff * ydiff);
      if (foodToBallDistance < circle.radius + food.radius) {
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

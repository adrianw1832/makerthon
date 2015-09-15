$(document).ready(function() {
  var ballCanvas = $(".ballCanvas")[0];
  var foodCanvas = $(".foodCanvas")[0];
  var gridCanvas = $(".gridCanvas")[0];
  var ballContext = ballCanvas.getContext("2d");
  var foodContext = foodCanvas.getContext("2d");
  var gridContext = gridCanvas.getContext("2d");

  //it seems that canvas has to be a square
  var defaultHeight = 2000; var defaultWidth = 2000;
  var xCoord = 500; var yCoord = 500;
  var xVelocity = 0; var yVelocity = 0;
  var defaultBallSpeed = 5;
  var slowDownFactor = 0.25;
  var defaultRadius = 15;
  var circle = new Circle(xCoord, yCoord, defaultRadius);
  var food = new Food();
  var collisionPosition;
  var mouseX;
  var mouseY;
  var scrollSensitivity = 0.5;

  ballCanvas.height = defaultHeight; ballCanvas.width = defaultWidth;
  foodCanvas.height = defaultHeight; foodCanvas.width = defaultWidth;
  gridCanvas.height = defaultHeight; gridCanvas.width = defaultWidth;

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
    circle.draw(ballContext);
    if (hitsRightBoundary() || hitsLeftBoundary()) {
      xVelocity = 0;
    }
    if (hitsBottomBoundary() || hitsTopBoundary()) {
      yVelocity = 0;
    }
    if(mouseX) { calculateBallVelocity(mouseX, mouseY); }
    circle.xCoord += xVelocity;
    circle.yCoord += yVelocity;
    eatFood();
  }

  function hitsRightBoundary() {
    return ((circle.xCoord > defaultWidth - circle.radius) && mouseX >= circle.xCoord)
  }

  function hitsLeftBoundary() {
    return (circle.xCoord < circle.radius && mouseX <= circle.xCoord)
  }

  function hitsTopBoundary() {
    return (circle.yCoord < circle.radius && mouseY <= circle.yCoord)
  }

  function hitsBottomBoundary() {
    return ((circle.yCoord > defaultWidth - circle.radius) && mouseY >= circle.yCoord)
  }

  function onMouseMove(page) {
    mouseX = page.pageX;
    mouseY = page.pageY;
    scollPage(mouseX, mouseY);
    calculateBallVelocity(mouseX, mouseY);
  }

  function calculateBallVelocity(mouseX, mouseY) {
    var xdiff = mouseX - circle.xCoord;
    var ydiff = mouseY - circle.yCoord;
    var mouseToBallDistance = Math.sqrt(xdiff * xdiff + ydiff * ydiff);
    var time = mouseToBallDistance / (defaultBallSpeed * sizeFactor());
    xVelocity = xdiff / time;
    yVelocity = ydiff / time;
  }

  var previousXCoord, previousYcoord;

  function scollPage(mouseX, mouseY) {
    if (previousXCoord && previousYcoord) window.scrollBy((mouseX - previousXCoord) * scrollSensitivity, (mouseY - previousYcoord) * scrollSensitivity);
    previousXCoord = mouseX;
    previousYcoord = mouseY;
  }

  function sizeFactor() {
    return 1 - (circle.radius / defaultRadius - 1) * slowDownFactor;
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
      foodContext.clearRect(collisionPosition[0] - food.radius - 1.1, collisionPosition[1] - food.radius - 1.1, food.radius * 2.45, food.radius * 2.45);
      food.foodCount--;
      getsBigger(food.radius);
    }
  }

  function getsBigger(eatenCircleRadius) {
    var originalCircle = Math.PI * circle.radius * circle.radius;
    var eatenCircle = Math.PI * eatenCircleRadius * eatenCircleRadius;
    var newRadius = Math.sqrt((originalCircle + eatenCircle) / Math.PI);
    circle.radius = newRadius;
  }

  function refillFood() {
    food.fillFood(foodContext);
  }

  function init() {
    backgroundGrid();
    food.fillFood(foodContext);
    setInterval(move, 30);
    setInterval(refillFood, 30000);
    ballCanvas.addEventListener("mousemove", onMouseMove);
  }

  init();
});

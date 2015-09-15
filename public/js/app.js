$(document).ready(function() {
  var ballCanvas = $(".ballCanvas")[0];
  var foodCanvas = $(".foodCanvas")[0];
  var gridCanvas = $(".gridCanvas")[0];
  var ballContext = ballCanvas.getContext("2d");
  var foodContext = foodCanvas.getContext("2d");
  var gridContext = gridCanvas.getContext("2d");

  //it seems that canvas has to be a square
  var gameBoundary = 2000;
  var xCoord = 750; var yCoord = 750;
  var xVelocity = 0; var yVelocity = 0;
  var defaultBallSpeed = 5;
  var slowDownFactor = 0.25;
  var defaultRadius = 15;
  var circle = new Circle(xCoord, yCoord, defaultRadius);
  var food = new Food();

  var mouseX;
  var mouseY;
  var scrollSensitivity = 0.6;

  ballCanvas.height = gameBoundary; ballCanvas.width = gameBoundary;
  foodCanvas.height = gameBoundary; foodCanvas.width = gameBoundary;
  gridCanvas.height = gameBoundary * 1.25; gridCanvas.width = gameBoundary * 1.25;

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
    ballContext.clearRect(0, 0, gameBoundary, gameBoundary);
    circle.draw(ballContext);
    if (hitsRightBoundary() || hitsLeftBoundary()) xVelocity = 0;
    if (hitsBottomBoundary() || hitsTopBoundary()) yVelocity = 0;
    if (mouseX) calculateBallVelocity(mouseX, mouseY);
    circle.xCoord += xVelocity;
    circle.yCoord += yVelocity;
    circle.eatFood(foodContext, food);
  }

  function hitsRightBoundary() {
    return ((circle.xCoord > gameBoundary - circle.radius) && mouseX >= circle.xCoord);
  }

  function hitsLeftBoundary() {
    return (circle.xCoord < circle.radius && mouseX <= circle.xCoord);
  }

  function hitsTopBoundary() {
    return (circle.yCoord < circle.radius && mouseY <= circle.yCoord);
  }

  function hitsBottomBoundary() {
    return ((circle.yCoord > gameBoundary - circle.radius) && mouseY >= circle.yCoord);
  }

  function onMouseMove(page) {
    mouseX = page.pageX;
    mouseY = page.pageY;
    scrollPage(mouseX, mouseY);
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

  function scrollPage(mouseX, mouseY) {
    if (previousXCoord && previousYcoord) window.scrollBy((mouseX - previousXCoord) * scrollSensitivity, (mouseY - previousYcoord) * scrollSensitivity);
    previousXCoord = mouseX;
    previousYcoord = mouseY;
  }

  function sizeFactor() {
    return 1 - (circle.radius / defaultRadius - 1) * slowDownFactor;
  }

  function refillFood() {
    food.fillFood(foodContext, gameBoundary);
  }

  function init() {
    backgroundGrid();
    food.fillFood(foodContext, gameBoundary);
    setInterval(move, 30);
    setInterval(refillFood, 30000);
    ballCanvas.addEventListener("mousemove", onMouseMove);
  }

  $(function() {
    var leaderBoard = $('.leaderBoard').offset().top;

    $(window).scroll(function() {
      if ( $(window).scrollTop() > leaderBoard ) {
        $('.leaderBoard').css({ position: 'fixed', top: '0px' })
      } else {
        $('.leaderBoard').css({ position: 'static', top: '0px' })
      }
    });
  });


  init();
});

$(document).ready(function() {
  var ballCanvas = $(".ballCanvas")[0];
  var foodCanvas = $(".foodCanvas")[0];
  var gridCanvas = $(".gridCanvas")[0];
  var ballContext = ballCanvas.getContext("2d");
  var foodContext = foodCanvas.getContext("2d");
  var gridContext = gridCanvas.getContext("2d");

  //it seems that canvas has to be a square
  var gameBoundary = 2500;
  var gamePadding = 250;
  var xCoord = gameBoundary/2;
  var yCoord = gameBoundary/2;
  var xVelocity = 0;
  var yVelocity = 0;
  var defaultBallSpeed = 10;
  var slowDownFactor = 0.05;
  var defaultRadius = 15;
  var circle = new Circle(xCoord, yCoord, defaultRadius);
  var food = new Food(gameBoundary);

  var mouseX, mouseY;

  ballCanvas.height = gameBoundary;
  ballCanvas.width = gameBoundary;
  foodCanvas.height = gameBoundary;
  foodCanvas.width = gameBoundary;
  gridCanvas.height = gameBoundary + gamePadding * 2;
  gridCanvas.width = gameBoundary + gamePadding * 2;

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
    if (mouseX) calculateBallVelocity();
    circle.xCoord += xVelocity;
    circle.yCoord += yVelocity;
    circle.eatFood(foodContext, food);
  }

  function hitsRightBoundary() {
    return ((circle.xCoord > gameBoundary - circle.radius*1.5) && mouseX >= circle.xCoord);
  }

  function hitsLeftBoundary() {
    return (circle.xCoord < circle.radius *1.5 && mouseX <= circle.xCoord);
  }

  function hitsTopBoundary() {
    return (circle.yCoord < circle.radius *1.5 && mouseY <= circle.yCoord);
  }

  function hitsBottomBoundary() {
    return ((circle.yCoord > gameBoundary - circle.radius *1.5) && mouseY >= circle.yCoord);
  }

  function onMouseMove(page) {
    mouseX = page.pageX - gamePadding;
    mouseY = page.pageY - gamePadding;
    scrollPage();
    calculateBallVelocity();
  }

  function calculateBallVelocity() {
    var xdiff = mouseX - circle.xCoord;
    var ydiff = mouseY - circle.yCoord;
    var mouseToBallDistance = Math.sqrt(xdiff * xdiff + ydiff * ydiff);
    var time = mouseToBallDistance / (defaultBallSpeed * sizeFactor());
    if (mouseToBallDistance < circle.radius) {
      xVelocity = 0;
      yVelocity = 0;
    } else {
      xVelocity = xdiff / time;
      yVelocity = ydiff / time;
    }
  }

  function sizeFactor() {
    return 1 - (circle.radius / defaultRadius - 1) * slowDownFactor;
  }

  function refillFood() {
    food.fillFood(foodContext, gameBoundary);
  }

  function setStartLocation() {
    $(document).scrollTop(circle.yCoord - gamePadding);
    $(document).scrollLeft(circle.xCoord - gamePadding * 3);
  }

  var previousXCoord, previousYcoord;

  function scrollPage() {
    if (previousXCoord && previousYcoord) window.scrollBy(circle.xCoord - previousXCoord, circle.yCoord - previousYcoord);
    previousXCoord = circle.xCoord;
    previousYcoord = circle.yCoord;
  }

  $(window).scroll(function() {
    $('.leaderBoard').css({ position: 'fixed', top: '0px' })
    $('h3').html('1. Leon : ' + circle.playerPoints)
  })

  function init() {
    backgroundGrid();
    food.fillFood(foodContext, gameBoundary);
    setInterval(move, 25);
    setInterval(scrollPage, 25);
    setInterval(refillFood, 30000);
    ballCanvas.addEventListener("mousemove", onMouseMove);
    setStartLocation();
  }

  function startPage() {
    $('.leaderBoard').hide();
    $('input:text').keypress(function(event) {
      if (event.keyCode == 13) {
        $('.start-game').click();
      }
    });
  }

  $('.start-game').click(function() {
    $('.leaderBoard').show();
    $('.startGame').hide();
    init();
  });

  startPage();

});

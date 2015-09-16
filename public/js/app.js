$(document).ready(function() {
  var socket = io.connect('http://localhost:3000');
  var ballCanvas = $(".ballCanvas")[0];
  var foodCanvas = $(".foodCanvas")[0];
  var gridCanvas = $(".gridCanvas")[0];
  var ballContext = ballCanvas.getContext("2d");
  var foodContext = foodCanvas.getContext("2d");
  var gridContext = gridCanvas.getContext("2d");

  var playerName;

  var gameBoundary = 2500;
  var gamePadding = 250;
  var xCoord = gameBoundary/2;
  var yCoord = gameBoundary/2;
  var xVelocity = 0;
  var yVelocity = 0;
  var defaultBallSpeed = 10;
  var slowDownFactor = 0.05;
  var defaultRadius = 15;
  var currentPlayer = {};
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
    circle.drawName(ballContext,playerName);
    console.log(circle.ID);
    if (hitsRightBoundary() || hitsLeftBoundary()) xVelocity = 0;
    if (hitsBottomBoundary() || hitsTopBoundary()) yVelocity = 0;
    if (mouseX) calculateBallVelocity();
    circle.xCoord += xVelocity;
    circle.yCoord += yVelocity;
    NewCirclePositions();
    UpdateCirclePositions();
    DrawOpponentCircle();
  }

  function DrawOpponentCircle() {
    socket.on('DrawOpponentCircle', function(data) {
      console.log("Opponent " + data.circle.playerID);
    });
  }

  function NewCirclePositions() {
    socket.emit('NewCirclePositions', { circlePositions: circle })
  }

  function UpdateCirclePositions() {
    socket.on('UpdateCirclePositions', function (data) {
      var circleInfo = data.circleData;
      console.log(circleInfo[circleInfo.length - 1]);
      // circle.ID = circleInfo.playerID;
      // circle.xCoord = data.circleData.xCoord;
      // circle.yCoord = data.circleData.yCoord;
      // circle.ID = data.circleData.playerID;
    });
  }

  function eatFood() {
    if (circle.hasCollided(food)) {
      socket.emit('sendEatenPosition', { eatenPosition: circle.collisionPosition });
      deleteFood(circle.collisionPosition);
      circle.getsBigger(food.radius);
    }
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

  var previousXCoord, previousYcoord;

  function scrollPage() {
    if (previousXCoord && previousYcoord) window.scrollBy(circle.xCoord - previousXCoord, circle.yCoord - previousYcoord);
    previousXCoord = circle.xCoord;
    previousYcoord = circle.yCoord;
  }

  $(window).scroll(function() {
    $('.leaderBoard').css({ position: 'fixed', top: '0px' });
    $('h3').html('1. ' + playerName + ' : ' + circle.playerPoints);
  });

  socket.on('receiveEatenPosition', function(data) {
    deleteFood(data.position);
  });

  function deleteFood(eatenPosition) {
    if (!!eatenPosition) {
      var index = food.foodPositions.indexOf(eatenPosition);
      if (index > 0) food.foodPositions.splice(index, 1);
      foodContext.clearRect(eatenPosition[0] - food.radius - 1.1, eatenPosition[1] - food.radius - 1.1, food.radius * 2.45, food.radius * 2.45);
      food.foodCount--;
    }
  }

  socket.on('sendFoodInfo', function(data) {
    food.fillFood(foodContext, data.foodPos, data.foodColour);
  });

  socket.on('player info', function(data) {
    currentPlayer.id = data.playerId;
    circle.playerID = data.playerId;
    currentPlayer.circle = circle;
    socket.emit('player object info', { player: currentPlayer });
    startPage();
  });

  function startPage() {
    $('.leaderBoard').hide();
    $('input:text').keypress(function(event) {
      if (event.keyCode == 13) {
        $('.start-game').click();
        playerName = $('.player-name').val();
      }
    });
  }

  $('.start-game').click(function() {
    $('.leaderBoard').show();
    $('.startGame').hide();
    playerName = $('.player-name').val();
    init();
  });

  function init() {
    backgroundGrid();
    setInterval(move, 5000);
    setInterval(eatFood, 25);
    setInterval(scrollPage, 25);
    // setInterval(refillFood, 30000);
    ballCanvas.addEventListener("mousemove", onMouseMove);
    setStartLocation();
  }

  function setStartLocation() {
    $(document).scrollTop(circle.yCoord - gamePadding);
    $(document).scrollLeft(circle.xCoord - gamePadding * 3);
  }
});

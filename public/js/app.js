$(document).ready(function() {
  // var socket = io.connect('https://agarioblacg.herokuapp.com/');
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
  var xCoord = gameBoundary / Math.round(Math.random() * 10);
  var yCoord = gameBoundary / Math.round(Math.random() * 10);
  var currentPlayer = {};
  var opponentCircle = new Circle(0, 0, 0);
  var circle = new Circle(xCoord, yCoord);
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
    // if(opponentCircle !== undefined) {
    // opponentCircle.draw(ballContext);
    //}
    if (hitsRightBoundary() || hitsLeftBoundary()) circle.xVelocity = 0;
    if (hitsBottomBoundary() || hitsTopBoundary()) circle.yVelocity = 0;
    if (mouseX) calculateBallVelocity();
    circle.xCoord += circle.xVelocity;
    circle.yCoord += circle.yVelocity;
    NewCirclePositions();
    UpdateCirclePositions();
  }

  function NewCirclePositions() {
    socket.emit('NewCirclePositions', { circlePositions: circle });
  }

  function UpdateCirclePositions() {
    socket.on('UpdateCirclePositions', function (data) {
      var circleInfo = data.circleData;
      var receivedCircle = circleInfo[circleInfo.length - 1];
      // console.log("Circle ID: " + receivedCircle.ID);
      // console.log(receivedCircle);
      // console.log("Player ID: " + circle.playerID);
      // if (receivedCircle.playerID === circle.playerID) {
      //   circle.xCoord = receivedCircle.xCoord;
      //   circle.yCoord = receivedCircle.yCoord;
      //   circle.radius = receivedCircle.radius;
      // }

      if (receivedCircle.playerID !== circle.playerID) {
        //opponentCircle = new Circle(receivedCircle.xCoord, receivedCircle.yCoord, receivedCircle.radius);
        opponentCircle.xCoord = receivedCircle.xCoord;
        opponentCircle.yCoord = receivedCircle.yCoord;
        opponentCircle.radius = receivedCircle.radius;
      }

    });
  }

  function eatFood() {
    if (circle.hasCollided(food)) {
      var collisionPosition = circle.collisionPosition;
      var collisionPositionIndex = food.foodPositions.indexOf(collisionPosition);
      socket.emit('sendEatenPosition', { eatenPosition: collisionPosition, eatenPositionIndex: collisionPositionIndex });
      deleteFood(collisionPosition);
      circle.getsBigger(food.radius);
      socket.emit('sendCurrentScore', { player: playerName, currentScore: circle.playerPoints });
    }
  }

  function hitsRightBoundary() {
    return ((circle.xCoord > gameBoundary - circle.radius * 1.5) && mouseX >= circle.xCoord);
  }

  function hitsLeftBoundary() {
    return (circle.xCoord < circle.radius * 1.5 && mouseX <= circle.xCoord);
  }

  function hitsTopBoundary() {
    return (circle.yCoord < circle.radius * 1.5 && mouseY <= circle.yCoord);
  }

  function hitsBottomBoundary() {
    return ((circle.yCoord > gameBoundary - circle.radius * 1.5) && mouseY >= circle.yCoord);
  }

  function onMouseMove(page) {
    mouseX = page.pageX - gamePadding;
    mouseY = page.pageY - gamePadding;
    calculateBallVelocity();
  }

  function calculateBallVelocity() {
    var xdiff = mouseX - circle.xCoord;
    var ydiff = mouseY - circle.yCoord;
    var mouseToBallDistance = Math.sqrt(xdiff * xdiff + ydiff * ydiff);
    var time = mouseToBallDistance / (circle.defaultBallSpeed * circle.sizeFactor());
    if (mouseToBallDistance < circle.radius) {
      circle.xVelocity = 0;
      circle.yVelocity = 0;
    } else {
      circle.xVelocity = Math.round(xdiff / time);
      circle.yVelocity = Math.round(ydiff / time);
    }
  }

  var previousXCoord, previousYcoord;

  function scrollPage() {
    if (previousXCoord && previousYcoord) window.scrollBy(circle.xCoord - previousXCoord, circle.yCoord - previousYcoord);
    previousXCoord = circle.xCoord;
    previousYcoord = circle.yCoord;
  }

  $(window).scroll(function() {
    $('.leaderBoard').css({ position: 'fixed', top: '0px' });
  });

  socket.on('receiveEatenPosition', function(data) {
    deleteFoodArray(data.position);
  });

  function deleteFoodArray(array) {
    if (array.length !== 0) {
      for (var i = 0; i < array.length; i++) {
        var index = food.foodPositions.indexOf(array[i]);
        if (index > 0) food.foodPositions.splice(index, 1);
        foodContext.clearRect(array[i][0] - food.radius - 1.1, array[i][1] - food.radius - 1.1, food.radius * 2.45, food.radius * 2.45);
        food.foodCount--;
      }
    }
  }

  function deleteFood(eatenPosition) {
    if (!!eatenPosition) {
      var index = food.foodPositions.indexOf(eatenPosition);
      if (index > 0) food.foodPositions.splice(index, 1);
      foodContext.clearRect(eatenPosition[0] - food.radius - 1.1, eatenPosition[1] - food.radius - 1.1, food.radius * 2.45, food.radius * 2.45);
      food.foodCount--;
    }
  }

  // socket.on('receiveCurrentScore', function(data) {
  //   displayScore(data.score);
  // });
  //
  // function displayScore(scoreArray) {
  //   $('h3').html('');
  //   var leaderBoard = $('<span>');
  //   for (var i = 0; i < scoreArray.length; i++) {
  //     leaderBoard.append(scoreArray[i].player + ' : ' + scoreArray[i].currentScore + ' ');
  //   }
  //   $('h3').html(leaderBoard);
  // }

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

  // socket.on('receiveRefillInformation', function(data) {
  //   food.fillFood(foodContext, data.refillFoodPos, data.refillFoodCols);
  // });

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
    setInterval(move, 25);
    setInterval(eatFood, 25);
    setInterval(scrollPage, 25);
    ballCanvas.addEventListener("mousemove", onMouseMove);
    setStartLocation();
  }

  function setStartLocation() {
    $(document).scrollTop(circle.yCoord - gamePadding + Math.random() * 500);
    $(document).scrollLeft(circle.xCoord - gamePadding * 3 + Math.random() * 500);
  }
});

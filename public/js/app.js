$(document).ready(function() {

  var socket = io.connect('http://localhost:3000');
  var ballCanvas = $(".ballCanvas")[0];
  var foodCanvas = $(".foodCanvas")[0];
  var gridCanvas = $(".gridCanvas")[0];
  var ballContext = ballCanvas.getContext("2d");
  var foodContext = foodCanvas.getContext("2d");
  var gridContext = gridCanvas.getContext("2d");

  var gameBoundary = 2500;
  var gamePadding = 250;
  var xCoord = gamePadding * 2 * Math.round(Math.random() * 4);
  var yCoord = gamePadding * 2 * Math.round(Math.random() * 4);
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
    socket.emit('newCircleInfo', { circleInfo: circle });
    if (hitsRightBoundary() || hitsLeftBoundary()) circle.xVelocity = 0;
    if (hitsBottomBoundary() || hitsTopBoundary()) circle.yVelocity = 0;
    if (mouseX) calculateBallVelocity();
    circle.xCoord += circle.xVelocity;
    circle.yCoord += circle.yVelocity;
    eatFood();
  }

  socket.on('updateCircleInfo', function (data) {
    ballContext.clearRect(0, 0, gameBoundary, gameBoundary);
    var coords = data.circleData;
    for(var i = 0; i < coords.length; i++){
      ballContext.fillStyle = coords[i].colour;
      ballContext.font = '20pt Calibri';
      ballContext.fillText(coords[i].playerName, coords[i].xCoord - coords[i].radius / 2, coords[i].yCoord - coords[i].radius);
      ballContext.beginPath();
      ballContext.arc(coords[i].xCoord, coords[i].yCoord, coords[i].radius, 0, Math.PI * 2, true);
      ballContext.fill();
    }
  });

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

  socket.on('receiveEatenPosition', function(data) {
    deleteFood(data.position);
  });

  function deleteFood(eatenPosition) {
    var index = food.foodPositions.indexOf(eatenPosition);
    if (index > 0) food.foodPositions.splice(index, 1);
    foodContext.clearRect(eatenPosition[0] - food.radius - 1.1, eatenPosition[1] - food.radius - 1.1, food.radius * 2.45, food.radius * 2.45);
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

  function startPage() {
    $('.leaderBoard').hide();
    $('input:text').keypress(function(event) {
      if (event.keyCode == 13) {
        $('.start-game').click();
        circle.playerName = $('.player-name').val();
      }
    });
  }

  $('.start-game').click(function() {
    $('.leaderBoard').show();
    $('.startGame').hide();
    circle.playerName = $('.player-name').val();
    socket.emit('startGame', {startGame: 'go'});
    init();
  });

  function init() {
    backgroundGrid();
    setInterval(move, 35);
    setInterval(scrollPage, 35);
    ballCanvas.addEventListener("mousemove", onMouseMove);
    setStartLocation();
  }

  function setStartLocation() {
    $(document).scrollLeft(circle.xCoord);
    $(document).scrollTop(circle.yCoord);
  }

  startPage();
});

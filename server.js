var express = require('express');
var app = express();

app.use(express.static('public'));

var server = require('http').Server(app);
var io = require('socket.io').listen(server);

server.listen(process.env.PORT || 3000);

var players = 0;
var gameBoundary = 2500;
var maxFoodCount = gameBoundary / 10;
var currentFoodCount = 0;
var foodPositions = [];
var foodRadius = 10;
var randomColourArray = [];
var circleInfoArray = [];
var eatenPosition;
// var scoreArray = {};

app.get('/', function(req, res) {
  res.sendfile('/index.html');
});

io.on('connection', function(socket) {
  socket.on('startGame', function(data) {
    players++;
    if(players === 1) { generateFoodInfo(maxFoodCount); }
    socket.emit('sendFoodInfo', {foodPos: foodPositions, foodColour: randomColourArray});
    setInterval(send, 30000);
  });

  socket.on('newCircleInfo', function(data) {
    circleInfoArray.push(data.circleInfo);
    if (circleInfoArray.length === players) {
      io.emit('updateCircleInfo', { circleData: circleInfoArray });
      circleInfoArray = [];
    }
  });

  socket.on('sendEatenPosition', function(data) {
    foodPositions.splice(data.eatenPositionIndex, 1);
    randomColourArray.splice(data.eatenPositionIndex, 1);
    currentFoodCount--;
    eatenPosition = data.eatenPosition;
    io.emit('receiveEatenPosition', {position: eatenPosition});
  });

  // need to fix this
  // socket.on('sendCurrentScore', function(data) {
  //   if (scoreArray.keys.include(data.player)) {
  //     var index = nameArray.indexOf(data.player);
  //     scoreArray[index].currentScore = data.currentScore;
  //   } else {
  //     scoreArray.push(data);
  //   }
  //   io.emit('receiveCurrentScore', {score: scoreArray});
  // });

  function send() {
    var refillCount = maxFoodCount - currentFoodCount;
    generateFoodInfo(refillCount);
    socket.emit('sendFoodInfo', {foodPos: foodPositions, foodColour: randomColourArray});
  }
});

function generateFoodInfo(numberOfTimes) {
  generateFoodPositions(numberOfTimes);
  generateRandomColour(numberOfTimes);
}

function generateFoodPositions(numberOfTimes) {
  for(var i=0; i<numberOfTimes; i++) {
    var xCoord = Math.round(Math.random() * (gameBoundary - foodRadius*2) + foodRadius);
    var yCoord = Math.round(Math.random() * (gameBoundary - foodRadius*2) + foodRadius);
    foodPositions.push([xCoord, yCoord]);
    currentFoodCount++;
  }
}

function generateRandomColour(numberOfTimes) {
  for(var i=0; i<numberOfTimes; i++) {
    var letters = '0123456789ABCDEF'.split('');
    var colour = '#';
    for (var j = 0; j < 6; j++) {
      colour += letters[Math.floor(Math.random() * 16)];
    }
    randomColourArray.push(colour);
  }
}

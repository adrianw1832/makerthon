var express = require('express');
var app = express();

var players = 0;

var gameBoundary = 2500;
var maxFood = gameBoundary/12;
var foodPositions = [];
var foodRadius = 10;
var randomColourArray = [];
var eatenPositions = [];
var scoreArray = [];
var nameArray = [];

app.use(express.static('public'));

var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);

app.get('/', function (req, res) {
  res.sendfile('/index.html');
});

io.on('connection', function (socket) {
  players++;
  var currentPlayer = { id: socket.id };
  socket.emit('player info', { playerId: socket.id});
  // socket.on('my other event', function (data) { console.log(data); });
  if(players === 1) { generateFoodInfo(); }
  socket.emit('sendFoodInfo', {foodPos: foodPositions, foodColour: randomColourArray});
  socket.on('sendEatenPosition', function(data) {
    foodPositions.splice(data.eatenPositionIndex, 1);
    randomColourArray.splice(data.eatenPositionIndex, 1);
    eatenPositions.push(data.eatenPosition);
  });
  socket.on('sendCurrentScore', function(data) {
    if (players === scoreArray.length) {
      var index = nameArray.indexOf(data.player);
      scoreArray[index].currentScore = data.currentScore;
    } else {
      scoreArray.push(data);
      nameArray.push(data.player);
    }
  });

  setInterval(sendEatenArray, 25);
  setInterval(sendCurrentScore, 50);

  function sendEatenArray() {
    var length = eatenPositions.length;
    socket.emit('receiveEatenPosition', {position: eatenPositions});
    eatenPositions.splice(0, length);
  }

  function sendCurrentScore() {
    socket.emit('receiveCurrentScore', {score: scoreArray});
  }
});

// function gameLoop() {
//   if(users.length > 0){
//
//   }
// }

function generateFoodInfo() {
  generateFoodPositions();
  generateRandomColour();
}

function generateFoodPositions() {
  for(var i=0; i<maxFood; i++) {
    var xCoord = Math.round(Math.random() * (gameBoundary - foodRadius*2) + foodRadius);
    var yCoord = Math.round(Math.random() * (gameBoundary - foodRadius*2) + foodRadius);
    foodPositions.push([xCoord, yCoord]);
  }
}

function generateRandomColour() {
  for(var i=0; i<maxFood; i++) {
    var letters = '0123456789ABCDEF'.split('');
    var colour = '#';
    for (var j = 0; j < 6; j++) {
      colour += letters[Math.floor(Math.random() * 16)];
    }
    randomColourArray.push(colour);
  }
}

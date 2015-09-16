var express = require('express');
var app = express();

var players = 0;

var gameBoundary = 2500;
var maxFood = gameBoundary/12;
var foodPositions = [];
var foodRadius = 10;
var randomColourArray = [];
var circleInfo = [];
var eatenPositions = [];

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
  socket.emit('player info', { playerId: socket.id });

  socket.on('player object info', function (data) {
  });

  socket.on('NewCirclePositions', function (data) {
    circleInfo.push(data.circlePositions);
  });
  setInterval(function() {
    socket.emit('UpdateCirclePositions', { circleData: circleInfo });

  }, 25);



  if(players === 1) { generateFoodInfo(); }
  socket.emit('sendFoodInfo', {foodPos: foodPositions, foodColour: randomColourArray});
  socket.on('sendEatenPosition', function(data) {
    foodPositions.splice(data.eatenPositionIndex, 1);
    randomColourArray.splice(data.eatenPositionIndex, 1);
    eatenPositions.push(data.eatenPosition);
  });
  setInterval(test, 25);

  function test() {
    var length = eatenPositions.length;
    socket.emit('receiveEatenPosition', {position: eatenPositions});
    eatenPositions.splice(0, length);
  }
});

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

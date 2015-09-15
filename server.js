var express = require('express');
var app = express();

var players = 0;

var gameBoundary = 2500;
var maxFood = gameBoundary/12;
var foodPositions = [];
var foodRadius = 10;

app.use(express.static('public'));

var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);

app.get('/', function (req, res) {
  res.sendfile('/index.html');
});

io.on('connection', function (socket) {

  console.log('a user is connected');
  players++;
  var currentPlayer = {
    id: socket.id

  };
  socket.emit('player info', { playerId: socket.id})
  socket.on('my other event', function (data) {
    console.log(data);
  })
  if(players === 1) { generateFoodPositions(); }
  socket.emit('sendFoodPositions', {foodPos: foodPositions});
});

function gameLoop() {
  if(users.length > 0){

  }
}

function generateFoodPositions() {
  for(var i=0; i<maxFood; i++) {
    var xCoord = Math.round(Math.random() * (gameBoundary - foodRadius*2) + foodRadius);
    var yCoord = Math.round(Math.random() * (gameBoundary - foodRadius*2) + foodRadius);
    foodPositions.push([xCoord, yCoord]);
  }
  return foodPositions;
}

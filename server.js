var express = require('express');
var app = express();

app.use(express.static('public'));

var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3000);

app.get('/', function (req, res) {
  res.sendfile('/index.html');
});

io.on('connection', function (socket) {
  if(!socket){

  }
  console.log('a user is connected');
  var currentPlayer = {
    id: socket.id
  };
  socket.emit('player info', { playerId: socket.id})
  socket.on('my other event', function (data) {
    console.log(data);
  })
});

function startGame(){

}

function Food(size) {
  this.foodCount = 0;
  this.maxFood = size/12;
  this.foodPositions = [];
  this.radius = 10;
}

var randomColourGenerator = new RandomColourGenerator();

var setProperties = function(foodContext) {
  foodContext.fillStyle = randomColourGenerator.getRandomColour();
  foodContext.fill();
  foodContext.strokeStyle = randomColourGenerator.getRandomColour();
  foodContext.stroke();
  foodContext.lineWidth = 1;
};

Food.prototype.fillFood = function(foodContext, gameBoundary) {
  while (this.foodCount < this.maxFood) {
    foodContext.beginPath();
    var xCoord = Math.round(Math.random() * (gameBoundary - this.radius*2) + this.radius);
    var yCoord = Math.round(Math.random() * (gameBoundary - this.radius*2) + this.radius);
    foodContext.arc(xCoord, yCoord, this.radius, 0, Math.PI * 2, true);
    this.foodPositions.push([xCoord, yCoord]);
    foodContext.closePath();
    setProperties(foodContext);
    this.foodCount++;
  }
};

function RandomColourGenerator() {
}

RandomColourGenerator.prototype.getRandomColour = function () {
  var letters = '0123456789ABCDEF'.split('');
  var colour = '#';
  for (var i = 0; i < 6; i++) {
    colour += letters[Math.floor(Math.random() * 16)];
  }
  return colour;
};

function gameLoop() {
  if(users.length > 0){

  }
}

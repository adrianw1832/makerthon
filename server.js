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
  console.log('a user is connected');
  var currentPlayer = {
    id: socket.id
  };
  socket.emit('player info', { playerId: socket.id})
  socket.on('my other event', function (data) {
    console.log(data);
  })
});

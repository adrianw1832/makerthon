function Circle(xCoord, yCoord, radius) {
  this.xCoord = xCoord;
  this.yCoord = yCoord;
  this.radius = radius;
}

var randomColour = new RandomColourGenerator().getRandomColour();

Circle.prototype.draw = function(ballContext) {
  ballContext.beginPath();
  ballContext.arc(this.xCoord, this.yCoord, this.radius, 0, Math.PI * 2, true);
  ballContext.closePath();
  getProperties(ballContext);
};

function getProperties(ballContext) {
  ballContext.fillStyle = randomColour;
  ballContext.fill();
  ballContext.strokeStyle = randomColour;
  ballContext.stroke();
  ballContext.shadowColor = '#999';
  ballContext.shadowBlur = 15;
  ballContext.shadowOffsetX = 3;
  ballContext.shadowOffsetY = 3;
  ballContext.lineWidth = 5;
}

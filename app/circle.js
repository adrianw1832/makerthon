function Circle(xCoord, yCoord, radius) {
  this.xCoord = xCoord;
  this.yCoord = yCoord;
  this.radius = radius;
  this.splitRadius = this.radius / 2;
  this.twinXCoord = this.xCoord - this.radius * 2;
  this.twinYCoord = this.yCoord - this.radius * 2;
  // this.centers = [];
}

var randomColour = new RandomColourGenerator().getRandomColour();

Circle.prototype.draw = function(ballContext) {
  ballContext.beginPath();
  ballContext.arc(this.xCoord, this.yCoord, this.radius, 0, Math.PI * 2, true);
  ballContext.closePath();
  getProperties(ballContext);
  // this.centers.push([this.xCoord, this.yCoord]);
};

Circle.prototype.splitsInTwo = function(ballContext) {
  ballContext.beginPath();
  ballContext.arc(this.xCoord, this.yCoord, this.splitRadius, 0, Math.PI * 2, true);
  ballContext.closePath();
  getProperties(ballContext);
  ballContext.beginPath();
  ballContext.arc(this.twinXCoord, this.twinYCoord, this.splitRadius, 0, Math.PI * 2, true);
  ballContext.closePath();
  getProperties(ballContext);
  // this.centers.push([this.twinXCoord, this.twinYCoord]);
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

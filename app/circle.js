function Circle(xCoord, yCoord, radius) {
  this.xCoord = xCoord;
  this.yCoord = yCoord;
  this.radius = radius;
}

Circle.prototype.draw = function(ballContext, colour) {
  ballContext.beginPath();
  ballContext.arc(this.xCoord, this.yCoord, this.radius, 0, Math.PI * 2, true);
  ballContext.closePath();
  ballContext.fillStyle = colour;
  ballContext.shadowColor = '#999';
  ballContext.shadowBlur = 15;
  ballContext.shadowOffsetX = 3;
  ballContext.shadowOffsetY = 3;
  ballContext.fill();
  ballContext.strokeStyle = colour;
  ballContext.lineWidth = 5;
  ballContext.stroke();
};

function Circle(xCoord, yCoord, radius) {
  this.xCoord = xCoord;
  this.yCoord = yCoord;
  this.radius = radius;
  this.playerPoints = 0;
  this.collisionPosition;
}

var randomColour = new RandomColourGenerator().getRandomColour();
var collisionPosition;

Circle.prototype.draw = function(ballContext) {
  ballContext.beginPath();
  ballContext.arc(this.xCoord, this.yCoord, this.radius, 0, Math.PI * 2, true);
  ballContext.closePath();
  getProperties(ballContext);
};

Circle.prototype.drawName = function(ballContext, playerName) {
  ballContext.font = '20pt Calibri';
  ballContext.fillStyle = 'black';
  ballContext.fillText(playerName, this.xCoord - this.radius/2, this.yCoord);
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

// Circle.prototype.hasCollided = function(food) {
//   for (var i = 0; i < food.foodPositions.length; i++) {
//     var xdiff = this.xCoord - food.foodPositions[i][0];
//     var ydiff = this.yCoord - food.foodPositions[i][1];
//     var foodToBallDistance = Math.sqrt(xdiff * xdiff + ydiff * ydiff);
//     if (foodToBallDistance < this.radius + food.radius) {
//       this.collisionPosition = food.foodPositions[i];
//       return true;
//     }
//   }
//   return false;
// };



// Circle.prototype.getsBigger = function(eatenCircleRadius) {
//   var originalCircle = Math.PI * this.radius * this.radius;
//   var eatenCircle = Math.PI * eatenCircleRadius * eatenCircleRadius;
//   this.playerPoints += parseInt((eatenCircleRadius / 2));
//   var newRadius = Math.sqrt((originalCircle + eatenCircle) / Math.PI);
//   this.radius = newRadius;
// };

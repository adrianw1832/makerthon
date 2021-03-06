function Circle(xCoord, yCoord) {
  this.xCoord = xCoord;
  this.yCoord = yCoord;
  this.xVelocity = 0;
  this.yVelocity = 0;
  this.playerPoints = 0;
  this.collisionPosition;
  this.playerID;
  this.playerName;
  this.defaultBallSpeed = 10;
  this.defaultRadius = 15;
  this.radius = this.defaultRadius;
  this.slowDownFactor = 0.05;
  this.colour = randomColour;
}

var randomColour = new RandomColourGenerator().getRandomColour();
var collisionPosition;

// Circle.prototype.clearBall = function(ballContext) {
//   ballContext.clearRect(this.prevX - this.radius - 5, this.prevY - this.radius - 5, this.radius * 2 + 10, this.radius * 2 + 10);
// };

Circle.prototype.sizeFactor = function() {
  return 1 - (this.radius / this.defaultRadius - 1) * this.slowDownFactor;
};

Circle.prototype.hasCollided = function(food) {
  for (var i = 0; i < food.foodPositions.length; i++) {
    var xdiff = this.xCoord - food.foodPositions[i][0];
    var ydiff = this.yCoord - food.foodPositions[i][1];
    var foodToBallDistance = Math.sqrt(xdiff * xdiff + ydiff * ydiff);
    if (foodToBallDistance < this.radius + food.radius) {
      this.collisionPosition = food.foodPositions[i];
      return true;
    }
  }
  this.collisionPosition = null;
  return false;
};

Circle.prototype.getsBigger = function(eatenCircleRadius) {
  var originalCircle = Math.PI * this.radius * this.radius;
  var eatenCircle = Math.PI * eatenCircleRadius * eatenCircleRadius;
  this.playerPoints += parseInt((eatenCircleRadius / 2));
  var newRadius = Math.sqrt((originalCircle + eatenCircle) / Math.PI);
  this.radius = newRadius;
};

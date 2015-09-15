function Circle(xCoord, yCoord, radius) {
  this.xCoord = xCoord;
  this.yCoord = yCoord;
  this.radius = radius;
}

var randomColour = new RandomColourGenerator().getRandomColour();
var collisionPosition;

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

Circle.prototype.hasCollided = function(food) {
  for (var i = 0; i < food.foodPositions.length; i++) {
    var xdiff = this.xCoord - food.foodPositions[i][0];
    var ydiff = this.yCoord - food.foodPositions[i][1];
    var foodToBallDistance = Math.sqrt(xdiff * xdiff + ydiff * ydiff);
    if (foodToBallDistance < this.radius + food.radius) {
      collisionPosition = food.foodPositions[i];
      return true;
    }
  }
  return false;
}

Circle.prototype.eatFood = function(foodContext, food) {
  if (this.hasCollided(food)) {
    var index = food.foodPositions.indexOf(collisionPosition);
    food.foodPositions.splice(index, 1);
    foodContext.clearRect(collisionPosition[0] - food.radius - 1.1, collisionPosition[1] - food.radius - 1.1, food.radius * 2.45, food.radius * 2.45);
    food.foodCount--;
    this.getsBigger(food.radius);
  }
}

Circle.prototype.getsBigger = function(eatenCircleRadius) {
  var originalCircle = Math.PI * this.radius * this.radius;
  var eatenCircle = Math.PI * eatenCircleRadius * eatenCircleRadius;
  var newRadius = Math.sqrt((originalCircle + eatenCircle) / Math.PI);
  this.radius = newRadius;
}

function Food() {
  this.foodCount = 0;
  this.maxFood = 300;
  this.foodPositions = [];
  this.radius = 12;
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

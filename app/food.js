function Food() {
  this.foodCount = 0;
  this.maxFood = 30;
  this.foodPositions = [];
  this.radius = 5;
}

var randomColourGenerator = new RandomColourGenerator();

var setProperties = function(foodContext) {
  foodContext.fillStyle = randomColourGenerator.getRandomColour();
  foodContext.fill();
  foodContext.strokeStyle = randomColourGenerator.getRandomColour();
  foodContext.stroke();
  foodContext.lineWidth = 1;
};

Food.prototype.fillFood = function(foodContext) {
  while (this.foodCount < this.maxFood) {
    foodContext.beginPath();
    var xCoord = Math.round(Math.random() * 990 + this.radius);
    var yCoord = Math.round(Math.random() * 990 + this.radius);
    foodContext.arc(xCoord, yCoord, 5, 0, Math.PI * 2, true);
    this.foodPositions.push([xCoord, yCoord]);
    foodContext.closePath();
    setProperties(foodContext);
    this.foodCount++;
  }
};

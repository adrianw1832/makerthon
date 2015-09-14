function Food() {
  this.food = 0;
  this.maxFood = 30;
  this.foodPositions = [];
  this.radius = 5;
}

var randomColourGenerator = new RandomColourGenerator();

Food.prototype.fillFood = function(foodContext) {
  while (this.food < this.maxFood) {
    foodContext.beginPath();
    var xCoord = Math.round(Math.random() * 1000);
    var yCoord = Math.round(Math.random() * 1000);
    foodContext.arc(xCoord, yCoord, 5, 0, Math.PI * 2, true);
    this.foodPositions.push([xCoord, yCoord]);
    foodContext.closePath();
    setProperties(foodContext);
    this.food++;
  }
};

var setProperties = function(foodContext) {
  foodContext.fillStyle = randomColourGenerator.getRandomColour();
  foodContext.fill();
  foodContext.strokeStyle = randomColourGenerator.getRandomColour();
  foodContext.stroke();
  foodContext.lineWidth = 1;
};

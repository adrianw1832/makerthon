function Food(size) {
  this.foodCount = 0;
  this.radius = 10;
  this.foodPositions;
}

var randomColourGenerator = new RandomColourGenerator();

var setProperties = function(foodContext) {
  foodContext.fillStyle = randomColourGenerator.getRandomColour();
  foodContext.fill();
  foodContext.strokeStyle = randomColourGenerator.getRandomColour();
  foodContext.stroke();
  foodContext.lineWidth = 1;
};

Food.prototype.fillFood = function(foodContext, foodPositions) {
  this.foodPositions = foodPositions;
  for(var i=0; i<foodPositions.length; i++){
    foodContext.beginPath();
    foodContext.arc(foodPositions[i][0], foodPositions[i][1], this.radius, 0, Math.PI * 2, true);
    foodContext.closePath();
    setProperties(foodContext);
    this.foodCount++;
  }
};

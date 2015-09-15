function Food(size) {
  this.foodCount = 0;
  this.radius = 10;
}

var randomColourGenerator = new RandomColourGenerator();


Food.prototype.fillFood = function(foodContext, foodPositions, foodColours) {
  for(var i=0; i<foodPositions.length; i++){
    foodContext.beginPath();
    foodContext.arc(foodPositions[i][0], foodPositions[i][1], this.radius, 0, Math.PI * 2, true);
    foodContext.closePath();
    setProperties(foodContext, foodColours[i]);
    this.foodCount++;
  }
};

var setProperties = function(foodContext, foodColours) {
  foodContext.fillStyle = foodColours;
  foodContext.fill();
  foodContext.strokeStyle = foodColours;
  foodContext.stroke();
  foodContext.lineWidth = 1;
};

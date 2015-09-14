function Food() {
  this.food = 0;
  this.maxFood = 30;
  this.foodPositions = [];
}

Food.prototype.fillFood = function(ctx) {
  function randomPOS() {
    return Math.round(Math.random() * 1000);
  }
  while (this.food < this.maxFood) {
    ctx.beginPath();
    var x = randomPOS();
    var y = randomPOS();
    ctx.arc(x, y, 5, 0, Math.PI * 2, true);
    this.foodPositions.push([x, y]);
    ctx.closePath();
    ctx.fill();
    this.food++;
  };
};

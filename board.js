function Food() {
  this.food = 0
  this.maxFood = 30
}

Food.prototype.fillFood = function(ctx) {
  function randomPOS() {
    return Math.round(Math.random() * 1000)
  }
  while (this.food < this.maxFood) {
    ctx.beginPath();
    ctx.arc(randomPOS(), randomPOS(), 5, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
    this.food++;
  };
};

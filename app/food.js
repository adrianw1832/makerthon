function Food() {
  this.food = 0;
  this.maxFood = 30;
  this.foodPositions = [];
  this.radius = 5;
};

Food.prototype.getRandomColour = function() {
  var letters = '0123456789ABCDEF'.split('');
  var colour = '#';
  for (var i = 0; i < 6; i++) {
    colour += letters[Math.floor(Math.random() * 16)];
  };
  return colour;
};

Food.prototype.fillFood = function(ctx) {
  function randomPOS() {
    return Math.round(Math.random() * 1000);
  };

  while (this.food < this.maxFood) {
    ctx.beginPath();
    var x = randomPOS();
    var y = randomPOS();
    ctx.arc(x, y, 5, 0, Math.PI * 2, true);
    this.foodPositions.push([x, y]);
    ctx.closePath();
    ctx.fillStyle = this.getRandomColour();
    ctx.fill();
    ctx.strokeStyle = this.getRandomColour();
    ctx.lineWidth = 1;
    ctx.stroke();
    this.food++;
  };
};

function Food() {
  this.food = 0;
  this.maxFood = 30;
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
    ctx.arc(randomPOS(), randomPOS(), 5, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = this.getRandomColour();
    ctx.fill();
    this.food++;
    ctx.strokeStyle = this.getRandomColour();
    ctx.lineWidth = 1;
    ctx.stroke();
  };
};

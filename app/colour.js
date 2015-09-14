function RandomColourGenerator() {
}

RandomColourGenerator.prototype.getRandomColour = function () {
  var letters = '0123456789ABCDEF'.split('');
  var colour = '#';
  for (var i = 0; i < 6; i++) {
    colour += letters[Math.floor(Math.random() * 16)];
  }
  return colour;
};

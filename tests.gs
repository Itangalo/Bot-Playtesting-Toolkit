function tmp() {
  let cardData = {
    title: 'Test card',
  }
  let d = new deck('test');
  d.constructCard(cardData);
  let c = d.draw();
  c.resolve('alpha', 'beta');
}

function resolver(a, b) {
  Logger.log(a);
  Logger.log(b);
}
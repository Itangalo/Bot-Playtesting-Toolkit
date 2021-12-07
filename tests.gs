function tmp() {
  let cardData = {
    title: 'Test card',
    resolver: 'log'
  }
  let d = new deck('test');
  d.constructCard(cardData);
  let c = d.draw();
  c.resolve(c);
  Logger.log(c instanceof card);
}

function resolver(a, b) {
  Logger.log(a);
  Logger.log(b);
}
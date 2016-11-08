var chai = require('chai');
var expect = chai.expect; // we are using the "expect" style of Chai
var Bot = require('./../../models/bot');

describe('Bot', function() {
  it('Bot() create new bot object with default value', function() {
    var newBot = Bot({
      name: 'Toto',
      zone: {
        coordinates: [[8.086, 3.455], [7.546, 5.558]]
      }
    });

    expect(newBot.name).to.equal('Toto');
    expect(newBot.zone.type).to.equal('Polygon');
    // expect(newBot.zone.coordinates).to.deep.members([[8.086, 3.455], [7.546, 5.558]]);
    expect(newBot.active).to.equal(true);
    expect(newBot.nb_driver).to.equal(1);
    expect(newBot.api_key).to.equal(undefined);
    expect(newBot.json_to_send).to.equal(undefined);
    expect(newBot.header_to_send).to.equal(undefined);
    expect(newBot.url).to.equal(undefined);
    expect(newBot.http_method).to.equal(undefined);
    expect(newBot.speed).to.equal(30);
    expect(newBot.precision).to.equal(20);
  });
});

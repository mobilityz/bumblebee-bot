var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
var expect = chai.expect;

var Bot = require('./../../models/bot');

describe('Bot()', function() {
  it('Create new bot object with default values', function() {
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
    expect(newBot.precision).to.equal(1000);
  });
});

// Doesn't curently works, fulfilled or rejected are always true ...
describe('Bot save()', function() {
  it('Is good', function() {
    var new_bot = Bot({
      name: 'Toto',
      zone: {
        coordinates: [[8.086, 3.455], [7.546, 5.558]]
      }
    });
    var bot_save = new_bot.save();

    expect(bot_save).to.be.fulfilled;
    expect(bot_save).to.eventually.be.equal({test: 5});
  });

  it('Should require name', function() {
    var new_bot = Bot({
      zone: {
        coordinates: [[8.086, 3.455], [7.546, 5.558]]
      }
    });
    var bot_save = new_bot.save();

    expect(bot_save).to.be.rejected;
  });

  it('Should require coordinates', function() {
    var new_bot = Bot({
      name: 'Toto1'
    });
    var bot_save = new_bot.save();

    expect(bot_save).to.be.rejected;
  });

  it('Attributes name has to be unique', function() {
    var new_bot = Bot({
      name: 'Toto',
      zone: {
        coordinates: [[8.086, 3.455], [7.546, 5.558]]
      }
    });
    var bot_save = new_bot.save();

    expect(bot_save).to.be.rejected;
  });
});

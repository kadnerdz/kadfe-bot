var client = require('kadfe-client');
var Botkit = require('botkit');

var controller = Botkit.slackbot({
  debug: true
})

var bot = controller.spawn({
  token: process.env.TOKEN
});

bot.startRTM(function(err,bot,payload) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }
});

controller.hears('brewed', ['direct_mention', 'mention'], (bot, message) => {
  bot.reply(message, "That's great news! I'll tell everyone.");
  client.makeCoffee()
    .then((body) => {
      bot.reply(message, "OK, coffee is now " + body['status'] + ".")
    })
    .catch((error) => {
      bot.reply(message, "Something's wrong! Specifically: `" + error + "`")
    });
});

controller.hears('claim', ['direct_mention', 'mention'], (bot, message) => {
  bot.reply(message, "Let's see...");
  client.coffeeStatus()
    .then((body) => {
      if (body['status'] === 'available') {
        client.claimCoffee()
          .then((body) => {
            bot.reply(message, "OK, coffee's yours!");
          })
          .catch((error) => {
            bot.reply(message, "Something's wrong! Specifically: `" + error + "`");
          });
      } else if (body['status'] === 'unavailable') {
        bot.reply(message, "No coffee for you!");
      } else {
        bot.reply(message, "This doesn't seem right. Yell @joe");
      }
    })
    .catch((error) => {
      bot.reply(message, "Something's wrong! Specifically: `" + error + "`");
    });
})

controller.hears('status', ['direct_mention'], (bot, message) => {
  bot.reply(message, "I'll check!");
  client.coffeeStatus()
    .then((body) => {
      bot.reply(message, "Coffee is " + body['status'] + "!");
    })
    .catch((error) => {
      bot.reply(message, "Something's wrong! Specifically: `" + error + "`");
    });
})

http.createServer().listen(process.env.PORT || 3000).on('error', console.log);

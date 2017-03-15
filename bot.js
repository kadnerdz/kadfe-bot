var client = require('kadfe-client');
var Botkit = require('botkit');
var http = require('http');

var controller = Botkit.slackbot({
  debug: false
})

var bot = controller.spawn({
  token: process.env.TOKEN
});

//console.log(process.env.TOKEN)

bot.startRTM(function(err,bot,payload) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }
});

controller.hears('brewed', ['direct_mention', 'mention'], (bot, message) => {
  bot.reply(message, "That's great news! I'll tell everyone.");
  client.makeCoffee();
});

controller.hears('claimed', ['direct_mention', 'mention'], (bot, message) => {
  bot.reply(message, "Let's see...");
  client.coffeeStatus
    .then(function (body) {
      if (body['status'] === 'available') {
        bot.reply(message, "OK, coffee's yours!");
      } else if (body['status'] === 'unavailable') {
        bot.reply(message, "No coffee for you!");
      } else {
        bot.reply(message, "This doesn't seem right. Yell @joe")
      }
    })
    .catch(function (error) {
      bot.reply(message, "Something's wrong! Yell @joe")
    });
})

controller.hears('status', ['direct_mention'], (bot, message) => {
  bot.reply(message, "I'll check!");
  client.coffeeStatus
    .then( (status) => {
      bot.reply(message, "Coffee available?" + status)
    })
})

http.createServer().listen(process.env.PORT || 3000).on('error', console.log);

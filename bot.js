var client = require('kadfe-client');
var Botkit = require('botkit');

var controller = Botkit.slackbot({
  debug: false
})

var bot = controller.spawn({
  token: process.env.TOKEN
});

console.log(process.env.TOKEN)

bot.startRTM(function(err,bot,payload) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }

  // close the RTM for the sake of it in 5 seconds
  /*setTimeout(function() {
      bot.closeRTM();
  }, 5000);*/
});

controller.hears('brewed', ['direct_mention', 'mention'], (bot, message) => {
  bot.reply(message, "That's great news! I'll tell everyone.");
  //client.makeCoffee();
});

controller.hears('claimed', ['direct_mention', 'mention'], (bot, message) => {
  bot.reply(message, "You got it boss!");
  //client.coffeeStatus();
})

controller.hears('status', ['direct_mention'], (bot, message) => {
  bot.reply(message, "I'll check!");
  //client.coffeeStatus();
})

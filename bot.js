var client = require('kadfe-client');
var Botkit = require('botkit');
var http = require('http');

var controller = Botkit.slackbot({
  debug: false
})

var bot = controller.spawn({
  token: process.env.TOKEN
});

//var socket = client.openSocket();
console.log(typeof client, typeof client.openSocket)

socket.on('message', (data) => {
  console.log(data);
  if (data === 'available') {
    bot.say({
      text: "Coffee is available! Write `@kadfe claim` to yank it from the crooked digits of your foes.",
      channel: "C48NXCVEY" // this is the #bottest channel
    });
  };
});

socket.on('close', () => {
  console.log('disconnected');
});

bot.startRTM(function(err,bot,payload) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }
});

controller.hears(['brewed', 'made'], ['direct_mention', 'mention'], (bot, message) => {
  client.makeCoffee()
    .then((body) => {
      bot.replyWithTyping(message, "That's great news! I've updated the coffee status to `available`")
    })
    .catch((error) => {
      bot.replyWithTyping(message, "Something's wrong! Specifically: `" + error + "`")
    });
});

controller.hears('claim', ['direct_mention', 'mention'], (bot, message) => {
  client.coffeeStatus()
    .then((body) => {
      if (body['status'] === 'available') {
        client.claimCoffee()
          .then((body) => {
            bot.replyWithTyping(message, "OK, coffee's yours!");
          })
          .catch((error) => {
            bot.replyWithTyping(message, "Something's wrong! Specifically: `" + error + "`");
          });
      } else if (body['status'] === 'unavailable') {
        bot.replyWithTyping(message, "No coffee for you!");
      } else {
        bot.replyWithTyping(message, "This doesn't seem right. Yell @joe");
      }
    })
    .catch((error) => {
      bot.replyWithTyping(message, "Something's wrong! Specifically: `" + error + "`");
    });
})

controller.hears('status', ['direct_mention', 'mention'], (bot, message) => {
  client.coffeeStatus()
    .then((body) => {
      bot.replyWithTyping(message, "Coffee is " + body['status'] + "!");
    })
    .catch((error) => {
      bot.replyWithTyping(message, "Something's wrong! Specifically: `" + error + "`");
    });
})

controller.hears('help', ['direct_mention', 'mention'], (bot, message) => {
  bot.reply(message, "Sup! I'm @kadfe, and I'm fairly dumb. I can recognize four whole words, though! Those are: `help` `brewed` `claim` `status`");
  bot.reply(message, "As an example, if you had said `@kadfe status` just now, I would reply:");
  client.coffeeStatus()
    .then((body) => {
      bot.replyWithTyping(message, ">Coffee is " + body['status'] + "!");
    })
    .catch((error) => {
      bot.replyWithTyping(message, "Something's wrong! Specifically: `" + error + "`");
    });
})

http.createServer().listen(process.env.PORT || 3000).on('error', console.log);

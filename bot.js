var client = require('kadfe-client');
var Botkit = require('botkit');
var http = require('http');
var WebSocket = require('ws');

var controller = Botkit.slackbot({
  debug: false
})

var bot = controller.spawn({
  token: process.env.TOKEN
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
            bot.replyWithTyping(message, `OK, coffee goes to <@${message.user}>!`);
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

controller.hears('love', ['direct_mention', 'mention'], (bot, message) => {
  bot.reply(message, "...I love to dance!");
  client.coffeeStatus()
    .then((body) => {
      if (body['status'] === 'available') {
        bot.replyWithTyping(message, "There's coffee by the way.");
      }
    })
    .catch();
})

var ws;
client.openSocket()
  .then((socket) => {
    ws = socket.on('message', (message) => {
      console.log(`coffee is ${message}`)
      if (message === 'available') {
        // figure out how to post to a channel without needing a reply
      } if (message === 'unavailable') {
        // figure out how to post to a channel without needing a reply
      }
    })
  }).catch((error) => {
    console.log(`websocket attempt failed: ${error}`)
  });

http.createServer().listen(process.env.PORT || 3000).on('error', console.log);

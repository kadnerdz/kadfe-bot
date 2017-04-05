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

var claimant = null;

controller.hears(['brewed', 'made'], ['direct_mention', 'mention'], (bot, message) => {
  client.makeCoffee()
    .then()
    .catch((error) => {
      bot.replyWithTyping(message, `Something's wrong! Specifically: \`${error}\``)
    });
});

controller.hears(['claim', 'mine'], ['direct_mention', 'mention'], (bot, message) => {
  client.coffeeStatus()
    .then((body) => {
      if (body['status'] === 'available' && !claimant) {
        claimant = message.user;
        bot.replyWithTyping(message, `OK, coffee goes to <@${claimant}>!`);
      } else if (body['status'] === 'available' && claimant != message.user) {
        bot.replyWithTyping(message, `This coffee belongs to <@${claimant}>. Shoo!`);
      } else if (body['status'] === 'available' && claimant === message.user) {
        bot.replyWithTyping(message, `It's yours already. Get moving!!`);
      } else {
        bot.replyWithTyping(message, "This doesn't seem right. Please yell @joe.");
      }
    })
    .catch((error) => {
      bot.replyWithTyping(message, `Something's wrong! Specifically: \`${error}\``);
    });
})

controller.hears(['clear', 'reset', 'gone'], ['direct_mention', 'mention'], (bot, message) => {
  claimant = null;
  client.clearCoffee()
    .then((body) => {
      bot.replyWithTyping(message, 'OK, all states reset.');
    })
    .catch((error) => {
      if (JSON.parse(error)['message'] === 'coffee already unavailable') {
        bot.replyWithTyping(message, 'OK, all states reset.');
      } else {
        bot.replyWithTyping(message, `Something's wrong! Specifically: \`${error}\``);
      }
    });
})

controller.hears('status', ['direct_mention', 'mention'], (bot, message) => {
  client.coffeeStatus()
    .then((body) => {
      if (body['status'] === 'available') {
        bot.replyWithTyping(message, claimant ? `<@${claimant}> needs to pick up their coffee!` : "There's coffee in dire need of claiming!")
      } else {
        bot.reply(message, `Coffee is ${body['status']}!`);
      }
    })
    .catch((error) => {
      bot.replyWithTyping(message, `Something's wrong! Specifically: \`${error}\``);
    });
})

controller.hears(['help'], ['direct_mention', 'mention'], (bot, message) => {
  bot.reply(message, "Hi! I'm @kadfe. I can recognize a few words! Those are: `brewed` `claim` `clear` `status` `help` \nAs an example, if you had said `@kadfe status` just now, I would reply:");
  setTimeout(() => {
    client.coffeeStatus()
      .then((body) => {
        bot.replyWithTyping(message, `>Coffee is ${body['status']}!`);
      })
      .catch((error) => {
        bot.replyWithTyping(message, `>Something's wrong! Specifically: \`${error}\``);
      });
  }, 1000);
})

controller.hears('love', ['direct_mention', 'mention'], (bot, message) => {
  bot.reply(message, "...I love to dance!");
  client.coffeeStatus()
    .then((body) => {
      if (body['status'] === 'available' && !claimant) {
        bot.replyWithTyping(message, "(There's coffee, by the way.)");
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
        bot.say({
          text: 'Coffee!!!',
          channel: process.env.KADFE_CHANNEL
        });
      } if (message === 'unavailable') {
        claimant = null;
      }
    })
  }).catch((error) => {
    console.log(`websocket attempt failed: ${error}`)
  });

setInterval(() => {
  client.coffeeStatus()
    .then()
    .catch((error) => {
      bot.say({
        text: `Something's wrong! Specifically: \`${error}\``,
        channel: 'C48NXCVEY'
      });
    });
}, 60 * 1000)

http.createServer((req, res) => {
  res.end();
}).listen(process.env.PORT || 3000).on('error', console.log);

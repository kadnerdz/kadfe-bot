var Botkit = require('botkit');
var http = require('http');
var server = REPLACE_WITH_URI;

var controller = Botkit.slackbot({
  debug: false;
})

var bot = controller.spawn({
  token: REPLACE_WITH_TOKEN;
});

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
  //make a POST to /brewed
});

controller.hears('claimed', ['direct_mention', 'mention'], (bot, message) => {
  if (/*GET /status*/) {
    bot.reply(message, "It's all yours, buddy!");
    //make a PUT to /claimed
  } else {
    bot.reply(message, "There's no coffee to claim! Go away!")
  }
})

controller.hears('status', ['direct_mention'], (bot, message) => {
  var status = /*GET /status*/ ? "" : "no "
  bot.reply(message, "There's " + status + 'coffee available for you!');
})

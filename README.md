# kadfe-bot
A sweet-ass bot for talking to humans about coffee. Makes requests and does a websocket thing.

## Commands
`brewed` | `made`: Send a POST to the server to tell it there's coffee. Relies on confirmation via websocket before announcing in channel that there's coffee.

`claim` | `mine`: Tell the bot you want the coffee. Claimant is stored in a global variable, and cleared when the coffee is taken. Bot won't let others take your coffee!

`clear` | `reset` | `gone`: Tell the bot to clear everything out. Clears the claimant and sends a DELETE request to the server.

`status`: GET the server to check if there's coffee.

`help`: Kicks off a help thing that gives you the primary command for each of these actions.

## Setup
The first of the following environment variables is used to hook up to the Slack RTM API. The latter three are used by the [web client](https://github.com/kadnerdz/kadfe-client) to provide the [kadfe-server](https://github.com/kadnerdz/kadfe-server) location.
+ `TOKEN` the Slack token for the bot
+ `KADFE_HOST` hostname for the kadfe server
+ `KADFE_SSL` whether SSL is required for the server
+ `KADFE_PORT` (optional) the port the server is listening on

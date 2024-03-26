# STREAMS NOTIFICATION DISCORD BOT

This repository explains and gives the source code of how to build a simple twitch streams discord bot notification within [Twitch EventSub](https://dev.twitch.tv/docs/eventsub/) using webhooks, instead of using third party applications or doing poll to the streams endpoint in NodeJS.

This repository uses:

* TypeScript 
* Seyfert 
* @twitchapi/eventsub
* @twitchapi/helix
* Express

### TypeScript

This is an alternative to JavaScript, developed by Microsoft, gives you the possibility to use types inside JavaScript and then build it into JavaScript.

### Seyfert 

A lightweight library to interact with the Bot API of Discord. Is one of the easiest and simplest ones to built commands and make you use less memory and resources than discord.js or other alternatives. To sum up it's the best NodeJS library nowadays for building a Discord Bot.

Here is the [official page](https://seyfert.dev) containing a guide and the docs.

### @twitchapi/eventsub

This is a library created by me to interact within the Twitch EventSub. It allows you to subscribe to topics/events using Webhooks or WebSocket and using callbacks for the follow of the notifications.

It implements a powerful feature which allows you to storage subscriptions inside a database or whatever you want and then recover at the start of the node process.

Here is the official [github repository](https://github.com/PabloRNC/twitchapi) and [page](https://pablornc.github.io/twitchapi).

> [!WARNING]
> Currently this package is in beta as it doesn't support all the kinds of events but the event we need for this bot is fully supported so don't warn about it. The latest realease which has been fully tested is 1.0.0-beta.18 but it doesn't incorpores all the features we need so we will use the latest beta which is 1.0.0-beta.23, don't worry because it will work at every moment. It's about time that the package exits from beta. 
### @twitchapi/helix

This is another make created by me which we are going to use it to make request to the Twitch API. We are not directly installing it as is used by the `@twitchapi/eventsub` package and we are using the client created for the package to make the request.

### Express

Express is a node framework to make servers and API's. We will create a server for creating webhook subscriptions that will be sent in response to the server.

### Basic Knowledges

For using this example I encourage to have a basic experience with TypeScript and NodeJS and having experience using JavaScript classes.

## Before you start - Enviromental Variables

Before you start you will need to fill the enviromental variables (.env) located in the [.env.example](.env.example). 

First of all you have to generate a Discord Bot Token for the `BOT_TOKEN` by creating a new app in the [Discord Developer Portal](https://discord.com/developers/applications).

Having created your app, generated the token and then inviting it to your server you will have to create a Twitch application in the [Developer Console](https://dev.twitch.tv/console) then you will have to copy the client id for the `TWITCH_CLIENT_ID` field and the client secret for the `TWITCH_CLIENT_SECRET` field.

After that you will need to create a database. In the example we are using mongo so you will have to create a Mongo Database and then coping the connection string and paste it in the `MONGO_URI` field.

Then you will have to fill the `WEBHOOK_SECRET` field with any string you want from 10 to 100 characters. 

Finally you have to fill the `LOCALTUNNEL_SUBDOMAIN` field with any string as we are using localtunnel to expose our localhost and have an `https` url required for the Twitch EventSub, and also fill `PORT` field for setting in which port of your machine the express server will be installed.

> [!WARNING]
> It's highly recommended to maintain and don't edit the `WEBHOOK_SECRET` or `LOCALTUNNEL_SUBDOMAIN` as this will make your subscriptions not to be recovered between process.


## Getting Started

First of all we have to clone this repository to get the source code by executing git clone command within the shell.

```bash
git clone https://github.com/PabloRNC/discord-streams-bot.git
```

Then after the repository is installed within your computer it's time to setup the project and install all the dependencies.

For this we are using `pnpm`, an alternative from `npm`. 

To install it you need to run this command:

```bash
npm i -g pnpm
```

Having installed `pnpm` it's time to install all the dependencies required in this project running:

```bash
pnpm i
```

When all the dependencies have been installed the next step is to built and compile the folder `src` containing all the TypeScript definitions and files. Running typescript compiler command in the root folder will compile the `src` folder.

```bash
tsc
```

## Final Steps

After compile TypeScript the final step it's to run the application by running node command

```bash
node .
```

Then you will start to see lots of logs in your console. If this happens without an error all it's ok. 
You can disable those logs by setting `debug` options within the seyfert client an WebhookConnection options into false.

If all it's correct you will see the commands being created in your guild. 

To check them you will only have to type one of those commands like `channels add` command.

## Important

As you can see this project runs without intermediate steps from the user requesting the notifications. This will mean that the user isn't authorizating within your Twitch app making each subscription from the EventSub you create cost `1`. Your application have a maximum cost of `10000` which you can't pass so your bot have only `10000` subscriptions to create. 

To solve it the only way it's making the broadcaster, which streams are being notified, to authorize within your app, this will make the subscription to cost `0`. Although this will mean that if an user want to be notified afrom the streams of another user who isn't him he can't make it as if he authorizes within your Twitch app will only make cost `0` to the subscription created for notifying about his streams and not about other ones.


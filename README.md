<h1 align="center">Welcome to amongusbot 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/oadpoaw/amongusbot/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

> Among Us Bot For Creating Temporary Voice Channels with Leveling System and more!

Join the bot developer's [discord](https://discord.gg/HG8s98Uk) for help and support!

## AmongUsBot
Among Us Bot is a discord bot focused on generating dynamic voice channels 

Features:
- A Leveling System with a time-time changing stats leaderboard
- Ban/Kick Voice Channel feature
- Mainly made for large discord servers using a bot like this
- and more!


## Requirements

- Requires [NodeJS](https://nodejs.org/) installed
- Requires a typescript compiler
  - If not use:
    ```sh
    $ npm install --global typescript
    ```

## Installation

```sh
$ git clone https://github.com/oadpoaw/amongusbot.git
$ cd amongusbot
```

Setup configuration on [config.json](/dist/config.json) <br>

Config Details:
```jsonc
{
    "prefix": "!", // Bot's prefix
    "bottoken": "", // Bot's discord api token

    /**
     * The Create Voice Channel ID 
     * Its the Channel where you click, it creates a voice channel lobby
     */
    "createChannel": "",
    /**
     * The Find Voice Channel ID
     * Its the Channel where you click, it finds a voice channel for you to join a lobby
     */
    "findChannel": "",
    /**
     * The Moderator role ID
     * The role who has permissions to manage the voice channels
     */
    "moderatorRole": "",
    /**
    * The Invite Channel ID
    * The channel ID where lobby invites are getting sent to
    */
    "inviteChannel": "",
    /**
    * The Channel Categories
    * The Categories where temporary voice channels are being made
    * [Must be in Order]
    *
    * Array of string
    */
    "categories": []
}
```

## Starting the bot

```sh
$ npm run start
# or
$ node .
```

## Awesome Commands

- `<>` is required argument
- `[]` is optional argument

| Name        | Description                                                          | Usage                  |
| ----------- | -------------------------------------------------------------------- | ---------------------- |
| code        | Set game code to your discord lobby! (Host Only)                     | `code <Code> [Region]` |
| init        | Initialize the Leaderboard channel (Admin Only)                      | `init`                 |
| invite      | Invite some users to your among us game! (Only on the InviteChannel) | `invite [Party Info]`  |
| leaderboard | Shows the leaderboard                                                | `leaderboard`          |
| ping        | pong!, dont worry, almost every bot has this command                 | `ping`                 |
| rank        | Shows your current ranking in the leaderboard                        | `rank [User]`          |
| vcban       | Ban someone from connecting to your voice channel lobby! (Host Only) | `vcban [User]`         |
| vckick      | Kick/Disconnect someone from your voice channel lobby! (Host Only)   | `vckick [User]`        |
| vcpardon    | Unban/Pardon someone from your voice channel lobby! (Host Only)      | `vcpardon [User]`      |

> What's the default bot prefix?
The default prefix is `!` but can be changed [here](src/config.ts)

> What's Host Only?
Means that only the Voice Channel Host/Owner can execute that command

> What's Admin Only?
Means that only a Server Admin with Manage Guild permission can execute that command

> What's Invite Channel Only?
Means that command can only be executed in a certain text channel set in [findChannel](src/config.ts)

> How does the leveling system works?
You get 10-20 exp per message in every 45 seconds. This can be altered if you know how ;) <br>
This uses the formula : `f(x) = 15x^2 + 50x + 150` <br>
You can check your exp and rank using `rank` command

> Where is help command?
I didn't add one, but if you want one, feel free to make a pull request


## Author

👤 **oadpoaw**

* Website: https://oadpoaw.xyz/
* Github: [@oadpoaw](https://github.com/oadpoaw)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/oadpoaw/amongusbot/issues). 

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2020 [oadpoaw](https://github.com/oadpoaw).<br />
This project is [MIT](https://github.com/oadpoaw/amongusbot/blob/master/LICENSE) licensed. <br>
If you are gonna use this bot please credit me, it means alot <3

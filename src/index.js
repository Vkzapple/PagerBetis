const fs = require("fs");
const path = require("path");
require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const commands = new Map();
const files = fs.readdirSync(path.join(__dirname, "commands"));

for (const file of files) {
  const cmd = require(`./commands/${file}`);
  commands.set(cmd.name, cmd);
}

client.on("messageCreate", (message) => {
  if (message.author.bot || !message.guild) return;

  const args = message.content.split(" ");
  const cmd = args.shift().toLowerCase();

  if (commands.has(cmd)) {
    commands.get(cmd).execute(message, args);
  }
});

client.once("ready", () => {
  console.log(`🟢 Bot online: ${client.user.tag}`);
});

client.login(process.env.TOKEN);

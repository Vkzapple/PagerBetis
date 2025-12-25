const fs = require("fs");
const path = require("path");
require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

const commands = new Map();
const commandsPath = path.join(__dirname, "commands");

// ✅ SAFE LOAD COMMANDS (ANTI CRASH)
if (fs.existsSync(commandsPath)) {
  const files = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

  for (const file of files) {
    const cmd = require(`./commands/${file}`);
    if (cmd.name && typeof cmd.execute === "function") {
      commands.set(cmd.name, cmd);
    }
  }

  console.log(`✅ Loaded ${commands.size} commands`);
} else {
  console.error("❌ Folder commands tidak ditemukan:", commandsPath);
}

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;

  const args = message.content.trim().split(/\s+/);
  const cmd = args.shift().toLowerCase();

  if (!commands.has(cmd)) return;

  try {
    await commands.get(cmd).execute(message, args);
  } catch (err) {
    console.error(err);
    message.reply("❌ Error bang, cek log dulu.");
  }
});

client.once("ready", () => {
  console.log(`🟢 Bot online: ${client.user.tag}`);
});

// 🔥 DEBUG TOKEN
console.log("TOKEN EXISTS:", !!process.env.TOKEN);

client.login(process.env.TOKEN);

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

// =========================
// DISCORD CLIENT
// =========================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// =========================
// LOAD COMMANDS (SAFE)
// =========================
const commands = new Map();
const commandsPath = path.join(__dirname, "commands");

if (fs.existsSync(commandsPath)) {
  const files = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

  for (const file of files) {
    try {
      console.log("Loading command:", file);
      const cmd = require(`./commands/${file}`);

      if (cmd.name && typeof cmd.execute === "function") {
        commands.set(cmd.name, cmd);
        console.log("Loaded:", cmd.name);
      } else {
        console.error("❌ Invalid command format:", file);
      }
    } catch (err) {
      console.error("❌ Error loading command:", file);
      console.error(err);
    }
  }
} else {
  console.error("❌ Folder commands tidak ditemukan:", commandsPath);
}

// =========================
// MESSAGE HANDLER
// =========================
client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;

  const args = message.content.trim().split(/\s+/);
  const cmd = args.shift().toLowerCase();

  if (!commands.has(cmd)) return;

  try {
    await commands.get(cmd).execute(message, args);
  } catch (err) {
    console.error("❌ Command error:", err);
    message.reply("❌ Error bang, cek log dulu.");
  }
});

// =========================
// READY
// =========================
client.once("ready", () => {
  console.log(`🟢 Bot online: ${client.user.tag}`);
});

// =========================
// LOGIN
// =========================
console.log("TOKEN EXISTS:", !!process.env.TOKEN);

if (!process.env.TOKEN) {
  console.error("❌ TOKEN tidak ditemukan. Cek Railway Variables.");
  process.exit(1);
}

client.login(process.env.TOKEN);

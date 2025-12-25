const {
  joinVoiceChannel,
  getVoiceConnection,
  VoiceConnectionStatus,
  entersState
} = require("@discordjs/voice");

module.exports = {
  name: "!jaga",
  async execute(message) {
    const vc = message.member.voice.channel;
    if (!vc) return message.reply("Masuk voice dulu bang 🗣️");

    const connection = joinVoiceChannel({
      channelId: vc.id,
      guildId: vc.guild.id,
      adapterCreator: vc.guild.voiceAdapterCreator,
      selfDeaf: true
    });

    connection.on(VoiceConnectionStatus.Disconnected, async () => {
      try {
        await Promise.race([
          entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
          entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
        ]);
      } catch {
        connection.destroy();
      }
    });

    message.reply("👮 Bot jaga voice ini, Basecamp aman BOSSSSQUUU!");
  }
};

// src/commands/pergi.js
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {
  name: "!pergi",
  execute(message) {
    const conn = getVoiceConnection(message.guild.id);
    if (!conn) return message.reply("Bot kaga di voice bang.");

    conn.destroy();
    message.reply("👋 Cabut dari voice");
  }
};

const {
  joinVoiceChannel,
  getVoiceConnection,
  VoiceConnectionStatus,
  entersState
} = require("@discordjs/voice");

module.exports = {
  name: "!jaga",
  execute(message) {
    const vc = message.member.voice.channel;
    if (!vc) return message.reply("Masuk voice dulu bang");

    const existing = getVoiceConnection(vc.guild.id);
    if (existing) {
      return message.reply("Bot udah jaga voice bang");
    }

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
          entersState(connection, VoiceConnectionStatus.Connecting, 5_000)
        ]);
      } catch {
        connection.destroy();
      }
    });

    message.reply("Bot jaga voice. Basecamp aman.");
  }
};

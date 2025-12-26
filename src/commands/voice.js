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
    if (!vc) return message.reply("Masuk voice dulu bang");

    let connection = getVoiceConnection(vc.guild.id);

    if (!connection) {
      connection = joinVoiceChannel({
        channelId: vc.id,
        guildId: vc.guild.id,
        adapterCreator: vc.guild.voiceAdapterCreator,
        selfDeaf: false   
      });
    }

    connection.on(VoiceConnectionStatus.Disconnected, async () => {
      try {
        await Promise.race([
          entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
          entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
        ]);

      } catch { 
        connection.destroy();
        joinVoiceChannel({
          channelId: vc.id,
          guildId: vc.guild.id,
          adapterCreator: vc.guild.voiceAdapterCreator,
          selfDeaf: false
        });
      }
    });

    message.reply("bot udah masuk, selaww aja bang!");
  }
};
